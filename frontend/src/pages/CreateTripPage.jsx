import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Image, FileText, ArrowLeft, Plus } from 'lucide-react';
import api from '../services/api';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Trip title is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) newErrors.endDate = 'End date must be after start date';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/api/trips', formData);
      const tripId = res.data.data._id;
      navigate(`/my-trips`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create trip' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Create New Trip</h1>
        <p className="text-text-secondary text-lg">Start planning your next adventure</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-text-primary mb-2">
              Trip Title <span className="text-danger">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Summer Europe Adventure"
              className={`w-full px-4 py-3.5 bg-gray-50 border ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              } rounded-xl text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition`}
            />
            {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-text-primary mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your trip plans..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-text-primary mb-2">
                Start Date <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border ${
                    errors.startDate ? 'border-red-400' : 'border-gray-200'
                  } rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition`}
                />
              </div>
              {errors.startDate && <p className="mt-1.5 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-text-primary mb-2">
                End Date <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border ${
                    errors.endDate ? 'border-red-400' : 'border-gray-200'
                  } rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition`}
                />
              </div>
              {errors.endDate && <p className="mt-1.5 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="coverImage" className="block text-sm font-semibold text-text-primary mb-2">
              Cover Image URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <p className="mt-1.5 text-xs text-text-secondary">
              Optional: Add a cover image URL for your trip
            </p>
          </div>

          {/* Preview */}
          {formData.coverImage && (
            <div>
              <p className="text-sm font-semibold text-text-primary mb-2">Preview</p>
              <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Trip
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gray-100 border border-gray-200 rounded-xl text-text-primary font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
