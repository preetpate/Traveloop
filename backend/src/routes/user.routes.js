const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const { getMe, updateProfile, changePassword } = require('../services/auth.service');

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

// ─── GET /api/users/me ────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/me ────────────────────────────────────────────────────────
router.put(
  '/me',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
    body('email')
      .optional()
      .isEmail()
      .withMessage('A valid email address is required')
      .normalizeEmail(),
    body('bio').optional().isString().withMessage('Bio must be a string').trim(),
    body('avatarUrl').optional().isURL().withMessage('avatarUrl must be a valid URL'),
    body('homeCountry').optional().isString().withMessage('homeCountry must be a string').trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, bio, avatarUrl, homeCountry, email } = req.body;
      const updated = await updateProfile(req.user.id, { name, bio, avatarUrl, homeCountry, email });
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/users/me/password ───────────────────────────────────────────────
router.put(
  '/me/password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
