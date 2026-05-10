const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  bio:          { type: String, default: '' },
  avatarUrl:    { type: String, default: '' },
  homeCountry:  { type: String, default: '' },
  resetToken:   { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
}, { timestamps: true });

UserSchema.index({ email: 1 });

// Hash passwordHash before saving if it has been modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare a plaintext password against the stored hash
UserSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
