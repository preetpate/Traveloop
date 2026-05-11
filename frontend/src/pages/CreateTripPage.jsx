import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Image, FileText, ArrowLeft, Plus, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const inputCls = (err) =>
  `w-full px-4 py-3.5 bg-white/5 border ${err ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`;

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', startDate: '', endDate: '', coverImage: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Trip title is required';
    if (!formData.startDate)    e.startDate = 'Start date is required';
    if (!formData.endDate)      e.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate))
      e.endDate = 'End date must be after start date';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/trips', formData);
      navigate(`/trip/${res.data.data._id}`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create trip' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white transition mb-6 mt-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Create New Trip</h1>
            <p className="text-white/40 text-sm">Start planning your next adventure</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
      >
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              Trip Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Summer Europe Adventure"
              className={inputCls(errors.title)}
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 text-white/30 w-5 h-5" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your trip plans..."
                rows={3}
                className={`${inputCls(false)} pl-12 resize-none`}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`${inputCls(errors.startDate)} pl-12`}
                />
              </div>
              {errors.startDate && <p className="mt-1.5 text-xs text-red-400">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                End Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  className={`${inputCls(errors.endDate)} pl-12`}
                />
              </div>
              {errors.endDate && <p className="mt-1.5 text-xs text-red-400">{errors.endDate}</p>}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">Cover Image URL</label>
            <div className="relative">
              <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input
                name="coverImage"
                type="url"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`${inputCls(false)} pl-12`}
              />
            </div>
            <p className="mt-1.5 text-xs text-white/30">Optional: Add a cover image URL</p>
          </div>

          {/* Preview */}
          {formData.coverImage && (
            <div>
              <p className="text-sm font-semibold text-white/70 mb-2">Preview</p>
              <div className="h-40 rounded-xl overflow-hidden border border-white/10">
                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
              ) : (
                <><Plus className="w-5 h-5" /> Create Trip</>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
