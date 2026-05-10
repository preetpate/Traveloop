const mongoose = require('mongoose');
const User = require('../models/User');
const Trip = require('../models/Trip');

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
// getUsers
// Paginated list of all users. Optional search filters by name or email.
// Each user document is augmented with a tripCount field.
// Returns { users, total, page, pages }
// ---------------------------------------------------------------------------
const getUsers = async (page = 1, limit = 20, search = '') => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  // Build query filter
  const filter = {};
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [rawUsers, total] = await Promise.all([
    User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  // Attach tripCount to each user
  const users = await Promise.all(
    rawUsers.map(async (user) => {
      const tripCount = await Trip.countDocuments({ userId: user._id });
      return { ...user, tripCount };
    })
  );

  const pages = Math.ceil(total / limitNum);

  return { users, total, page: pageNum, pages };
};

// ---------------------------------------------------------------------------
// updateUserRole
// Admin can change another user's role. Cannot change own role.
// Valid roles: 'user' | 'admin'
// Returns updated user without passwordHash.
// ---------------------------------------------------------------------------
const updateUserRole = async (adminId, userId, role) => {
  if (adminId.toString() === userId.toString()) {
    throw createError('You cannot change your own role', 400, [
      { field: 'userId', message: 'You cannot change your own role' },
    ]);
  }

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    throw createError(`role must be one of: ${validRoles.join(', ')}`, 400, [
      { field: 'role', message: `role must be one of: ${validRoles.join(', ')}` },
    ]);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('User not found', 404, [
      { field: 'userId', message: 'User not found' },
    ]);
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!updated) {
    throw createError('User not found', 404, [
      { field: 'userId', message: 'User not found' },
    ]);
  }

  return updated;
};

// ---------------------------------------------------------------------------
// deleteUser
// Admin can delete another user. Cannot delete self.
// Deletes all trips (each via trip.deleteOne() to trigger cascade hooks),
// then deletes the user document.
// Returns { message }
// ---------------------------------------------------------------------------
const deleteUser = async (adminId, userId) => {
  if (adminId.toString() === userId.toString()) {
    throw createError('You cannot delete your own account via this endpoint', 400, [
      { field: 'userId', message: 'You cannot delete your own account via this endpoint' },
    ]);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('User not found', 404, [
      { field: 'userId', message: 'User not found' },
    ]);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404, [
      { field: 'userId', message: 'User not found' },
    ]);
  }

  // Delete all trips individually to trigger the cascade deleteOne hook
  // (which removes associated Budget, PackingList, and Notes)
  const trips = await Trip.find({ userId: user._id });
  for (const trip of trips) {
    await trip.deleteOne();
  }

  await user.deleteOne();

  return { message: 'User and all associated data deleted successfully.' };
};

// ---------------------------------------------------------------------------
// getAnalytics
// Returns a single analytics object with:
//   - totalUsers
//   - totalTrips
//   - newUsersLast30d
//   - newTripsLast30d
//   - topCities      (top 5 cities from stops)
//   - topCategories  (top 5 activity categories)
// ---------------------------------------------------------------------------
const getAnalytics = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalTrips,
    newUsersLast30d,
    newTripsLast30d,
    topCitiesResult,
    topCategoriesResult,
  ] = await Promise.all([
    // Total users
    User.countDocuments(),

    // Total trips
    Trip.countDocuments(),

    // New users in last 30 days
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

    // New trips in last 30 days
    Trip.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

    // Top 5 cities from stops
    Trip.aggregate([
      { $unwind: '$stops' },
      {
        $group: {
          _id: '$stops.cityName',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          city: '$_id',
          count: 1,
        },
      },
    ]),

    // Top 5 activity categories
    Trip.aggregate([
      { $unwind: '$stops' },
      { $unwind: '$stops.activities' },
      {
        $group: {
          _id: '$stops.activities.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]),
  ]);

  return {
    totalUsers,
    totalTrips,
    newUsersLast30d,
    newTripsLast30d,
    topCities: topCitiesResult,
    topCategories: topCategoriesResult,
  };
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
};
