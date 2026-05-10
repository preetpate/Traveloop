const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Note = require('../models/Note');

// ---------------------------------------------------------------------------
// Helper: build a custom error with a statusCode property so the global
// error handler can pick up the right HTTP status.
// ---------------------------------------------------------------------------
const createError = (message, statusCode, errors = []) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.errors = errors;
  return err;
};

// ---------------------------------------------------------------------------
// Helper: verify the trip exists and belongs to the given user.
// Returns the trip document on success.
// - Invalid / missing tripId → 404
// - Trip not found → 404
// - Trip owned by a different user → 404 (intentionally opaque for security)
// ---------------------------------------------------------------------------
const findTripForUser = async (userId, tripId) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw createError('Trip not found', 404, [
      { field: 'tripId', message: 'Trip not found' },
    ]);
  }

  return trip;
};

// ---------------------------------------------------------------------------
// getNotes
// Req 11.7 – returns all notes for a trip sorted by updatedAt descending
// Ownership check via trip lookup.
// ---------------------------------------------------------------------------
const getNotes = async (userId, tripId) => {
  await findTripForUser(userId, tripId);

  const notes = await Note.find({ tripId }).sort({ updatedAt: -1 });

  return notes;
};

// ---------------------------------------------------------------------------
// createNote
// Req 11.1 – create a note with title and content
// Req 11.2 – return created note
// title is required; content defaults to ''.
// ---------------------------------------------------------------------------
const createNote = async (userId, tripId, data) => {
  await findTripForUser(userId, tripId);

  const { title, content = '' } = data;

  const note = await Note.create({
    tripId,
    title,
    content,
  });

  return note;
};

// ---------------------------------------------------------------------------
// updateNote
// Req 11.3 – update a note's title or content
// 404 if note not found; only update provided fields.
// ---------------------------------------------------------------------------
const updateNote = async (userId, tripId, noteId, data) => {
  await findTripForUser(userId, tripId);

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw createError('Note not found', 404, [
      { field: 'noteId', message: 'Note not found' },
    ]);
  }

  const note = await Note.findOne({ _id: noteId, tripId });

  if (!note) {
    throw createError('Note not found', 404, [
      { field: 'noteId', message: 'Note not found' },
    ]);
  }

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;

  await note.save();

  return note;
};

// ---------------------------------------------------------------------------
// deleteNote
// Req 11.4 – delete a note
// 404 if note not found.
// ---------------------------------------------------------------------------
const deleteNote = async (userId, tripId, noteId) => {
  await findTripForUser(userId, tripId);

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw createError('Note not found', 404, [
      { field: 'noteId', message: 'Note not found' },
    ]);
  }

  const note = await Note.findOneAndDelete({ _id: noteId, tripId });

  if (!note) {
    throw createError('Note not found', 404, [
      { field: 'noteId', message: 'Note not found' },
    ]);
  }

  return note;
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
