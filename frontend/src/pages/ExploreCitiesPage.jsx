import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Compass, TrendingUp, Globe } from 'lucide-react';
import api from '../services/api';

export default function ExploreCitiesPage() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState('all');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await api.get('/api/discovery/cities');
      setCities(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = cities.filter(city =>
    (city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const continents = ['all', 'Europe', 'Asia', 'Americas', 'Middle East'];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8" />
            <span className="text-white/90 font-semibold">Discover</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Explore Amazing Cities</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover the world's most beautiful destinations and start planning your next adventure
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cities or countries..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Continent Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                  selectedContinent === continent
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {continent === 'all' ? 'All' : continent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold">Total Cities</p>
              <p className="text-3xl font-bold text-blue-900">{cities.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-semibold">Popular</p>
              <p className="text-3xl font-bold text-purple-900">{cities.filter(c => c.rating >= 4.7).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-semibold">Countries</p>
              <p className="text-3xl font-bold text-green-900">{new Set(cities.map(c => c.country)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 shadow-soft border border-gray-100 text-center">
          <Compass className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text-primary mb-2">No cities found</h3>
          <p className="text-text-secondary">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
            >
              {/* City Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                {city.image ? (
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-blue-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Rating Badge */}
                {city.rating && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{city.rating}</span>
                    </div>
                  </div>
                )}

                {/* City Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{city.name}</h3>
                  <p className="text-white/90 font-medium drop-shadow-lg">{city.country}</p>
                </div>
              </div>

              {/* City Info */}
              <div className="p-6">
                {city.description && (
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                    {city.description}
                  </p>
                )}
                
                {city.visitors && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{city.visitors} annual visitors</span>
                  </div>
                )}

                {city.highlights && city.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
