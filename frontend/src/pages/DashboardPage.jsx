import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Calendar, Plane, Plus, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalTrips: 0, upcomingTrips: 0, totalCountries: 0, totalActivities: 0 });
  const [recentTrips, setRecentTrips] = useState([]);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tripsRes, citiesRes] = await Promise.all([
        api.get('/api/trips/stats'),
        api.get('/api/trips'),
        api.get('/api/cities').catch(() => ({ data: { data: [] } })),
      ]);
      setStats(statsRes.data.data || {});
      const allTrips = tripsRes.data.data || [];
      const now = new Date();
      const upcoming = allTrips
        .filter(t => new Date(t.startDate) > now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
      setUpcomingTrip(upcoming || null);
      setRecentTrips([...allTrips]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 4));
      setTrendingDestinations((citiesRes.data.data || []).slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { icon: Plane,      label: 'Total Trips',  value: stats.totalTrips,      from: 'from-blue-500',   to: 'to-cyan-500',    bg: 'bg-blue-500/10',   text: 'text-blue-400' },
    { icon: Calendar,   label: 'Upcoming',     value: stats.upcomingTrips,   from: 'from-violet-500', to: 'to-purple-500',  bg: 'bg-violet-500/10', text: 'text-violet-400' },
    { icon: MapPin,     label: 'Countries',    value: stats.totalCountries,  from: 'from-amber-500',  to: 'to-orange-500',  bg: 'bg-amber-500/10',  text: 'text-amber-400' },
    { icon: TrendingUp, label: 'Activities',   value: stats.totalActivities, from: 'from-emerald-500',to: 'to-teal-500',    bg: 'bg-emerald-500/10',text: 'text-emerald-400' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-72 bg-card/50 rounded-3xl border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card/50 rounded-2xl border border-border" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1040] via-[#0f1f5c] to-[#0B1020] p-8 sm:p-12 shadow-2xl border border-white/5"
      >
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-white/70 font-medium text-sm">
              Welcome back, {user?.name?.split(' ')[0] || 'Traveler'} 👋
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Plan Your Next
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dream Adventure
            </span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl">
            Create smart itineraries, track budgets, and discover amazing destinations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </Link>
            <Link
              to="/explore-cities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-sm sm:text-base"
            >
              <Globe className="w-4 h-4" />
              Explore
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group bg-card/50 backdrop-blur-md border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-large transition-all duration-300 overflow-hidden relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.from} ${s.to} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.text}`} />
            </div>
            <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold text-text-primary">{s.value ?? 0}</p>
          </motion.div>
        ))}
      </div>

      {/* ── UPCOMING TRIP ── */}
      {upcomingTrip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-7 sm:p-10 border border-white/10"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Next Adventure</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{upcomingTrip.title}</h2>
              <p className="text-white/70 text-sm">
                {new Date(upcomingTrip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' → '}
                {new Date(upcomingTrip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <Link
              to={`/trip/${upcomingTrip._id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl whitespace-nowrap self-start sm:self-auto"
            >
              View Trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── RECENT TRIPS ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-text-primary">Recent Trips</h2>
            <p className="text-text-secondary text-sm mt-0.5">Your latest travel plans</p>
          </div>
          <Link
            to="/my-trips"
            className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTrips.length === 0 ? (
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No trips yet</h3>
            <p className="text-text-secondary mb-6">Start planning your first adventure!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-large"
            >
              <Plus className="w-4 h-4" /> Create Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recentTrips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/trip/${trip._id}`}
                  className="group block bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-large transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                    {trip.coverImage ? (
                      <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-blue-400/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                      new Date(trip.startDate) > new Date() ? 'bg-emerald-500/80 text-white' : 'bg-black/60 text-white/80'
                    }`}>
                      {new Date(trip.startDate) > new Date() ? '✈️ Upcoming' : '📍 Past'}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-text-primary text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                    <div className="flex items-center justify-between text-text-secondary text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' – '}
                          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{trip.stops?.length || 0} stops</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── TRENDING DESTINATIONS ── */}
      {trendingDestinations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary">Trending Destinations</h2>
              <p className="text-text-secondary text-sm mt-0.5">Popular places to visit</p>
            </div>
            <Link
              to="/explore-cities"
              className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
            >
              Explore all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {trendingDestinations.map((city, i) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to="/explore-cities"
                  className="group block bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-large transition-all duration-300"
                >
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                    {(city.coverImage || city.image) ? (
                      <img
                        src={city.coverImage || city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-10 h-10 text-blue-400/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-sm leading-tight line-clamp-1">{city.name}</p>
                      <p className="text-white/70 text-xs">{city.country}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
