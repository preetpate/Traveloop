import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, AlertCircle, Loader, Camera, Coffee, Mountain, Building, ShoppingBag, Plane, MoreHorizontal } from 'lucide-react';
import api from '../services/api';

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
  'Sightseeing': 'bg-blue-100 text-blue-700 border-blue-200',
  'Food & Drink': 'bg-orange-100 text-orange-700 border-orange-200',
  'Adventure': 'bg-green-100 text-green-700 border-green-200',
  'Culture': 'bg-purple-100 text-purple-700 border-purple-200',
  'Shopping': 'bg-pink-100 text-pink-700 border-pink-200',
  'Transport': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Accommodation': 'bg-teal-100 text-teal-700 border-teal-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function PublicItineraryPage() {
  const { shareToken } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicTrip();
  }, [shareToken]);

  const fetchPublicTrip = async () => {
    try {
      const res = await api.get(`/api/public/${shareToken}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error('Failed to fetch public trip:', err);
      setError(err.response?.status === 404 ? 'Trip not found' : 'Failed to load trip');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100 text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {error === 'Trip not found' ? 'Trip Not Found' : 'Error Loading Trip'}
          </h2>
          <p className="text-text-secondary mb-6">
            {error === 'Trip not found' 
              ? 'This shared itinerary link is invalid or has been revoked.'
              : 'We encountered an error loading this itinerary. Please try again later.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Trip Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white">
        {trip.coverImage && (
          <div className="absolute inset-0">
            <img
              src={trip.coverImage}
              alt={trip.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90" />
          </div>
        )}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            Shared Itinerary
          </div>
          <h1 className="text-5xl font-bold mb-4">{trip.title}</h1>
          {trip.description && (
            <p className="text-xl text-white/90 mb-6 max-w-2xl">
              {trip.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">
                {trip.stops?.length || 0} {trip.stops?.length === 1 ? 'Stop' : 'Stops'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-text-primary">Itinerary</h2>
        
        {trip.stops && trip.stops.length > 0 ? (
          <div className="space-y-8">
            {trip.stops.map((stop, stopIndex) => (
              <div key={stop._id} className="relative">
                {/* Timeline Line */}
                {stopIndex < trip.stops.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
                )}

                {/* Stop Card */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                  {/* Stop Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                        {stopIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                          {stop.cityName}, {stop.country}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 text-text-secondary">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}
                            </span>
                          </div>
                          {stop.activities && stop.activities.length > 0 && (
                            <div className="flex items-center gap-2 text-text-secondary">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {stop.activities.length} {stop.activities.length === 1 ? 'Activity' : 'Activities'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  {stop.activities && stop.activities.length > 0 && (
                    <div className="p-6">
                      <div className="space-y-4">
                        {stop.activities.map((activity) => {
                          const Icon = categoryIcons[activity.category] || MoreHorizontal;
                          const colorClass = categoryColors[activity.category] || categoryColors['Other'];
                          
                          return (
                            <div
                              key={activity._id}
                              className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${colorClass} border flex items-center justify-center flex-shrink-0`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className="text-lg font-bold text-text-primary">
                                      {activity.name}
                                    </h4>
                                    <span className={`px-3 py-1 ${colorClass} border rounded-full text-xs font-bold whitespace-nowrap`}>
                                      {activity.category}
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 mb-3">
                                    {activity.date && (
                                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(activity.date)}</span>
                                      </div>
                                    )}
                                    {activity.time && (
                                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(activity.time)}</span>
                                      </div>
                                    )}
                                    {activity.duration && (
                                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Clock className="w-4 h-4" />
                                        <span>{activity.duration} min</span>
                                      </div>
                                    )}
                                    {activity.cost !== undefined && activity.cost > 0 && (
                                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <DollarSign className="w-4 h-4" />
                                        <span>${activity.cost}</span>
                                      </div>
                                    )}
                                  </div>

                                  {activity.notes && (
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                      {activity.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Activities */}
                  {(!stop.activities || stop.activities.length === 0) && (
                    <div className="p-6 text-center text-text-secondary">
                      <p className="text-sm">No activities planned for this stop yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No stops planned yet</h3>
            <p className="text-text-secondary">This trip doesn't have any stops added yet.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center">
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Want to create your own itinerary?
        </h3>
        <p className="text-text-secondary mb-6">
          Join Traveloop to plan and share your travel adventures
        </p>
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Get Started Free
        </a>
      </div>
    </div>
  );
}
