/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain (after all routes).
 *
 * Catches all errors passed via next(err).
 * - Logs the full error server-side.
 * - Returns the standard error envelope: { success, message, errors }.
 * - Uses err.statusCode if set; defaults to 500 for unhandled errors.
 * - Returns a generic message for 500s to avoid leaking stack traces.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message || 'An error occurred';
  const errors = Array.isArray(err.errors) ? err.errors : [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = errorHandler;
