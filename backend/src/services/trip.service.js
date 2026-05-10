const mongoose = require('mongoose');
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
// Helper: find a trip and enforce ownership.
// - Trip not found → 404
// - Trip found but owned by a different user → 403
// ---------------------------------------------------------------------------
const findTripWithOwnership = async (userId, tripId) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  if (trip.userId.toString() !== userId.toString()) {
    throw createError('You do not have permission to access this trip', 403, [
      { field: 'tripId', message: 'You do not have permission to access this trip' },
    ]);
  }

  return trip;
};

// ---------------------------------------------------------------------------
// Helper: validate that startDate <= endDate.
// Throws 400 if the range is inverted.
// ---------------------------------------------------------------------------
const validateTripDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw createError('startDate and endDate must be valid dates', 400, [
      { field: 'dates', message: 'startDate and endDate must be valid dates' },
    ]);
  }

  if (start > end) {
    throw createError('startDate must be on or before endDate', 400, [
      { field: 'startDate', message: 'startDate must be on or before endDate' },
    ]);
  }
};

// ---------------------------------------------------------------------------
// createTrip
// Req 5.1 – create trip for authenticated user
// Req 5.3 – startDate > endDate → 400
// Req 5.4 – missing title → 400
// ---------------------------------------------------------------------------
const createTrip = async (userId, data) => {
  const { title, description, startDate, endDate, coverImage } = data;

  if (!title || !title.trim()) {
    throw createError('title is required', 400, [
      { field: 'title', message: 'title is required' },
    ]);
  }

  if (!startDate || !endDate) {
    throw createError('startDate and endDate are required', 400, [
      { field: 'dates', message: 'startDate and endDate are required' },
    ]);
  }

  validateTripDates(startDate, endDate);

  const trip = await Trip.create({
    userId,
    title: title.trim(),
    description: description || '',
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    coverImage: coverImage || '',
  });

  return trip;
};

// ---------------------------------------------------------------------------
// getTrips
// Req 12.1 – returns trips sorted by startDate descending
// ---------------------------------------------------------------------------
const getTrips = async (userId) => {
  const trips = await Trip.find({ userId }).sort({ startDate: -1 });
  return trips;
};

// ---------------------------------------------------------------------------
// getTripById
// Req 5.7 – ownership check; non-owner → 403 or 404
// ---------------------------------------------------------------------------
const getTripById = async (userId, tripId) => {
  const trip = await findTripWithOwnership(userId, tripId);
  return trip;
};

// ---------------------------------------------------------------------------
// updateTrip
// Req 5.7 – ownership check
// Req 5.3 – startDate > endDate → 400
// ---------------------------------------------------------------------------
const updateTrip = async (userId, tripId, data) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const { title, description, startDate, endDate, coverImage } = data;

  // Determine effective dates for validation (use existing if not provided)
  const effectiveStart = startDate !== undefined ? startDate : trip.startDate;
  const effectiveEnd = endDate !== undefined ? endDate : trip.endDate;

  validateTripDates(effectiveStart, effectiveEnd);

  if (title !== undefined) trip.title = title.trim();
  if (description !== undefined) trip.description = description;
  if (startDate !== undefined) trip.startDate = new Date(startDate);
  if (endDate !== undefined) trip.endDate = new Date(endDate);
  if (coverImage !== undefined) trip.coverImage = coverImage;

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// deleteTrip
// Req 12.4 – deletes trip and all associated data (via cascade hook)
// Must call trip.deleteOne() (document-level) to trigger pre('deleteOne') hook
// ---------------------------------------------------------------------------
const deleteTrip = async (userId, tripId) => {
  const trip = await findTripWithOwnership(userId, tripId);
  await trip.deleteOne();
  return { message: 'Trip deleted successfully.' };
};

// ---------------------------------------------------------------------------
// getTripStats
// Req 13.7 – aggregate trip count, distinct countries, distinct cities,
//            total activities for the authenticated user
// ---------------------------------------------------------------------------
const getTripStats = async (userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const result = await Trip.aggregate([
    // Stage 1: filter to only this user's trips
    { $match: { userId: objectUserId } },

    // Stage 2: unwind stops (preserve trips with no stops)
    {
      $unwind: {
        path: '$stops',
        preserveNullAndEmpty: true,
      },
    },

    // Stage 3: unwind activities within each stop (preserve stops with no activities)
    {
      $unwind: {
        path: '$stops.activities',
        preserveNullAndEmpty: true,
      },
    },

    // Stage 4: group back to compute aggregates
    {
      $group: {
        _id: '$userId',
        tripIds: { $addToSet: '$_id' },
        countries: { $addToSet: '$stops.country' },
        cities: { $addToSet: '$stops.cityName' },
        // Count activities: only count when the activity field actually exists
        totalActivities: {
          $sum: {
            $cond: [{ $ifNull: ['$stops.activities._id', false] }, 1, 0],
          },
        },
      },
    },

    // Stage 5: project the final shape
    {
      $project: {
        _id: 0,
        tripCount: { $size: '$tripIds' },
        // Filter out null values that come from preserveNullAndEmpty
        countries: {
          $filter: {
            input: '$countries',
            as: 'c',
            cond: { $ne: ['$$c', null] },
          },
        },
        cities: {
          $filter: {
            input: '$cities',
            as: 'c',
            cond: { $ne: ['$$c', null] },
          },
        },
        totalActivities: 1,
      },
    },

    // Stage 6: compute final counts
    {
      $project: {
        tripCount: 1,
        countryCount: { $size: '$countries' },
        cityCount: { $size: '$cities' },
        totalActivities: 1,
      },
    },
  ]);

  // If the user has no trips, the aggregation returns an empty array
  if (result.length === 0) {
    return { tripCount: 0, countryCount: 0, cityCount: 0, totalActivities: 0 };
  }

  return result[0];
};

