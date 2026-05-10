const crypto = require('crypto');
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
// generateShareToken
// Req 14.1 – authenticated user generates a shareable token for their trip
// Ownership check: trip must belong to the requesting user.
// Generates a URL-safe hex token, stores it on the trip, and returns the
// token along with the public URL.
// ---------------------------------------------------------------------------
const generateShareToken = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  const shareToken = crypto.randomBytes(32).toString('hex');
  trip.shareToken = shareToken;
  await trip.save();

  return {
    shareToken,
    publicUrl: '/public-itinerary/' + shareToken,
  };
};

// ---------------------------------------------------------------------------
// getPublicTrip
// Req 14.2 – anyone with the share token can view the trip (no auth required)
// ---------------------------------------------------------------------------
const getPublicTrip = async (shareToken) => {
  const trip = await Trip.findOne({ shareToken });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'shareToken', message: 'Trip not found' },
    ]);
  }

  return trip;
};

// ---------------------------------------------------------------------------
// revokeShareToken
// Req 14.3 – authenticated owner can revoke the share token
// Ownership check: trip must belong to the requesting user.
// ---------------------------------------------------------------------------
const revokeShareToken = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  trip.shareToken = null;
  await trip.save();

  return { message: 'Share token revoked' };
};

module.exports = {
  generateShareToken,
  getPublicTrip,
  revokeShareToken,
};
