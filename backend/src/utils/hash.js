const crypto = require('crypto');

/**
 * Computes the SHA-256 hash of a string.
 * Used to hash reset tokens before storing them in the database
 * so that the plaintext token is never persisted.
 *
 * @param {string} value - The plaintext value to hash
 * @returns {string} Hex-encoded SHA-256 digest
 */
const sha256 = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

module.exports = { sha256 };
