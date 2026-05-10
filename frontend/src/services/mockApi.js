// Mock API service using localStorage for demo purposes
// This allows the app to work without a real backend

const STORAGE_KEYS = {
  users: 'traveloop_users',
  trips: 'traveloop_trips',
  currentUser: 'traveloop_current_user',
  token: 'token',
};

// Helper to get data from localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Helper to save data to localStorage
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize with sample data
const initializeMockData = () => {
  if (!getFromStorage(STORAGE_KEYS.users)) {
    saveToStorage(STORAGE_KEYS.users, [
      {
        _id: 'user1',
        name: 'Demo User',
        email: 'demo@traveloop.com',
        role: 'user',
        avatarUrl: '',
        bio: 'Travel enthusiast',
        homeCountry: 'India',
      },
    ]);
  }

  if (!getFromStorage(STORAGE_KEYS.trips)) {
    saveToStorage(STORAGE_KEYS.trips, [
      {
        _id: 'trip1',
        userId: 'user1',
        title: 'Summer Europe Adventure',
        description: 'Exploring the beautiful cities of Europe',
        startDate: '2024-06-15',
        endDate: '2024-06-25',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        stops: [
          {
            _id: 'stop1',
            cityName: 'Paris',
            country: 'France',
            arrivalDate: '2024-06-15',
            departureDate: '2024-06-18',
            order: 1,
            activities: [
              {
                _id: 'act1',
                name: 'Visit Eiffel Tower',
                category: 'Sightseeing',
                date: '2024-06-16',
                time: '10:00',
                duration: 3,
                cost: 2000,
                notes: 'Book tickets in advance',
              },
            ],
          },
        ],
        shareToken: null,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'trip2',
        userId: 'user1',
        title: 'Goa Beach Vacation',
        description: 'Relaxing beach holiday in Goa',
        startDate: '2024-07-01',
        endDate: '2024-07-07',
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        stops: [],
        shareToken: null,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'trip3',
        userId: 'user1',
        title: 'Himalayan Trek',
        description: 'Adventure in the mountains',
        startDate: '2024-08-10',
        endDate: '2024-08-20',
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        stops: [],
        shareToken: null,
        createdAt: new Date().toISOString(),
      },
    ]);
  }
};

// Mock API methods
export const mockApi = {
  // Auth
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    
    const users = getFromStorage(STORAGE_KEYS.users) || [];
    const user = users.find((u) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // For demo, accept any password
    const token = 'mock_jwt_token_' + Date.now();
    saveToStorage(STORAGE_KEYS.currentUser, user);
    
    return {
      data: {
        data: {
          token,
          user,
        },
      },
    };
  },

  register: async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const users = getFromStorage(STORAGE_KEYS.users) || [];
    
    if (users.find((u) => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      _id: 'user' + Date.now(),
      name,
      email,
      role: 'user',
      avatarUrl: '',
      bio: '',
      homeCountry: '',
    };
    
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.users, users);
    saveToStorage(STORAGE_KEYS.currentUser, newUser);
    
    const token = 'mock_jwt_token_' + Date.now();
    
    return {
      data: {
        data: {
          token,
          user: newUser,
        },
      },
    };
  },

  getMe: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = getFromStorage(STORAGE_KEYS.currentUser);
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    return {
      data: {
        data: user,
      },
    };
  },

  // Trips
  getTrips: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const currentUser = getFromStorage(STORAGE_KEYS.currentUser);
    
    const userTrips = trips.filter((t) => t.userId === currentUser?._id);
    
    return {
      data: {
        data: userTrips,
      },
    };
  },

  createTrip: async (tripData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const currentUser = getFromStorage(STORAGE_KEYS.currentUser);
    
    const newTrip = {
      _id: 'trip' + Date.now(),
      userId: currentUser._id,
      ...tripData,
      stops: [],
      shareToken: null,
      createdAt: new Date().toISOString(),
    };
    
    trips.push(newTrip);
    saveToStorage(STORAGE_KEYS.trips, trips);
    
    return {
      data: {
        data: newTrip,
      },
    };
  },

  getTripById: async (tripId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const trip = trips.find((t) => t._id === tripId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    return {
      data: {
        data: trip,
      },
    };
  },

  updateTrip: async (tripId, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const index = trips.findIndex((t) => t._id === tripId);
    
    if (index === -1) {
      throw new Error('Trip not found');
    }
    
    trips[index] = { ...trips[index], ...updates };
    saveToStorage(STORAGE_KEYS.trips, trips);
    
    return {
      data: {
        data: trips[index],
      },
    };
  },

  deleteTrip: async (tripId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const filtered = trips.filter((t) => t._id !== tripId);
    saveToStorage(STORAGE_KEYS.trips, filtered);
    
    return {
      data: {
        success: true,
      },
    };
  },

  getTripStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const trips = getFromStorage(STORAGE_KEYS.trips) || [];
    const currentUser = getFromStorage(STORAGE_KEYS.currentUser);
    
    const userTrips = trips.filter((t) => t.userId === currentUser?._id);
    
    const stats = {
      totalTrips: userTrips.length,
      upcomingTrips: userTrips.filter((t) => new Date(t.startDate) > new Date()).length,
      totalCountries: new Set(userTrips.flatMap((t) => t.stops?.map((s) => s.country) || [])).size,
      totalCities: new Set(userTrips.flatMap((t) => t.stops?.map((s) => s.cityName) || [])).size,
      totalActivities: userTrips.reduce((sum, t) => sum + (t.stops?.reduce((s, stop) => s + (stop.activities?.length || 0), 0) || 0), 0),
    };
    
    return {
      data: {
        data: stats,
      },
    };
  },
};

// Initialize mock data on load
initializeMockData();

export default mockApi;
