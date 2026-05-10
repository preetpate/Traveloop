const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const {
  getPackingList,
  createPackingList,
  addItem,
  toggleItem,
  deleteItem,
} = require('../services/packing.service');

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

// All packing routes require JWT authentication
router.use(auth);

// ─── GET /api/trips/:tripId/packing ──────────────────────────────────────────
router.get('/:tripId/packing', async (req, res, next) => {
  try {
    const packingList = await getPackingList(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: packingList });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips/:tripId/packing ─────────────────────────────────────────
router.post(
  '/:tripId/packing',
  [
    body('items')
      .optional()
      .isArray()
      .withMessage('items must be an array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const packingList = await createPackingList(
        req.user.id,
        req.params.tripId,
        req.body.items
      );
      res.status(201).json({ success: true, data: packingList });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/trips/:tripId/packing/items ────────────────────────────────────
// NOTE: must be defined BEFORE the PATCH/DELETE /:itemId routes
router.post(
  '/:tripId/packing/items',
  [
    body('name')
      .notEmpty()
      .withMessage('name is required'),
    body('category')
      .optional()
      .isString()
      .withMessage('category must be a string'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const packingList = await addItem(req.user.id, req.params.tripId, req.body);
      res.status(201).json({ success: true, data: packingList });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PATCH /api/trips/:tripId/packing/items/:itemId ──────────────────────────
router.patch(
  '/:tripId/packing/items/:itemId',
  [
    body('packed')
      .notEmpty()
      .withMessage('packed is required')
      .isBoolean()
      .withMessage('packed must be a boolean'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const packingList = await toggleItem(
        req.user.id,
        req.params.tripId,
        req.params.itemId,
        req.body.packed
      );
      res.status(200).json({ success: true, data: packingList });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/trips/:tripId/packing/items/:itemId ─────────────────────────
router.delete('/:tripId/packing/items/:itemId', async (req, res, next) => {
  try {
    const packingList = await deleteItem(
      req.user.id,
      req.params.tripId,
      req.params.itemId
    );
    res.status(200).json({ success: true, data: packingList });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
