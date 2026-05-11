import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Compass, TrendingUp, Globe, ArrowLeft, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';

export default function ExploreCitiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchCities();
    if (user) fetchTrips();
  }, [user]);

  const fetchCities = async () => {
    try {
      const res = await api.get('/api/cities');
      setCities(res.data.data || []);
    } catch {
      try {
        const res = await api.get('/api/discovery/cities');
        setCities(res.data.data || []);
      } catch {
        setCities([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data.data || []);
    } catch {}
  };

  const filteredCities = cities.filter(city => {
    const matchSearch =
      city.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      city.country?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchSearch;
  });

  const handleAddToTrip = (city) => {
    if (!user) { navigate('/login'); return; }
    setSelectedCity(city);
    setShowAddModal(true);
    setAddSuccess(false);
  };

  const handleAddStop = async () => {
    if (!selectedTrip) return;
    try {
      const trip = trips.find(t => t._id === selectedTrip);
      await api.post(`/api/trips/${selectedTrip}/stops`, {
        cityName: selectedCity.name,
        country: selectedCity.country,
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
      });
      setAddSuccess(true);
      setTimeout(() => {
        setShowAddModal(false);
        setSelectedCity(null);
        setSelectedTrip('');
        setAddSuccess(false);
      }, 1500);
    } catch {}
  };

  const continents = ['all', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa'];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1040] via-[#0f1f5c] to-[#0B1020] pt-6 pb-16 px-4 sm:px-8">
        {/* Blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Back button */}
        <div className="relative z-10 max-w-7xl mx-auto mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-medium transition-all duration-200 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Discover</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Explore Amazing
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cities
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mb-8">
              Discover the world's most beautiful destinations and start planning your next adventure.
            </p>

            {/* Search bar inside hero */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search cities or countries..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: MapPin, label: 'Cities', value: cities.length, color: 'from-blue-500 to-blue-600' },
            { icon: TrendingUp, label: 'Popular', value: cities.filter(c => (c.rating || 0) >= 4.7).length, color: 'from-purple-500 to-purple-600' },
            { icon: Globe, label: 'Countries', value: new Set(cities.map(c => c.country)).size, color: 'from-emerald-500 to-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-text-secondary text-xs sm:text-sm font-medium">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-text-primary">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── FILTER CHIPS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {continents.map(c => (
            <button
              key={c}
              onClick={() => setSelectedContinent(c)}
              className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap text-sm transition-all duration-200 ${
                selectedContinent === c
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-card/60 backdrop-blur-md border border-border text-text-secondary hover:text-text-primary hover:border-primary/50'
              }`}
            >
              {c === 'all' ? '🌍 All' : c}
            </button>
          ))}
        </div>

        {/* ── CITIES GRID ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-card/50 rounded-2xl h-80 animate-pulse border border-border" />
            ))}
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-16 text-center">
            <Compass className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No cities found</h3>
            <p className="text-text-secondary">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city, idx) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group bg-card/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-large transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                  {city.image || city.coverImage ? (
                    <img
                      src={city.image || city.coverImage}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-14 h-14 text-blue-400/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Rating */}
                  {city.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-bold text-sm">{city.rating}</span>
                    </div>
                  )}

                  {/* City name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-bold text-white leading-tight">{city.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-white/70" />
                      <p className="text-white/80 text-sm font-medium">{city.country}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {city.description && (
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                      {city.description}
                    </p>
                  )}

                  {city.highlights && city.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {city.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToTrip(city)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Trip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD TO TRIP MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-card/95 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-text-primary">Add to Trip</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-card rounded-xl transition text-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-success font-bold text-lg">Added successfully!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-5">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary">{selectedCity?.name}</p>
                      <p className="text-text-secondary text-sm">{selectedCity?.country}</p>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-text-secondary mb-2">Select Trip</label>
                  <select
                    value={selectedTrip}
                    onChange={e => setSelectedTrip(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary mb-5"
                  >
                    <option value="">Choose a trip...</option>
                    {trips.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddStop}
                      disabled={!selectedTrip}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:shadow-lg transition-all"
                    >
                      Add City
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-3 bg-card border border-border text-text-secondary rounded-xl font-semibold hover:text-text-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
