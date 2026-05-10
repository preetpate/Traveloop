const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const {
  getTrips,
  createTrip,
  getTripStats,
  getTripById,
  updateTrip,
  deleteTrip,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
  addActivity,
  updateActivity,
  deleteActivity,
} = require('../services/trip.service');

const router = Router();

// ─── Validation helper ────────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Activity category enum ───────────────────────────────────────────────────
const ACTIVITY_CATEGORIES = [
  'Sightseeing',
  'Food & Drink',
  'Adventure',
  'Culture',
  'Shopping',
  'Transport',
  'Accommodation',
  'Other',
];

// All trip routes require JWT authentication
router.use(auth);

// ─── GET /api/trips ───────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const trips = await getTrips(req.user.id);
    res.status(200).json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips ──────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('title is required').trim(),
    body('startDate').isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
    body('endDate').isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await createTrip(req.user.id, req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/trips/stats ─────────────────────────────────────────────────────
// IMPORTANT: must be defined BEFORE /:tripId to avoid "stats" being treated as a param
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getTripStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/trips/:tripId ───────────────────────────────────────────────────
router.get('/:tripId', async (req, res, next) => {
  try {
    const trip = await getTripById(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/trips/:tripId ───────────────────────────────────────────────────
router.put(
  '/:tripId',
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('title must not be empty if provided')
      .trim(),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('startDate must be a valid ISO 8601 date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('endDate must be a valid ISO 8601 date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await updateTrip(req.user.id, req.params.tripId, req.body);
      res.status(200).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/trips/:tripId ────────────────────────────────────────────────
router.delete('/:tripId', async (req, res, next) => {
  try {
    const result = await deleteTrip(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips/:tripId/stops ────────────────────────────────────────────
router.post(
  '/:tripId/stops',
  [
    body('cityName').notEmpty().withMessage('cityName is required').trim(),
    body('country').notEmpty().withMessage('country is required').trim(),
    body('arrivalDate').isISO8601().withMessage('arrivalDate must be a valid ISO 8601 date'),
    body('departureDate').isISO8601().withMessage('departureDate must be a valid ISO 8601 date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await addStop(req.user.id, req.params.tripId, req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/trips/:tripId/stops/reorder ─────────────────────────────────────
// IMPORTANT: must be defined BEFORE /:stopId to avoid "reorder" being treated as a param
router.put(
  '/:tripId/stops/reorder',
  [
    body('orderedIds')
      .isArray({ min: 1 })
      .withMessage('orderedIds must be a non-empty array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await reorderStops(req.user.id, req.params.tripId, req.body.orderedIds);
      res.status(200).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/trips/:tripId/stops/:stopId ─────────────────────────────────────
router.put(
  '/:tripId/stops/:stopId',
  [
    body('cityName').optional().notEmpty().withMessage('cityName must not be empty if provided').trim(),
    body('country').optional().notEmpty().withMessage('country must not be empty if provided').trim(),
    body('arrivalDate')
      .optional()
      .isISO8601()
      .withMessage('arrivalDate must be a valid ISO 8601 date'),
    body('departureDate')
      .optional()
      .isISO8601()
      .withMessage('departureDate must be a valid ISO 8601 date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await updateStop(req.user.id, req.params.tripId, req.params.stopId, req.body);
      res.status(200).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/trips/:tripId/stops/:stopId ──────────────────────────────────
router.delete('/:tripId/stops/:stopId', async (req, res, next) => {
  try {
    const trip = await deleteStop(req.user.id, req.params.tripId, req.params.stopId);
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips/:tripId/stops/:stopId/activities ─────────────────────────
router.post(
  '/:tripId/stops/:stopId/activities',
  [
    body('name').notEmpty().withMessage('name is required').trim(),
    body('date').isISO8601().withMessage('date must be a valid ISO 8601 date'),
    body('category')
      .optional()
      .isIn(ACTIVITY_CATEGORIES)
      .withMessage(`category must be one of: ${ACTIVITY_CATEGORIES.join(', ')}`),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await addActivity(
        req.user.id,
        req.params.tripId,
        req.params.stopId,
        req.body
      );
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/trips/:tripId/stops/:stopId/activities/:activityId ──────────────
router.put(
  '/:tripId/stops/:stopId/activities/:activityId',
  [
    body('name').optional().notEmpty().withMessage('name must not be empty if provided').trim(),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('date must be a valid ISO 8601 date'),
    body('category')
      .optional()
      .isIn(ACTIVITY_CATEGORIES)
      .withMessage(`category must be one of: ${ACTIVITY_CATEGORIES.join(', ')}`),
  ],
  validate,
  async (req, res, next) => {
    try {
      const trip = await updateActivity(
        req.user.id,
        req.params.tripId,
        req.params.stopId,
        req.params.activityId,
        req.body
      );
      res.status(200).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId ───────────
router.delete('/:tripId/stops/:stopId/activities/:activityId', async (req, res, next) => {
  try {
    const trip = await deleteActivity(
      req.user.id,
      req.params.tripId,
      req.params.stopId,
      req.params.activityId
    );
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
