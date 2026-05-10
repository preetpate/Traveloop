const { Router } = require('express');
const { getCities, getCityById, getActivities } = require('../services/discovery.service');

const router = Router();

// ─── GET /api/cities ──────────────────────────────────────────────────────────
// Query params: q (search text), page (default 1), limit (default 12)
router.get('/cities', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);

    const result = await getCities(query, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/cities/:cityId ──────────────────────────────────────────────────
router.get('/cities/:cityId', async (req, res, next) => {
  try {
    const city = await getCityById(req.params.cityId);
    res.status(200).json({ success: true, data: city });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/activities ──────────────────────────────────────────────────────
// Query params: category, cityId, page (default 1), limit (default 12)
router.get('/activities', async (req, res, next) => {
  try {
    const { category, cityId } = req.query;
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);

    const result = await getActivities(category, cityId, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