// ---------------------------------------------------------------------------
// addStop
// Req 6.1 – add stop to trip
// Req 6.3 – arrivalDate outside trip range → 400
// ---------------------------------------------------------------------------
const addStop = async (userId, tripId, data) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const { cityName, country, arrivalDate, departureDate } = data;

  if (!cityName || !country || !arrivalDate || !departureDate) {
    throw createError('cityName, country, arrivalDate, and departureDate are required', 400, [
      { field: 'general', message: 'cityName, country, arrivalDate, and departureDate are required' },
    ]);
  }

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
    throw createError('arrivalDate and departureDate must be valid dates', 400, [
      { field: 'dates', message: 'arrivalDate and departureDate must be valid dates' },
    ]);
  }

  // Req 6.3: arrivalDate must be within the trip's date range
  if (arrival < trip.startDate || arrival > trip.endDate) {
    throw createError(
      'arrivalDate must be within the trip\'s startDate and endDate range',
      400,
      [{ field: 'arrivalDate', message: 'arrivalDate must be within the trip\'s startDate and endDate range' }]
    );
  }

  // Determine order: append after the last stop
  const order = trip.stops.length;

  trip.stops.push({
    cityName,
    country,
    arrivalDate: arrival,
    departureDate: departure,
    order,
    activities: [],
  });

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// updateStop
// Req 6.4 – update stop details
// Req 6.3 – arrivalDate outside trip range → 400
// ---------------------------------------------------------------------------
const updateStop = async (userId, tripId, stopId, data) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const stop = trip.stops.id(stopId);
  if (!stop) {
    throw createError('Stop not found', 404, [
      { field: 'stopId', message: 'Stop not found' },
    ]);
  }

  const { cityName, country, arrivalDate, departureDate } = data;

  // Determine effective dates for validation
  const effectiveArrival = arrivalDate !== undefined ? new Date(arrivalDate) : stop.arrivalDate;
  const effectiveDeparture = departureDate !== undefined ? new Date(departureDate) : stop.departureDate;

  if (isNaN(effectiveArrival.getTime()) || isNaN(effectiveDeparture.getTime())) {
    throw createError('arrivalDate and departureDate must be valid dates', 400, [
      { field: 'dates', message: 'arrivalDate and departureDate must be valid dates' },
    ]);
  }

  // Validate arrivalDate is within trip range
  if (effectiveArrival < trip.startDate || effectiveArrival > trip.endDate) {
    throw createError(
      'arrivalDate must be within the trip\'s startDate and endDate range',
      400,
      [{ field: 'arrivalDate', message: 'arrivalDate must be within the trip\'s startDate and endDate range' }]
    );
  }

  if (cityName !== undefined) stop.cityName = cityName;
  if (country !== undefined) stop.country = country;
  if (arrivalDate !== undefined) stop.arrivalDate = effectiveArrival;
  if (departureDate !== undefined) stop.departureDate = effectiveDeparture;

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// deleteStop
// Req 6.5 – remove stop and all its activities (activities are embedded)
// ---------------------------------------------------------------------------
const deleteStop = async (userId, tripId, stopId) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const stop = trip.stops.id(stopId);
  if (!stop) {
    throw createError('Stop not found', 404, [
      { field: 'stopId', message: 'Stop not found' },
    ]);
  }

  stop.deleteOne();
  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// reorderStops
