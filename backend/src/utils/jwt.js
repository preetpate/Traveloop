const jwt = require('jsonwebtoken');

/**
 * Signs a JWT with the given payload.
 * Uses JWT_SECRET and JWT_EXPIRES_IN from environment variables.
 *
 * @param {object} payload - Data to encode (e.g. { id, role })
 * @returns {string} Signed JWT string
 */
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws a JsonWebTokenError or TokenExpiredError on failure.
 *
 * @param {string} token - JWT string to verify
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };
