import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, DollarSign, Edit, Trash2, 
  Plus, Clock, Tag, CheckCircle, Package, StickyNote, Share2, Copy,
  GripVertical, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { UIContext } from '../contexts/UIContext';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useContext(UIContext);
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false });
  const [stopModal, setStopModal] = useState({ isOpen: false, stop: null, mode: 'add' });
  const [activityModal, setActivityModal] = useState({ isOpen: false, stopId: null, activity: null, mode: 'add' });

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/api/trips/${id}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
      addToast?.('Failed to load trip', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      // Generate share token if not exists
      if (!trip.shareToken) {
        const res = await api.post(`/api/trips/${id}/share`);
        const shareToken = res.data.data.shareToken;
        setTrip({ ...trip, shareToken });
        const publicUrl = `${window.location.origin}/public-itinerary/${shareToken}`;
        await navigator.clipboard.writeText(publicUrl);
        addToast?.('Public link copied to clipboard!', 'success');
      } else {
        const publicUrl = `${window.location.origin}/public-itinerary/${trip.shareToken}`;
        await navigator.clipboard.writeText(publicUrl);
        addToast?.('Public link copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      addToast?.('Failed to copy link', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/trips/${id}`);
      addToast?.('Trip deleted successfully', 'success');
      navigate('/my-trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
      addToast?.('Failed to delete trip', 'error');
    }
  };

  const handleAddStop = async (stopData) => {
    try {
      const res = await api.post(`/api/trips/${id}/stops`, stopData);
      setTrip(res.data.data);
      setStopModal({ isOpen: false, stop: null, mode: 'add' });
      addToast?.('Stop added successfully', 'success');
    } catch (err) {
      console.error('Failed to add stop:', err);
      addToast?.(err.response?.data?.message || 'Failed to add stop', 'error');
    }
  };

  const handleUpdateStop = async (stopId, stopData) => {
    try {
      const res = await api.put(`/api/trips/${id}/stops/${stopId}`, stopData);
      setTrip(res.data.data);
      setStopModal({ isOpen: false, stop: null, mode: 'add' });
      addToast?.('Stop updated successfully', 'success');
    } catch (err) {
      console.error('Failed to update stop:', err);
      addToast?.(err.response?.data?.message || 'Failed to update stop', 'error');
    }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await api.delete(`/api/trips/${id}/stops/${stopId}`);
      setTrip({ ...trip, stops: trip.stops.filter(s => s._id !== stopId) });
      addToast?.('Stop deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete stop:', err);
      addToast?.('Failed to delete stop', 'error');
    }
  };

  const handleAddActivity = async (stopId, activityData) => {
    try {
      const res = await api.post(`/api/trips/${id}/stops/${stopId}/activities`, activityData);
      const updatedStop = res.data.data;
      setTrip({
        ...trip,
        stops: trip.stops.map(s => s._id === stopId ? updatedStop : s)
      });
      setActivityModal({ isOpen: false, stopId: null, activity: null, mode: 'add' });
      addToast?.('Activity added successfully', 'success');
    } catch (err) {
      console.error('Failed to add activity:', err);
      addToast?.(err.response?.data?.message || 'Failed to add activity', 'error');
    }
  };

  const handleUpdateActivity = async (stopId, activityId, activityData) => {
    try {
      const res = await api.put(`/api/trips/${id}/stops/${stopId}/activities/${activityId}`, activityData);
      const updatedStop = res.data.data;
      setTrip({
        ...trip,
        stops: trip.stops.map(s => s._id === stopId ? updatedStop : s)
      });
      setActivityModal({ isOpen: false, stopId: null, activity: null, mode: 'add' });
      addToast?.('Activity updated successfully', 'success');
    } catch (err) {
      console.error('Failed to update activity:', err);
      addToast?.(err.response?.data?.message || 'Failed to update activity', 'error');
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    try {
      await api.delete(`/api/trips/${id}/stops/${stopId}/activities/${activityId}`);
      setTrip({
        ...trip,
        stops: trip.stops.map(s => 
          s._id === stopId 
            ? { ...s, activities: s.activities.filter(a => a._id !== activityId) }
            : s
        )
      });
      addToast?.('Activity deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete activity:', err);
      addToast?.('Failed to delete activity', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-3xl"></div>
        <div className="h-64 bg-white rounded-3xl"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Trip not found</h2>
        <Link to="/my-trips" className="text-primary hover:underline">
          Back to My Trips
        </Link>
      </div>
    );
  }

  const tripDuration = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = new Date(trip.startDate) > new Date();

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Cover Image */}
      <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-32 h-32 text-blue-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/my-trips')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition"
                title="Copy public link"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => navigate(`/trip/${id}/edit`)}
                className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition"
                title="Edit trip"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeleteDialog({ isOpen: true })}
                className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600/80 transition"
                title="Delete trip"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trip Info */}
          <div>
            <div className="mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md ${
                isUpcoming ? 'bg-green-500/90 text-white' : 'bg-gray-800/90 text-white'
              }`}>
                {isUpcoming ? '✈️ Upcoming Trip' : '📍 Past Trip'}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">{trip.title}</h1>
            {trip.description && (
              <p className="text-xl text-white/90 mb-6 max-w-3xl">{trip.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">
                  {new Date(trip.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {' - '}
                  {new Date(trip.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{tripDuration} days</span>
              </div>
              {trip.stops && trip.stops.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{trip.stops.length} destinations</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-soft border border-gray-100">
        <div className="flex gap-2">
          {['overview', 'itinerary', 'budget', 'packing', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">Trip Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Duration</p>
                      <p className="text-2xl font-bold text-gray-900">{tripDuration} days</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Destinations</p>
                      <p className="text-2xl font-bold text-gray-900">{trip.stops?.length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Status</p>
                      <p className="text-2xl font-bold text-gray-900">{isUpcoming ? 'Upcoming' : 'Completed'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {trip.description && (
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3">About This Trip</h3>
                <p className="text-text-secondary leading-relaxed">{trip.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('budget')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-text-primary">Manage Budget</p>
                    <p className="text-sm text-text-secondary">Track your expenses</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('packing')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-text-primary">Packing List</p>
                    <p className="text-sm text-text-secondary">What to bring</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <MapPin className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-semibold text-text-primary">Plan Itinerary</p>
                    <p className="text-sm text-text-secondary">Add destinations</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
                >
                  <StickyNote className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="font-semibold text-text-primary">Trip Notes</p>
                    <p className="text-sm text-text-secondary">Important info</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Trip Itinerary</h2>
                <p className="text-text-secondary">Manage your destinations and activities</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setStopModal({ isOpen: true, stop: null, mode: 'add' })}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Stop
              </Button>
            </div>

            {!trip.stops || trip.stops.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-primary mb-2">No Stops Yet</h3>
                <p className="text-text-secondary mb-6">Start adding destinations to your trip</p>
                <Button
                  variant="primary"
                  onClick={() => setStopModal({ isOpen: true, stop: null, mode: 'add' })}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Stop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.stops
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((stop, index) => (
                    <StopCard
                      key={stop._id}
                      stop={stop}
                      index={index}
                      onEdit={() => setStopModal({ isOpen: true, stop, mode: 'edit' })}
                      onDelete={() => handleDeleteStop(stop._id)}
                      onAddActivity={() => setActivityModal({ isOpen: true, stopId: stop._id, activity: null, mode: 'add' })}
                      onEditActivity={(activity) => setActivityModal({ isOpen: true, stopId: stop._id, activity, mode: 'edit' })}
                      onDeleteActivity={(activityId) => handleDeleteActivity(stop._id, activityId)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Budget Tracking</h3>
            <p className="text-text-secondary mb-6">Track expenses for this specific trip</p>
            <Link 
              to="/budget" 
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Go to Budget Page
            </Link>
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Packing Checklist</h3>
            <p className="text-text-secondary mb-6">Create a packing list for this trip</p>
            <Link 
              to="/packing-checklist" 
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Go to Packing Page
            </Link>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Trip Notes</h3>
            <p className="text-text-secondary mb-6">Add important notes about this trip</p>
            <Link 
              to="/trip-notes" 
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Go to Notes Page
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete "${trip?.title}"? This action cannot be undone and will remove all associated stops, activities, budget, packing list, and notes.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      {/* Stop Modal */}
      {stopModal.isOpen && (
        <StopFormModal
          isOpen={stopModal.isOpen}
          onClose={() => setStopModal({ isOpen: false, stop: null, mode: 'add' })}
          onSubmit={stopModal.mode === 'add' ? handleAddStop : (data) => handleUpdateStop(stopModal.stop._id, data)}
          stop={stopModal.stop}
          mode={stopModal.mode}
          tripStartDate={trip.startDate}
          tripEndDate={trip.endDate}
        />
      )}

      {/* Activity Modal */}
      {activityModal.isOpen && (
        <ActivityFormModal
          isOpen={activityModal.isOpen}
          onClose={() => setActivityModal({ isOpen: false, stopId: null, activity: null, mode: 'add' })}
          onSubmit={activityModal.mode === 'add' 
            ? (data) => handleAddActivity(activityModal.stopId, data)
            : (data) => handleUpdateActivity(activityModal.stopId, activityModal.activity._id, data)
          }
          activity={activityModal.activity}
          mode={activityModal.mode}
          stop={trip?.stops?.find(s => s._id === activityModal.stopId)}
        />
      )}
    </div>
  );
}

// Helper Components

function StopCard({ stop, index, onEdit, onDelete, onAddActivity, onEditActivity, onDeleteActivity }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Group activities by date
  const activitiesByDate = (stop.activities || []).reduce((acc, activity) => {
    const dateKey = new Date(activity.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(activity);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-1">{stop.cityName}</h3>
            <p className="text-text-secondary mb-2">{stop.country}</p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' - '}
                  {new Date(stop.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{stop.activities?.length || 0} activities</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/50 rounded-lg transition"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-white/50 rounded-lg transition"
            title="Edit stop"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 text-danger rounded-lg transition"
            title="Delete stop"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 mt-4"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddActivity}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>

          {Object.keys(activitiesByDate).length === 0 ? (
            <p className="text-text-secondary text-sm italic">No activities yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(activitiesByDate).map(([date, activities]) => (
                <div key={date} className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-text-primary mb-3">{date}</h4>
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity._id}
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                        onDelete={() => onDeleteActivity(activity._id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function ActivityCard({ activity, onEdit, onDelete }) {
  const categoryColors = {
    'Sightseeing': 'bg-blue-100 text-blue-700',
    'Food & Drink': 'bg-orange-100 text-orange-700',
    'Adventure': 'bg-green-100 text-green-700',
    'Culture': 'bg-purple-100 text-purple-700',
    'Shopping': 'bg-pink-100 text-pink-700',
    'Transport': 'bg-gray-100 text-gray-700',
    'Accommodation': 'bg-indigo-100 text-indigo-700',
    'Other': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-semibold text-text-primary">{activity.name}</h5>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[activity.category] || categoryColors['Other']}`}>
            {activity.category}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {activity.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
          )}
          {activity.duration && (
            <span>{activity.duration} min</span>
          )}
          {activity.cost > 0 && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>${activity.cost}</span>
            </div>
          )}
        </div>
        {activity.notes && (
          <p className="text-sm text-text-secondary mt-1">{activity.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-white rounded transition"
          title="Edit activity"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-100 text-danger rounded transition"
          title="Delete activity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StopFormModal({ isOpen, onClose, onSubmit, stop, mode, tripStartDate, tripEndDate }) {
  const [formData, setFormData] = useState({
    cityName: stop?.cityName || '',
    country: stop?.country || '',
    arrivalDate: stop?.arrivalDate ? new Date(stop.arrivalDate).toISOString().split('T')[0] : '',
    departureDate: stop?.departureDate ? new Date(stop.departureDate).toISOString().split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cityName.trim()) newErrors.cityName = 'City name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    
    if (formData.arrivalDate && formData.departureDate) {
      if (new Date(formData.arrivalDate) > new Date(formData.departureDate)) {
        newErrors.departureDate = 'Departure must be after arrival';
      }
    }
    
    // Check if dates are within trip range
    if (formData.arrivalDate && tripStartDate) {
      if (new Date(formData.arrivalDate) < new Date(tripStartDate)) {
        newErrors.arrivalDate = 'Arrival date must be within trip dates';
      }
    }
    if (formData.departureDate && tripEndDate) {
      if (new Date(formData.departureDate) > new Date(tripEndDate)) {
        newErrors.departureDate = 'Departure date must be within trip dates';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Stop' : 'Edit Stop'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            City Name <span className="text-danger">*</span>
          </label>
          <input
            name="cityName"
            type="text"
            value={formData.cityName}
            onChange={handleChange}
            placeholder="e.g., Paris"
            className={`w-full px-4 py-3 bg-gray-50 border ${
              errors.cityName ? 'border-red-400' : 'border-gray-200'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
          />
          {errors.cityName && <p className="mt-1 text-sm text-red-600">{errors.cityName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Country <span className="text-danger">*</span>
          </label>
          <input
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., France"
            className={`w-full px-4 py-3 bg-gray-50 border ${
              errors.country ? 'border-red-400' : 'border-gray-200'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
          />
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Arrival Date <span className="text-danger">*</span>
            </label>
            <input
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              min={tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : undefined}
              max={tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : undefined}
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.arrivalDate ? 'border-red-400' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
            />
            {errors.arrivalDate && <p className="mt-1 text-sm text-red-600">{errors.arrivalDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Departure Date <span className="text-danger">*</span>
            </label>
            <input
              name="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={handleChange}
              min={formData.arrivalDate || (tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : undefined)}
              max={tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : undefined}
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.departureDate ? 'border-red-400' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
            />
            {errors.departureDate && <p className="mt-1 text-sm text-red-600">{errors.departureDate}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mode === 'add' ? 'Add Stop' : 'Update Stop'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ActivityFormModal({ isOpen, onClose, onSubmit, activity, mode, stop }) {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    category: activity?.category || 'Other',
    date: activity?.date ? new Date(activity.date).toISOString().split('T')[0] : '',
    time: activity?.time || '',
    duration: activity?.duration || '',
    cost: activity?.cost || '',
    notes: activity?.notes || '',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Sightseeing',
    'Food & Drink',
    'Adventure',
    'Culture',
    'Shopping',
    'Transport',
    'Accommodation',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Activity name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    // Check if date is within stop range
    if (formData.date && stop) {
      const activityDate = new Date(formData.date);
      const arrivalDate = new Date(stop.arrivalDate);
      const departureDate = new Date(stop.departureDate);
      
      if (activityDate < arrivalDate || activityDate > departureDate) {
        newErrors.date = 'Activity date must be within stop dates';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Convert numeric fields
    const submitData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
    };
    
    onSubmit(submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Activity' : 'Edit Activity'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Activity Name <span className="text-danger">*</span>
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Visit Eiffel Tower"
            className={`w-full px-4 py-3 bg-gray-50 border ${
              errors.name ? 'border-red-400' : 'border-gray-200'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Date <span className="text-danger">*</span>
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              min={stop?.arrivalDate ? new Date(stop.arrivalDate).toISOString().split('T')[0] : undefined}
              max={stop?.departureDate ? new Date(stop.departureDate).toISOString().split('T')[0] : undefined}
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.date ? 'border-red-400' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Time
            </label>
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Duration (minutes)
            </label>
            <input
              name="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Cost ($)
            </label>
            <input
              name="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional details..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mode === 'add' ? 'Add Activity' : 'Update Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
