const { Router } = require('express');

const auth = require('../middleware/auth');
const {
  generateShareToken,
  getPublicTrip,
  revokeShareToken,
} = require('../services/share.service');

const router = Router();

// ─── POST /api/trips/:tripId/share ────────────────────────────────────────────
// JWT required — generates (or regenerates) a share token for the trip.
router.post('/trips/:tripId/share', auth, async (req, res, next) => {
  try {
    const result = await generateShareToken(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/trips/:tripId/share ─────────────────────────────────────────
// JWT required — revokes the share token for the trip.
router.delete('/trips/:tripId/share', auth, async (req, res, next) => {
  try {
    const result = await revokeShareToken(req.user.id, req.params.tripId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/public/:shareToken ─────────────────────────────────────────────
// No auth required — returns the publicly shared trip.
router.get('/public/:shareToken', async (req, res, next) => {
  try {
    const trip = await getPublicTrip(req.params.shareToken);
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
