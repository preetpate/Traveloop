const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const { getBudget, createBudget, updateBudget } = require('../services/budget.service');

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

// All budget routes require JWT authentication
router.use(auth);

// ─── GET /api/trips/:tripId/budget ────────────────────────────────────────────
router.get('/:tripId/budget', async (req, res, next) => {
  try {
    const budget = await getBudget(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips/:tripId/budget ───────────────────────────────────────────
router.post(
  '/:tripId/budget',
  [
    body('totalBudget')
      .notEmpty()
      .withMessage('totalBudget is required')
      .isNumeric()
      .withMessage('totalBudget must be a number')
      .custom((value) => Number(value) >= 0)
      .withMessage('totalBudget must be at least 0'),
    body('categories')
      .optional()
      .isArray()
      .withMessage('categories must be an array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const budget = await createBudget(req.user.id, req.params.tripId, req.body);
      res.status(201).json({ success: true, data: budget });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/trips/:tripId/budget ────────────────────────────────────────────
router.put(
  '/:tripId/budget',
  [
    body('totalBudget')
      .optional()
      .isNumeric()
      .withMessage('totalBudget must be a number')
      .custom((value) => Number(value) >= 0)
      .withMessage('totalBudget must be at least 0'),
    body('categories')
      .optional()
      .isArray()
      .withMessage('categories must be an array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const budget = await updateBudget(req.user.id, req.params.tripId, req.body);
      res.status(200).json({ success: true, data: budget });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
