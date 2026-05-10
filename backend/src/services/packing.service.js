const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const PackingList = require('../models/PackingList');

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

  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  return trip;
};

// ---------------------------------------------------------------------------
// getPackingList
// Req 10.1 – returns the packing list for a trip
// Ownership check via trip lookup.
// 404 if no packing list exists for the trip.
// ---------------------------------------------------------------------------
const getPackingList = async (userId, tripId) => {
  await findTripForUser(userId, tripId);

  const packingList = await PackingList.findOne({ tripId });

  if (!packingList) {
    throw createError('Packing list not found for this trip', 404, [
      { field: 'tripId', message: 'Packing list not found for this trip' },
    ]);
  }

  return packingList;
};

// ---------------------------------------------------------------------------
// createPackingList
// Req 10.1 – create packing list with array of items (name, category)
// Req 10.2 – return created packing list
// 409 if a packing list already exists for the trip.
// ---------------------------------------------------------------------------
const createPackingList = async (userId, tripId, items) => {
  await findTripForUser(userId, tripId);

  const existing = await PackingList.findOne({ tripId });
  if (existing) {
    throw createError('A packing list already exists for this trip', 409, [
      { field: 'tripId', message: 'A packing list already exists for this trip' },
    ]);
  }

  const packingList = await PackingList.create({
    tripId,
    items: items || [],
  });

  return packingList;
};

// ---------------------------------------------------------------------------
// addItem
// Req 10.4 – POST single item to existing packing list
// 404 if packing list doesn't exist; appends item to items array.
// ---------------------------------------------------------------------------
const addItem = async (userId, tripId, item) => {
  await findTripForUser(userId, tripId);

  const packingList = await PackingList.findOne({ tripId });

  if (!packingList) {
    throw createError('Packing list not found for this trip', 404, [
      { field: 'tripId', message: 'Packing list not found for this trip' },
    ]);
  }

  packingList.items.push(item);
  await packingList.save();

  return packingList;
};

// ---------------------------------------------------------------------------
// toggleItem
// Req 10.3 – PATCH item to toggle packed boolean
// 404 if packing list or item not found; sets item.packed = packed.
// ---------------------------------------------------------------------------
const toggleItem = async (userId, tripId, itemId, packed) => {
  await findTripForUser(userId, tripId);

  const packingList = await PackingList.findOne({ tripId });

  if (!packingList) {
    throw createError('Packing list not found for this trip', 404, [
      { field: 'tripId', message: 'Packing list not found for this trip' },
    ]);
  }

  const item = packingList.items.id(itemId);

  if (!item) {
    throw createError('Item not found', 404, [
      { field: 'itemId', message: 'Item not found' },
    ]);
  }

  item.packed = packed;
  await packingList.save();

  return packingList;
};

// ---------------------------------------------------------------------------
// deleteItem
// Req 10.5 – DELETE item from packing list
// 404 if packing list or item not found; removes item from array.
// ---------------------------------------------------------------------------
const deleteItem = async (userId, tripId, itemId) => {
  await findTripForUser(userId, tripId);

  const packingList = await PackingList.findOne({ tripId });

  if (!packingList) {
    throw createError('Packing list not found for this trip', 404, [
      { field: 'tripId', message: 'Packing list not found for this trip' },
    ]);
  }

  const item = packingList.items.id(itemId);

  if (!item) {
    throw createError('Item not found', 404, [
      { field: 'itemId', message: 'Item not found' },
    ]);
  }

  item.deleteOne();
  await packingList.save();

  return packingList;
};

module.exports = {
  getPackingList,
  createPackingList,
  addItem,
  toggleItem,
  deleteItem,
};
