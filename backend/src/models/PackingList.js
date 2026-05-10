const { Schema, model } = require('mongoose');

const PackingItemSchema = new Schema({
  name:     { type: String, required: true },
  category: { type: String, default: 'General' },
  packed:   { type: Boolean, default: false }
});

const PackingListSchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
  items:  [PackingItemSchema]
}, { timestamps: true });

PackingListSchema.index({ tripId: 1 });

module.exports = model('PackingList', PackingListSchema);
