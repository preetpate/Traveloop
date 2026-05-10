const { Schema, model } = require('mongoose');

// ─── City Schema ──────────────────────────────────────────────────────────────
const CitySchema = new Schema(
  {
    name:        { type: String, required: true },
    country:     { type: String, required: true },
    coverImage:  { type: String, default: '' },
    description: { type: String, default: '' },
    tags:        [{ type: String }],
    activities:  [
      {
        name:        String,
        category:    String,
        description: String,
        imageUrl:    String,
      },
    ],
  },
  { timestamps: true }
);

// ─── Text Index ───────────────────────────────────────────────────────────────
CitySchema.index({ name: 'text', country: 'text', tags: 'text' });

module.exports = model('City', CitySchema);
