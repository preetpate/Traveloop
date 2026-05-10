const crypto = require('crypto');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { sha256 } = require('../utils/hash');

// ---------------------------------------------------------------------------
// Helper: build a custom error with a statusCode property so the global
// error handler can pick up the right HTTP status.
// ---------------------------------------------------------------------------
const createError = (message, statusCode, errors = []) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.errors = errors;
  return err;
};

// ---------------------------------------------------------------------------
// Helper: strip sensitive fields from a Mongoose User document before
// returning it to the caller.
// ---------------------------------------------------------------------------
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

// ---------------------------------------------------------------------------
// registerUser
// Req 1.2 – hash password, return JWT
// Req 1.3 – duplicate email → 409
// Req 1.4 – password < 8 chars → 400
// ---------------------------------------------------------------------------
const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw createError('name, email, and password are required', 400, [
      { field: 'general', message: 'name, email, and password are required' },
    ]);
  }

  if (password.length < 8) {
    throw createError('Password must be at least 8 characters', 400, [
      { field: 'password', message: 'Password must be at least 8 characters' },
    ]);
  }

  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw createError('An account with that email already exists', 409, [
      { field: 'email', message: 'An account with that email already exists' },
    ]);
  }

  // The User model's pre-save hook hashes passwordHash automatically
  const user = await User.create({ name, email, passwordHash: password });

  const token = signToken({ id: user._id, role: user.role });

  return { token, user: sanitizeUser(user) };
};

// ---------------------------------------------------------------------------
// loginUser
// Req 2.2 – return JWT + user profile (no passwordHash)
// Req 2.3 – wrong email or wrong password → same generic 401
// ---------------------------------------------------------------------------
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw createError('Email and password are required', 400, [
      { field: 'general', message: 'Email and password are required' },
    ]);
  }

  // Use a single generic error for both "not found" and "wrong password"
  // to prevent user enumeration (Req 2.3)
  const genericError = createError('Invalid email or password', 401, [
    { field: 'general', message: 'Invalid email or password' },
  ]);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw genericError;

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw genericError;

  const token = signToken({ id: user._id, role: user.role });

  return { token, user: sanitizeUser(user) };
};

// ---------------------------------------------------------------------------
// forgotPassword
// Req 3.2 – unregistered email → return success (no enumeration)
// Req 3.5 – token valid 1 hour; store SHA-256 hash
// ---------------------------------------------------------------------------
const forgotPassword = async (email) => {
  if (!email) {
    throw createError('Email is required', 400, [
      { field: 'email', message: 'Email is required' },
    ]);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success to prevent user enumeration (Req 3.2)
  if (!user) {
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  // Generate a cryptographically random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = sha256(rawToken);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Store the hash (never the plaintext) and expiry
  user.resetToken = hashedToken;
  user.resetTokenExpiry = expiry;
  await user.save({ validateModifiedOnly: true });

  // In a production system the rawToken would be emailed to the user.
  // We return it here so the route handler / email service can use it.
  return {
    message: 'If that email is registered, a reset link has been sent.',
    resetToken: rawToken, // plaintext — to be sent via email, not stored
  };
};

// ---------------------------------------------------------------------------
// resetPassword
// Req 3.5 – validate token, update hash, invalidate token
// Req 3.6 – expired/invalid token → 400
// ---------------------------------------------------------------------------
const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw createError('Token and new password are required', 400, [
      { field: 'general', message: 'Token and new password are required' },
    ]);
  }

  if (newPassword.length < 8) {
    throw createError('Password must be at least 8 characters', 400, [
      { field: 'password', message: 'Password must be at least 8 characters' },
    ]);
  }

  const hashedToken = sha256(token);

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: new Date() }, // token must not be expired
  });

  if (!user) {
    throw createError('Reset token is invalid or has expired', 400, [
      { field: 'token', message: 'Reset token is invalid or has expired' },
    ]);
  }

  // Update password — the pre-save hook will hash it
  user.passwordHash = newPassword;
  // Invalidate the token (Req 3.5)
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save({ validateModifiedOnly: true });

  return { message: 'Password has been reset successfully.' };
};

// ---------------------------------------------------------------------------
// getMe
// Returns the user profile for the given userId (no sensitive fields)
// ---------------------------------------------------------------------------
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404, [
      { field: 'general', message: 'User not found' },
    ]);
  }
  return sanitizeUser(user);
};

// ---------------------------------------------------------------------------
// updateProfile
// Req 16.2 – update name, bio, avatarUrl, homeCountry
// Req 16.3 – email belonging to another user → 409
// ---------------------------------------------------------------------------
const updateProfile = async (userId, data) => {
  const { name, bio, avatarUrl, homeCountry, email } = data;

  // If an email update is requested, check it isn't taken by another user
  if (email) {
    const conflict = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });
    if (conflict) {
      throw createError('That email address is already in use', 409, [
        { field: 'email', message: 'That email address is already in use' },
      ]);
    }
  }

  const allowedUpdates = {};
  if (name !== undefined) allowedUpdates.name = name;
  if (bio !== undefined) allowedUpdates.bio = bio;
  if (avatarUrl !== undefined) allowedUpdates.avatarUrl = avatarUrl;
  if (homeCountry !== undefined) allowedUpdates.homeCountry = homeCountry;
  if (email !== undefined) allowedUpdates.email = email.toLowerCase();

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw createError('User not found', 404, [
      { field: 'general', message: 'User not found' },
    ]);
  }

  return sanitizeUser(user);
};

// ---------------------------------------------------------------------------
// changePassword
// Req 16.6 – verify currentPassword; wrong → 401
// ---------------------------------------------------------------------------
const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw createError('currentPassword and newPassword are required', 400, [
      { field: 'general', message: 'currentPassword and newPassword are required' },
    ]);
  }

  if (newPassword.length < 8) {
    throw createError('New password must be at least 8 characters', 400, [
      { field: 'newPassword', message: 'New password must be at least 8 characters' },
    ]);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404, [
      { field: 'general', message: 'User not found' },
    ]);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw createError('Current password is incorrect', 401, [
      { field: 'currentPassword', message: 'Current password is incorrect' },
    ]);
  }

  // The pre-save hook will hash the new password
  user.passwordHash = newPassword;
  await user.save({ validateModifiedOnly: true });

  return { message: 'Password updated successfully.' };
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
};
