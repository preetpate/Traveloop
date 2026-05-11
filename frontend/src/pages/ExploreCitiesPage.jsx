import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Compass } from 'lucide-react';
import api from '../services/api';

export default function ExploreCitiesPage() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Explore Cities</h1>
        <p className="text-text-secondary mt-1">Discover amazing destinations around the world</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cities or countries..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Cities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft border border-gray-100 text-center">
          <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">No cities found. Try a different search!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100"
            >
              {/* City Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                {city.image ? (
                  <img
                    src={city.image}
                    alt={city.name}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* City Name Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                  <p className="text-white/90 text-sm">{city.country}</p>
                </div>
              </div>

              {/* City Info */}
              <div className="p-5">
                {city.description && (
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {city.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  {city.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{city.rating}</span>
                    </div>
                  )}
                  {city.visitors && (
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Users className="w-4 h-4" />
                      <span>{city.visitors}</span>
                    </div>
                  )}
                </div>

                {city.highlights && city.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {city.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full"
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
