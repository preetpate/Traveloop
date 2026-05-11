import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Trash2, Share2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, tripId: null, tripTitle: '' });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (tripId, tripTitle) => {
    setDeleteDialog({ isOpen: true, tripId, tripTitle });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, tripId: null, tripTitle: '' });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/trips/${deleteDialog.tripId}`);
      setTrips(trips.filter((trip) => trip._id !== deleteDialog.tripId));
      closeDeleteDialog();
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert('Failed to delete trip');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-12 w-64 bg-white rounded-xl animate-pulse"></div>
          <div className="h-12 w-48 bg-white rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
              <div className="w-full h-56 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">My Trips</h1>
          <p className="text-text-secondary text-lg">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
          </p>
        </div>
        <Link
          to="/create-trip"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-large"
        >
          <Plus className="w-5 h-5" />
          Create New Trip
        </Link>
      </div>

      {/* Empty State */}
      {trips.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-soft"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
            <MapPin className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-3">No trips yet</h2>
          <p className="text-text-secondary mb-8 text-center max-w-md text-lg">
            Start planning your next adventure by creating your first trip
          </p>
          <Link
            to="/create-trip"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-large"
          >
            <Plus className="w-5 h-5" />
            Create Your First Trip
          </Link>
        </motion.div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100"
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                {trip.coverImage ? (
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-blue-400" />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md ${
                    new Date(trip.startDate) > new Date() 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-gray-800/90 text-white'
                  }`}>
                    {new Date(trip.startDate) > new Date() ? '✈️ Upcoming' : '📍 Past'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link to={`/trip/${trip._id}`}>
                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {trip.title}
                  </h3>
                </Link>
                {trip.description && (
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {trip.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(trip.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {trip.stops && trip.stops.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/trip/${trip._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Share feature coming soon!');
                    }}
                    className="px-4 py-2.5 bg-gray-50 text-text-secondary rounded-xl hover:bg-gray-100 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteDialog(trip._id, trip.title);
                    }}
                    className="px-4 py-2.5 bg-red-50 text-danger rounded-xl hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete "${deleteDialog.tripTitle}"? This action cannot be undone and will remove all associated stops, activities, budget, packing list, and notes.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
