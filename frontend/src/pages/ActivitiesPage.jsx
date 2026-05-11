import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, Clock, Filter, Sparkles, Mountain, Coffee, Camera, ShoppingBag, Plane, Building, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';

const categoryIcons = {
  'Sightseeing': Camera,
  'Food & Drink': Coffee,
  'Adventure': Mountain,
  'Culture': Building,
  'Shopping': ShoppingBag,
  'Transport': Plane,
  'Accommodation': Building,
  'Other': MoreHorizontal
};

const categoryColors = {
  'Sightseeing': 'from-blue-500 to-blue-600',
  'Food & Drink': 'from-orange-500 to-orange-600',
  'Adventure': 'from-green-500 to-green-600',
  'Culture': 'from-purple-500 to-purple-600',
  'Shopping': 'from-pink-500 to-pink-600',
  'Transport': 'from-indigo-500 to-indigo-600',
  'Accommodation': 'from-teal-500 to-teal-600',
  'Other': 'from-gray-500 to-gray-600'
};

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedStop, setSelectedStop] = useState('');

  const categories = ['all', 'Sightseeing', 'Food & Drink', 'Adventure', 'Culture', 'Shopping', 'Transport', 'Accommodation', 'Other'];

  useEffect(() => {
    fetchActivities();
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/api/activities');
      setActivities(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToTrip = (activity) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelectedActivity(activity);
    setShowAddModal(true);
  };

  const handleAddActivity = async () => {
    if (!selectedTrip || !selectedStop) {
      alert('Please select both a trip and a stop');
      return;
    }

    try {
      await api.post(`/api/trips/${selectedTrip}/stops/${selectedStop}/activities`, {
        name: selectedActivity.name,
        category: selectedActivity.category,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: selectedActivity.duration || 120,
        cost: selectedActivity.cost || 0,
        notes: selectedActivity.description || ''
      });
      
      alert('Activity added to your trip!');
      setShowAddModal(false);
      setSelectedActivity(null);
      setSelectedTrip('');
      setSelectedStop('');
    } catch (err) {
      console.error('Failed to add activity:', err);
      alert('Failed to add activity to trip');
    }
  };

  const selectedTripData = trips.find(t => t._id === selectedTrip);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <span className="text-white/90 font-semibold">Activities</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Activities</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Find the perfect experiences for your next adventure
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = categoryIcons[category] || Sparkles;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-600'} text-white shadow-md`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category !== 'all' && <Icon className="w-4 h-4" />}
                    {category === 'all' ? 'All Activities' : category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-semibold">Total Activities</p>
              <p className="text-3xl font-bold text-purple-900">{activities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center">
              <Filter className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-pink-700 font-semibold">Categories</p>
              <p className="text-3xl font-bold text-pink-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700 font-semibold">Filtered</p>
              <p className="text-3xl font-bold text-orange-900">{filteredActivities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 shadow-soft border border-gray-100 text-center">
          <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text-primary mb-2">No activities found</h3>
          <p className="text-text-secondary">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const Icon = categoryIcons[activity.category] || Sparkles;
            const colorClass = categoryColors[activity.category] || 'from-gray-500 to-gray-600';
            
            return (
              <div
                key={activity._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Activity Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${colorClass} text-white rounded-full shadow-lg`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-bold text-sm">{activity.category}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-1">
                    {activity.name}
                  </h3>
                  
                  {activity.description && (
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  )}

                  {/* Activity Details */}
                  <div className="space-y-2 mb-4">
                    {activity.duration && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration} minutes</span>
                      </div>
                    )}
                    {activity.cost !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <DollarSign className="w-4 h-4" />
                        <span>${activity.cost}</span>
                      </div>
                    )}
                    {activity.location && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Add to Trip Button */}
                  <button
                    onClick={() => handleAddToTrip(activity)}
                    className={`w-full py-3 bg-gradient-to-r ${colorClass} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to Trip Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Activity to Trip">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {selectedActivity?.name}
              </h3>
              <p className="text-text-secondary text-sm">
                {selectedActivity?.description}
              </p>
            </div>

            {/* Select Trip */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Select Trip
              </label>
              <select
                value={selectedTrip}
                onChange={(e) => {
                  setSelectedTrip(e.target.value);
                  setSelectedStop('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a trip...</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Stop */}
            {selectedTrip && selectedTripData?.stops?.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Select Stop
                </label>
                <select
                  value={selectedStop}
                  onChange={(e) => setSelectedStop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a stop...</option>
                  {selectedTripData.stops.map((stop) => (
                    <option key={stop._id} value={stop._id}>
                      {stop.cityName}, {stop.country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddActivity}
                disabled={!selectedTrip || !selectedStop}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Activity
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-gray-200 text-text-primary rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
