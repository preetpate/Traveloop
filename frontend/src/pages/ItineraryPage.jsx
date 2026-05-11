import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, DollarSign, MapPin, StickyNote } from 'lucide-react';
import { useTrip } from '../hooks/useTrip';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

// Category icons mapping
const categoryIcons = {
  Sightseeing: MapPin,
  'Food & Drink': DollarSign,
  Adventure: MapPin,
  Culture: MapPin,
  Shopping: MapPin,
  Transport: MapPin,
  Accommodation: MapPin,
  Other: StickyNote,
};

export default function ItineraryPage() {
  const { activeTrip } = useTrip();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  // Redirect if no active trip
  useEffect(() => {
    if (!activeTrip) {
      navigate('/my-trips');
    }
  }, [activeTrip, navigate]);

  // Group all activities by date
  const activitiesByDate = useMemo(() => {
    if (!activeTrip?.stops) return {};

    const grouped = {};
    activeTrip.stops.forEach((stop) => {
      stop.activities?.forEach((activity) => {
        const dateKey = new Date(activity.date).toISOString().split('T')[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push({
          ...activity,
          stopName: stop.cityName,
          stopCountry: stop.country,
        });
      });
    });

    // Sort activities within each date by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
    });

    return grouped;
  }, [activeTrip]);

  // Get sorted dates
  const sortedDates = useMemo(() => {
    return Object.keys(activitiesByDate).sort();
  }, [activitiesByDate]);

  // Initialize selected date to first date
  useEffect(() => {
    if (sortedDates.length > 0 && !selectedDate) {
      setSelectedDate(sortedDates[0]);
    }
  }, [sortedDates, selectedDate]);

  // Navigation handlers
  const handlePrevDay = () => {
    const currentIndex = sortedDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(sortedDates[currentIndex - 1]);
    }
  };

  const handleNextDay = () => {
    const currentIndex = sortedDates.indexOf(selectedDate);
    if (currentIndex < sortedDates.length - 1) {
      setSelectedDate(sortedDates[currentIndex + 1]);
    }
  };

  if (!activeTrip) {
    return null;
  }

  const currentActivities = selectedDate ? activitiesByDate[selectedDate] || [] : [];
  const currentIndex = sortedDates.indexOf(selectedDate);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sortedDates.length - 1;

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-10 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8" />
            <span className="text-white/90 font-semibold">Trip Itinerary</span>
          </div>
          <h1 className="text-5xl font-bold mb-3">{activeTrip.title}</h1>
          <p className="text-xl text-white/90">
            {new Date(activeTrip.startDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            -{' '}
            {new Date(activeTrip.endDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">No activities scheduled</h3>
          <p className="text-text-secondary">Add activities to your stops to see them here</p>
        </Card>
      ) : (
        <>
          {/* Date Navigation */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevDay}
                disabled={!hasPrev}
                className={`p-3 rounded-xl transition ${
                  hasPrev
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">
                  {selectedDate &&
                    new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  Day {currentIndex + 1} of {sortedDates.length}
                </p>
              </div>

              <button
                onClick={handleNextDay}
                disabled={!hasNext}
                className={`p-3 rounded-xl transition ${
                  hasNext
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </Card>

          {/* Activities Timeline */}
          <div className="space-y-4">
            {currentActivities.map((activity, index) => {
              const Icon = categoryIcons[activity.category] || StickyNote;
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-large transition-shadow">
                    <div className="flex gap-6">
                      {/* Time indicator */}
                      <div className="flex-shrink-0 w-20 text-center">
                        {activity.time ? (
                          <>
                            <div className="text-2xl font-bold text-primary">
                              {activity.time.split(':')[0]}
                            </div>
                            <div className="text-sm text-text-secondary">
                              :{activity.time.split(':')[1]}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-text-secondary">All day</div>
                        )}
                      </div>

                      {/* Activity content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <h3 className="text-xl font-bold text-text-primary">
                                {activity.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {activity.stopName}, {activity.stopCountry}
                              </span>
                            </div>
                          </div>
                          <Badge category={activity.category} />
                        </div>

                        {/* Activity details */}
                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                          {activity.duration && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{activity.duration} min</span>
                            </div>
                          )}
                          {activity.cost > 0 && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4" />
                              <span>${activity.cost.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {activity.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <p className="text-sm text-text-secondary whitespace-pre-wrap">
                              {activity.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
