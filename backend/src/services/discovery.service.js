const mongoose = require('mongoose');
const City = require('../models/City');

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
// getCities
// If `query` is provided, use MongoDB full-text search; otherwise return all.
// Results are paginated via skip/limit.
// ---------------------------------------------------------------------------
const getCities = async (query, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;

  const filter = query ? { $text: { $search: query } } : {};

  const [cities, total] = await Promise.all([
    City.find(filter).skip(skip).limit(limit).lean(),
    City.countDocuments(filter),
  ]);

  return {
    cities,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// ---------------------------------------------------------------------------
// getCityById
// Throws 404 if the city is not found or the ID is invalid.
// ---------------------------------------------------------------------------
const getCityById = async (cityId) => {
  if (!mongoose.Types.ObjectId.isValid(cityId)) {
    throw createError('City not found', 404, [
      { field: 'cityId', message: 'City not found' },
    ]);
  }

  const city = await City.findById(cityId).lean();

  if (!city) {
    throw createError('City not found', 404, [
      { field: 'cityId', message: 'City not found' },
    ]);
  }

  return city;
};

// ---------------------------------------------------------------------------
// getActivities
// Uses an aggregation pipeline to unwind the activities array from City
// documents, then optionally filters by category and/or cityId, and paginates.
// ---------------------------------------------------------------------------
const getActivities = async (category, cityId, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;

  // Build the $match stage that runs after $unwind
  const matchStage = {};

  if (category) {
    matchStage['activities.category'] = category;
  }

  if (cityId) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return { activities: [], total: 0, page, pages: 0 };
    }
    matchStage['_id'] = new mongoose.Types.ObjectId(cityId);
  }

  const pipeline = [
    { $unwind: '$activities' },
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $project: {
        _id: '$activities._id',
        name: '$activities.name',
        category: '$activities.category',
        description: '$activities.description',
        imageUrl: '$activities.imageUrl',
        cityId: '$_id',
        cityName: '$name',
        country: '$country',
      },
    },
  ];

  // Run count and paginated fetch in parallel
  const countPipeline = [...pipeline, { $count: 'total' }];
  const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];

  const [countResult, activities] = await Promise.all([
    City.aggregate(countPipeline),
    City.aggregate(dataPipeline),
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;

  return {
    activities,
    total,
    page,
    pages: Math.ceil(total / limit) || 0,
  };
};

module.exports = { getCities, getCityById, getActivities };
