import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Save, X, StickyNote, Clock } from 'lucide-react';
import { useTrip } from '../hooks/useTrip';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { motion } from 'framer-motion';

export default function TripNotesPage() {
  const { activeTrip } = useTrip();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Redirect if no active trip
  useEffect(() => {
    if (!activeTrip) {
      navigate('/my-trips');
    } else {
      fetchNotes();
    }
  }, [activeTrip, navigate]);

  const fetchNotes = async () => {
    if (!activeTrip) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/api/trips/${activeTrip._id}/notes`);
      setNotes(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeTrip) return;

    try {
      if (editingId) {
        await api.put(`/api/trips/${activeTrip._id}/notes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post(`/api/trips/${activeTrip._id}/notes`, formData);
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
    if (!activeTrip) return;
    try {
      await api.delete(`/api/trips/${activeTrip._id}/notes/${id}`);
      setDeleteConfirm(null);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!activeTrip) {
    return null;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-10 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StickyNote className="w-8 h-8" />
              <span className="text-white/90 font-semibold">Trip Notes</span>
            </div>
            <h1 className="text-5xl font-bold mb-3">{activeTrip.title}</h1>
            <p className="text-xl text-white/90">Capture your travel ideas and memories</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:scale-105 transition-transform shadow-2xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </Card>
      ) : (
        <>
          {/* Add/Edit Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  {editingId ? 'Edit Note' : 'Create New Note'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Note title..."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      rows="8"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1">
                      <Save className="w-5 h-5 mr-2" />
                      {editingId ? 'Update Note' : 'Save Note'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <Card className="p-12 text-center">
              <StickyNote className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No notes yet</h3>
              <p className="text-text-secondary mb-6">Create your first note to capture your travel ideas</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Note
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-large transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-text-primary flex-1 pr-2 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(note)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(note._id)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm whitespace-pre-wrap line-clamp-6 flex-1 mb-4">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-secondary pt-4 border-t border-gray-100">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Last updated: {formatDate(note.updatedAt || note.createdAt)}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

