/**
 * Validates that all required environment variables are present.
 * Throws an error (and exits) if any required variable is missing.
 */
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL',
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file against .env.example.'
    );
    process.exit(1);
  }

  // PORT has a sensible default so it is optional
  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }
};

module.exports = validateEnv;
