import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, StickyNote } from 'lucide-react';
import api from '../services/api';

export default function TripNotesPage() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/api/notes');
      setNotes(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/notes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/api/notes', formData);
      }
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Trip Notes</h1>
          <p className="text-text-secondary mt-1">Keep track of important information and ideas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-medium"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {editingId ? 'Edit Note' : 'Create New Note'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note here..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-text-primary rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center">
          <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-text-primary flex-1 pr-2">
                  {note.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-text-secondary text-sm whitespace-pre-wrap line-clamp-6">
                {note.content}
              </p>
              {note.createdAt && (
                <p className="text-xs text-text-secondary mt-4 pt-4 border-t border-gray-100">
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
