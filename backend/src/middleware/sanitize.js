const mongoSanitize = require('mongo-sanitize');

/**
 * mongo-sanitize middleware wrapper.
 * Recursively strips keys that start with '$' or contain '.' from
 * req.body, req.query, and req.params to prevent NoSQL injection.
 */
const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }
  next();
};

module.exports = sanitize;
