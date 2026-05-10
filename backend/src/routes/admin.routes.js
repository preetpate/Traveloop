const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
} = require('../services/admin.service');

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

// All admin routes require JWT authentication + admin role
router.use(auth, adminOnly);

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
// Query params: page, limit, search
router.get('/users', async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await getUsers(page, limit, search);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/users/:userId ──────────────────────────────────────────
// Body: { role }
router.patch(
  '/users/:userId',
  [
    body('role')
      .notEmpty()
      .withMessage('role is required')
      .isIn(['user', 'admin'])
      .withMessage('role must be one of: user, admin'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const updated = await updateUserRole(req.user.id, req.params.userId, req.body.role);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/admin/users/:userId ─────────────────────────────────────────
router.delete('/users/:userId', async (req, res, next) => {
  try {
    const result = await deleteUser(req.user.id, req.params.userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/analytics ─────────────────────────────────────────────────
router.get('/analytics', async (req, res, next) => {
  try {
    const analytics = await getAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
