const { Schema, model } = require('mongoose');

const NoteSchema = new Schema({
  tripId:  { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  title:   { type: String, required: true },
  content: { type: String, default: '' }
}, { timestamps: true });

NoteSchema.index({ tripId: 1 });

module.exports = model('Note', NoteSchema);
