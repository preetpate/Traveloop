import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const TripContext = createContext(null);

export function TripProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTripState] = useState(() => {
    try {
      const stored = sessionStorage.getItem('activeTrip');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Lazy-load trips when user becomes authenticated
  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      setTrips([]);
      setActiveTripState(null);
      sessionStorage.removeItem('activeTrip');
    }
  }, [user]);

  const setActiveTrip = useCallback((tripId) => {
    if (!tripId) {
      setActiveTripState(null);
      sessionStorage.removeItem('activeTrip');
      return;
    }
    const found = trips.find((t) => t._id === tripId) || null;
    setActiveTripState(found);
    if (found) {
      sessionStorage.setItem('activeTrip', JSON.stringify(found));
    } else {
      sessionStorage.removeItem('activeTrip');
    }
  }, [trips]);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrip = useCallback(async (data) => {
    const res = await api.post('/api/trips', data);
    const newTrip = res.data.data;
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const updateTrip = useCallback(async (tripId, data) => {
    const res = await api.put(`/api/trips/${tripId}`, data);
    const updated = res.data.data;
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updated;
  }, [activeTrip]);

  const deleteTrip = useCallback(async (tripId) => {
    await api.delete(`/api/trips/${tripId}`);
    setTrips((prev) => prev.filter((t) => t._id !== tripId));
    if (activeTrip?._id === tripId) {
      setActiveTripState(null);
      sessionStorage.removeItem('activeTrip');
    }
  }, [activeTrip]);

  // --- Stop operations ---

  const addStop = useCallback(async (tripId, data) => {
    const res = await api.post(`/api/trips/${tripId}/stops`, data);
    const updated = res.data.data;
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updated;
  }, [activeTrip]);

  const updateStop = useCallback(async (tripId, stopId, data) => {
    const res = await api.put(`/api/trips/${tripId}/stops/${stopId}`, data);
    const updated = res.data.data;
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updated;
  }, [activeTrip]);

  const deleteStop = useCallback(async (tripId, stopId) => {
    await api.delete(`/api/trips/${tripId}/stops/${stopId}`);
    setTrips((prev) =>
      prev.map((t) =>
        t._id === tripId
          ? { ...t, stops: t.stops.filter((s) => s._id !== stopId) }
          : t
      )
    );
    if (activeTrip?._id === tripId) {
      const updated = { ...activeTrip, stops: activeTrip.stops.filter((s) => s._id !== stopId) };
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
  }, [activeTrip]);

  const reorderStops = useCallback(async (tripId, orderedIds) => {
    const res = await api.put(`/api/trips/${tripId}/stops/reorder`, { orderedIds });
    const updated = res.data.data;
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updated;
  }, [activeTrip]);

  // --- Activity operations ---

  const addActivity = useCallback(async (tripId, stopId, data) => {
    const res = await api.post(`/api/trips/${tripId}/stops/${stopId}/activities`, data);
    const updatedStop = res.data.data;
    setTrips((prev) =>
      prev.map((t) =>
        t._id === tripId
          ? { ...t, stops: t.stops.map((s) => (s._id === stopId ? updatedStop : s)) }
          : t
      )
    );
    if (activeTrip?._id === tripId) {
      const updated = {
        ...activeTrip,
        stops: activeTrip.stops.map((s) => (s._id === stopId ? updatedStop : s)),
      };
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updatedStop;
  }, [activeTrip]);

  const updateActivity = useCallback(async (tripId, stopId, activityId, data) => {
    const res = await api.put(
      `/api/trips/${tripId}/stops/${stopId}/activities/${activityId}`,
      data
    );
    const updatedStop = res.data.data;
    setTrips((prev) =>
      prev.map((t) =>
        t._id === tripId
          ? { ...t, stops: t.stops.map((s) => (s._id === stopId ? updatedStop : s)) }
          : t
      )
    );
    if (activeTrip?._id === tripId) {
      const updated = {
        ...activeTrip,
        stops: activeTrip.stops.map((s) => (s._id === stopId ? updatedStop : s)),
      };
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
    return updatedStop;
  }, [activeTrip]);

  const deleteActivity = useCallback(async (tripId, stopId, activityId) => {
    await api.delete(`/api/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
    setTrips((prev) =>
      prev.map((t) =>
        t._id === tripId
          ? {
              ...t,
              stops: t.stops.map((s) =>
                s._id === stopId
                  ? { ...s, activities: s.activities.filter((a) => a._id !== activityId) }
                  : s
              ),
            }
          : t
      )
    );
    if (activeTrip?._id === tripId) {
      const updated = {
        ...activeTrip,
        stops: activeTrip.stops.map((s) =>
          s._id === stopId
            ? { ...s, activities: s.activities.filter((a) => a._id !== activityId) }
            : s
        ),
      };
      setActiveTripState(updated);
      sessionStorage.setItem('activeTrip', JSON.stringify(updated));
    }
  }, [activeTrip]);

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        isLoading,
        setActiveTrip,
        fetchTrips,
        createTrip,
        updateTrip,
        deleteTrip,
        addStop,
        updateStop,
        deleteStop,
        reorderStops,
        addActivity,
        updateActivity,
        deleteActivity,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}
