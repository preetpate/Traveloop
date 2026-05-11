import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, DollarSign, Edit, Trash2, 
  Plus, Clock, Tag, CheckCircle, Package, StickyNote 
} from 'lucide-react';
import api from '../services/api';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/api/trips/${id}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.delete(`/api/trips/${id}`);
      navigate('/my-trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert('Failed to delete trip');
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
                onClick={() => navigate(`/trip/${id}/edit`)}
                className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600/80 transition"
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
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No Itinerary Yet</h3>
            <p className="text-text-secondary mb-6">Start adding destinations to your trip</p>
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Destination
            </button>
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
    </div>
  );
}
