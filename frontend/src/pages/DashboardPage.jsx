import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Calendar, Plane, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalCountries: 0,
    totalActivities: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tripsRes] = await Promise.all([
        api.get('/api/trips/stats'),
        api.get('/api/trips'),
      ]);
      
      setStats(statsRes.data.data);
      setRecentTrips((tripsRes.data.data || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statsDisplay = [
    { 
      icon: Plane, 
      label: 'Total Trips', 
      value: stats.totalTrips, 
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    { 
      icon: Calendar, 
      label: 'Upcoming', 
      value: stats.upcomingTrips, 
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },
    { 
      icon: MapPin, 
      label: 'Countries', 
      value: stats.totalCountries, 
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    { 
      icon: TrendingUp, 
      label: 'Activities', 
      value: stats.totalActivities, 
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl shadow-soft"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section - Premium Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 md:p-14 shadow-2xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            <span className="text-white/90 font-medium">Welcome to Traveloop</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Plan Your Next
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Dream Adventure
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            Create smart itineraries, track budgets, and discover amazing destinations all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl hover:shadow-white/20"
            >
              <Plus className="w-5 h-5" />
              Create New Trip
            </Link>
            <Link
              to="/explore-cities"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Explore Destinations
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <p className="text-text-secondary text-sm font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
                <p className="text-4xl font-bold text-text-primary">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Trips - Premium Grid */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">Your Trips</h2>
            <p className="text-text-secondary">Manage and explore your travel plans</p>
          </div>
          <Link 
            to="/my-trips" 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No trips yet</h3>
            <p className="text-text-secondary mb-8 text-lg">Start planning your first adventure today!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-large"
            >
              <Plus className="w-5 h-5" />
              Create Your First Trip
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTrips.map((trip, index) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/trip/${trip._id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100"
                >
                  {/* Trip Image */}
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
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
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

                  {/* Trip Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-blue-600 transition-colors">
                      {trip.title}
                    </h3>
                    {trip.description && (
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {trip.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{trip.stops?.length || 0} stops</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
