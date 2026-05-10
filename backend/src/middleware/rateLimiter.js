const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication routes.
 * Allows 100 requests per 15-minute window per IP address.
 * Apply to auth routes only (e.g., /api/auth/*).
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errors: [],
  },
});

module.exports = { authRateLimiter };
