require('dotenv').config();

const validateEnv = require('./config/env');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');

const { authRateLimiter } = require('./middleware/rateLimiter');
const sanitize = require('./middleware/sanitize');
const errorHandler = require('./middleware/errorHandler');

// Validate environment variables before anything else
validateEnv();

const app = express();

// ─── 1. CORS ─────────────────────────────────────────────────────────────────
// Restrict to configured frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ─── 2. Rate Limiter (auth routes only) ──────────────────────────────────────
app.use('/api/auth', authRateLimiter);

// ─── 3. JSON Body Parser ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 4. NoSQL Injection Sanitization ─────────────────────────────────────────
app.use(sanitize);

// ─── 5. Routes ────────────────────────────────────────────────────────────────

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trip.routes');
const budgetRoutes = require('./routes/budget.routes');
const packingRoutes = require('./routes/packing.routes');
const noteRoutes = require('./routes/note.routes');
const adminRoutes = require('./routes/admin.routes');
const shareRoutes = require('./routes/share.routes');
const discoveryRoutes = require('./routes/discovery.routes');

// Health check (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Traveloop API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips', budgetRoutes);
app.use('/api/trips', packingRoutes);
app.use('/api/trips', noteRoutes);
app.use('/api', shareRoutes);
app.use('/api', discoveryRoutes);
app.use('/api/admin', adminRoutes);

// ─── 6. 404 Catch-all for undefined routes ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', errors: [] });
});

// ─── 7. Global Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Traveloop API listening on port ${PORT}`);
  });
};

startServer();

module.exports = app; // exported for testing
