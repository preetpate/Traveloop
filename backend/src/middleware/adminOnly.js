/**
 * Admin-only role check middleware.
 * Must be used AFTER the auth middleware (requires req.user to be set).
 * Returns 403 if the authenticated user does not have the 'admin' role.
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: admin access required',
      errors: [],
    });
  }
  next();
};

module.exports = adminOnly;
