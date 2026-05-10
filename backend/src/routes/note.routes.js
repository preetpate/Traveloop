const { Router } = require('express');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../services/note.service');

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

// All note routes require JWT authentication
router.use(auth);

// ─── GET /api/trips/:tripId/notes ─────────────────────────────────────────────
// Req 11.7 – returns notes sorted by updatedAt descending
router.get('/:tripId/notes', async (req, res, next) => {
  try {
    const notes = await getNotes(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/trips/:tripId/notes ────────────────────────────────────────────
// Req 11.1 – create a note with title (required) and content (optional)
router.post(
  '/:tripId/notes',
  [
    body('title')
      .notEmpty()
      .withMessage('title is required'),
    body('content')
      .optional()
      .isString()
      .withMessage('content must be a string'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const note = await createNote(req.user.id, req.params.tripId, req.body);
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/trips/:tripId/notes/:noteId ─────────────────────────────────────
// Req 11.3 – update a note's title or content
router.put(
  '/:tripId/notes/:noteId',
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('title must not be empty'),
    body('content')
      .optional()
      .isString()
      .withMessage('content must be a string'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const note = await updateNote(
        req.user.id,
        req.params.tripId,
        req.params.noteId,
        req.body
      );
      res.status(200).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/trips/:tripId/notes/:noteId ──────────────────────────────────
// Req 11.4 – delete a note
router.delete('/:tripId/notes/:noteId', async (req, res, next) => {
  try {
    const note = await deleteNote(
      req.user.id,
      req.params.tripId,
      req.params.noteId
    );
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
