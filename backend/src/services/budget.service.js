const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Budget = require('../models/Budget');

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
// Helper: verify the trip exists and belongs to the given user.
// Returns the trip document on success.
// - Invalid / missing tripId → 404
// - Trip not found → 404
// - Trip owned by a different user → 404 (intentionally opaque for security)
// ---------------------------------------------------------------------------
const findTripForUser = async (userId, tripId) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  // Single query: trip must exist AND belong to this user (Req 5.7)
  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  return trip;
};

// ---------------------------------------------------------------------------
// Helper: validate that sum(categories[i].allocatedAmount) <= totalBudget.
// Throws HTTP 400 if the constraint is violated (Req 9.5).
// ---------------------------------------------------------------------------
const validateAllocationConstraint = (totalBudget, categories) => {
  if (!Array.isArray(categories) || categories.length === 0) return;

  const totalAllocated = categories.reduce(
    (sum, cat) => sum + (cat.allocatedAmount || 0),
    0
  );

  if (totalAllocated > totalBudget) {
    throw createError(
      'Sum of allocated amounts cannot exceed the total budget',
      400,
      [
        {
          field: 'categories',
          message: `Sum of allocatedAmount values (${totalAllocated}) exceeds totalBudget (${totalBudget})`,
        },
      ]
    );
  }
};

// ---------------------------------------------------------------------------
// getBudget
// Req 9.4 – returns budget with virtuals (remainingBudget, totalSpent)
// Ownership check via trip lookup.
// ---------------------------------------------------------------------------
const getBudget = async (userId, tripId) => {
  // Ownership check — throws 404 if trip not found or not owned by user
  await findTripForUser(userId, tripId);

  const budget = await Budget.findOne({ tripId });

  if (!budget) {
    throw createError('Budget not found for this trip', 404, [
      { field: 'tripId', message: 'Budget not found for this trip' },
    ]);
  }

  // toJSON with virtuals is enabled on the schema; returning the document
  // directly will include remainingBudget and totalSpent automatically.
  return budget;
};

// ---------------------------------------------------------------------------
// createBudget
// Req 9.1 – create budget linked to trip, return it
// Req 9.2 – return created budget
// Req 9.5 – sum(allocatedAmounts) > totalBudget → 400
// Duplicate budget for same trip → 409
// ---------------------------------------------------------------------------
const createBudget = async (userId, tripId, data) => {
  // Ownership check
  await findTripForUser(userId, tripId);

  const { totalBudget, categories } = data;

  if (totalBudget === undefined || totalBudget === null) {
    throw createError('totalBudget is required', 400, [
      { field: 'totalBudget', message: 'totalBudget is required' },
    ]);
  }

  if (typeof totalBudget !== 'number' || totalBudget < 0) {
    throw createError('totalBudget must be a non-negative number', 400, [
      { field: 'totalBudget', message: 'totalBudget must be a non-negative number' },
    ]);
  }

  // Validate allocation constraint before attempting to save (Req 9.5)
  validateAllocationConstraint(totalBudget, categories || []);

  // Check for existing budget — one budget per trip (unique index on tripId)
  const existing = await Budget.findOne({ tripId });
  if (existing) {
    throw createError('A budget already exists for this trip', 409, [
      { field: 'tripId', message: 'A budget already exists for this trip' },
    ]);
  }

  const budget = await Budget.create({
    tripId,
    totalBudget,
    categories: categories || [],
  });

  return budget;
};

// ---------------------------------------------------------------------------
// updateBudget
// Req 9.3 – update totalBudget or category amounts
// Req 9.4 – remainingBudget recalculated via virtuals
// Req 9.5 – sum(allocatedAmounts) > totalBudget → 400
// ---------------------------------------------------------------------------
const updateBudget = async (userId, tripId, data) => {
  // Ownership check
  await findTripForUser(userId, tripId);

  const budget = await Budget.findOne({ tripId });

  if (!budget) {
    throw createError('Budget not found for this trip', 404, [
      { field: 'tripId', message: 'Budget not found for this trip' },
    ]);
  }

  const { totalBudget, categories } = data;

  // Determine effective values after applying the update
  const effectiveTotalBudget =
    totalBudget !== undefined ? totalBudget : budget.totalBudget;

  const effectiveCategories =
    categories !== undefined ? categories : budget.categories;

  // Validate totalBudget if provided
  if (totalBudget !== undefined) {
    if (typeof totalBudget !== 'number' || totalBudget < 0) {
      throw createError('totalBudget must be a non-negative number', 400, [
        { field: 'totalBudget', message: 'totalBudget must be a non-negative number' },
      ]);
    }
  }

  // Validate allocation constraint against the effective state (Req 9.5)
  validateAllocationConstraint(effectiveTotalBudget, effectiveCategories);

  // Apply updates
  if (totalBudget !== undefined) budget.totalBudget = totalBudget;
  if (categories !== undefined) budget.categories = categories;

  await budget.save();

  // Return the saved document — virtuals (remainingBudget, totalSpent) are
  // included automatically because toJSON: { virtuals: true } is set on the schema.
  return budget;
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
};