// Req 6.6 – accept ordered array of stop IDs, persist new order field
// ---------------------------------------------------------------------------
const reorderStops = async (userId, tripId, orderedIds) => {
  const trip = await findTripWithOwnership(userId, tripId);

  if (!Array.isArray(orderedIds)) {
    throw createError('orderedIds must be an array of stop IDs', 400, [
      { field: 'orderedIds', message: 'orderedIds must be an array of stop IDs' },
    ]);
  }

  // Validate that all provided IDs belong to this trip
  const tripStopIds = trip.stops.map((s) => s._id.toString());

  for (const id of orderedIds) {
    if (!tripStopIds.includes(id.toString())) {
      throw createError(`Stop ID ${id} does not belong to this trip`, 400, [
        { field: 'orderedIds', message: `Stop ID ${id} does not belong to this trip` },
      ]);
    }
  }

  // Also validate that all trip stops are represented in orderedIds
  if (orderedIds.length !== trip.stops.length) {
    throw createError('orderedIds must contain all stop IDs for this trip', 400, [
      { field: 'orderedIds', message: 'orderedIds must contain all stop IDs for this trip' },
    ]);
  }

  // Update the order field for each stop
  for (let i = 0; i < orderedIds.length; i++) {
    const stop = trip.stops.id(orderedIds[i]);
    if (stop) {
      stop.order = i;
    }
  }

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// addActivity
// Req 7.1 – add activity to a stop
// Req 7.3 – activity date outside stop range → 400
// ---------------------------------------------------------------------------
const addActivity = async (userId, tripId, stopId, data) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const stop = trip.stops.id(stopId);
  if (!stop) {
    throw createError('Stop not found', 404, [
      { field: 'stopId', message: 'Stop not found' },
    ]);
  }

  const { name, category, date, time, duration, cost, notes } = data;

  if (!name || !name.trim()) {
    throw createError('Activity name is required', 400, [
      { field: 'name', message: 'Activity name is required' },
    ]);
  }

  if (!date) {
    throw createError('Activity date is required', 400, [
      { field: 'date', message: 'Activity date is required' },
    ]);
  }

  const activityDate = new Date(date);

  if (isNaN(activityDate.getTime())) {
    throw createError('date must be a valid date', 400, [
      { field: 'date', message: 'date must be a valid date' },
    ]);
  }

  // Req 7.3: activity date must be within the stop's date range
  if (activityDate < stop.arrivalDate || activityDate > stop.departureDate) {
    throw createError(
      'Activity date must be within the stop\'s arrivalDate and departureDate range',
      400,
      [{ field: 'date', message: 'Activity date must be within the stop\'s arrivalDate and departureDate range' }]
    );
  }

  stop.activities.push({
    name: name.trim(),
    category: category || 'Other',
    date: activityDate,
    time: time || undefined,
    duration: duration || undefined,
    cost: cost !== undefined ? cost : 0,
    notes: notes || '',
  });

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// updateActivity
// Req 7.4 – update activity details
// Req 7.3 – activity date outside stop range → 400
// ---------------------------------------------------------------------------
const updateActivity = async (userId, tripId, stopId, activityId, data) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const stop = trip.stops.id(stopId);
  if (!stop) {
    throw createError('Stop not found', 404, [
      { field: 'stopId', message: 'Stop not found' },
    ]);
  }

  const activity = stop.activities.id(activityId);
  if (!activity) {
    throw createError('Activity not found', 404, [
      { field: 'activityId', message: 'Activity not found' },
    ]);
  }

  const { name, category, date, time, duration, cost, notes } = data;

  // Validate date if provided
  if (date !== undefined) {
    const activityDate = new Date(date);

    if (isNaN(activityDate.getTime())) {
      throw createError('date must be a valid date', 400, [
        { field: 'date', message: 'date must be a valid date' },
      ]);
    }

    // Req 7.3: activity date must be within the stop's date range
    if (activityDate < stop.arrivalDate || activityDate > stop.departureDate) {
      throw createError(
        'Activity date must be within the stop\'s arrivalDate and departureDate range',
        400,
        [{ field: 'date', message: 'Activity date must be within the stop\'s arrivalDate and departureDate range' }]
      );
    }

    activity.date = activityDate;
  }

  if (name !== undefined) activity.name = name.trim();
  if (category !== undefined) activity.category = category;
  if (time !== undefined) activity.time = time;
  if (duration !== undefined) activity.duration = duration;
  if (cost !== undefined) activity.cost = cost;
  if (notes !== undefined) activity.notes = notes;

  await trip.save();
  return trip;
};

// ---------------------------------------------------------------------------
// deleteActivity
// Req 7.5 – remove activity from a stop
// ---------------------------------------------------------------------------
const deleteActivity = async (userId, tripId, stopId, activityId) => {
  const trip = await findTripWithOwnership(userId, tripId);

  const stop = trip.stops.id(stopId);
  if (!stop) {
    throw createError('Stop not found', 404, [
      { field: 'stopId', message: 'Stop not found' },
    ]);
  }

  const activity = stop.activities.id(activityId);
  if (!activity) {
    throw createError('Activity not found', 404, [
      { field: 'activityId', message: 'Activity not found' },
    ]);
  }

  activity.deleteOne();
  await trip.save();
  return trip;
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
  addActivity,
  updateActivity,
  deleteActivity,
};
