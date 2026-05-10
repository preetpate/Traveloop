const { Schema, model } = require('mongoose');

// ─── Activity Sub-Schema ──────────────────────────────────────────────────────
const ActivitySchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Sightseeing',
        'Food & Drink',
        'Adventure',
        'Culture',
        'Shopping',
        'Transport',
        'Accommodation',
        'Other',
      ],
      default: 'Other',
    },
    date:     { type: Date,   required: true },
    time:     { type: String },           // "HH:MM" string
    duration: { type: Number },           // minutes
    cost:     { type: Number, default: 0 },
    notes:    { type: String, default: '' },
  },
  { timestamps: true }
);

// ─── Stop Sub-Schema ──────────────────────────────────────────────────────────
const StopSchema = new Schema(
  {
    cityName:      { type: String, required: true },
    country:       { type: String, required: true },
    arrivalDate:   { type: Date,   required: true },
    departureDate: { type: Date,   required: true },
    order:         { type: Number, default: 0 },
    activities:    [ActivitySchema],
  },
  { timestamps: true }
);

// ─── Trip Schema ──────────────────────────────────────────────────────────────
const TripSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate:   { type: Date,   required: true },
    endDate:     { type: Date,   required: true },
    coverImage:  { type: String, default: '' },
    shareToken:  { type: String, default: null, index: true },
    stops:       [StopSchema],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
TripSchema.index({ userId: 1 });
TripSchema.index({ startDate: -1 });

// ─── Cascade Delete Hook ──────────────────────────────────────────────────────
// Lazy-require to avoid circular dependency issues at module load time.
// Budget, PackingList, and Note are loaded only when the hook fires.
TripSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const tripId = this._id;

  const Budget      = require('./Budget');
  const PackingList = require('./PackingList');
  const Note        = require('./Note');

  await Promise.all([
    Budget.deleteOne({ tripId }),
    PackingList.deleteOne({ tripId }),
    Note.deleteMany({ tripId }),
  ]);

  next();
});

module.exports = model('Trip', TripSchema);
