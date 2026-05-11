// Mock API service using localStorage for demo purposes
// This allows the app to work without a real backend

const STORAGE_KEYS = {
  users: 'traveloop_users',
  trips: 'traveloop_trips',
  currentUser: 'traveloop_current_user',
  token: 'token',
  budget: 'traveloop_budget',
  packing: 'traveloop_packing',
  notes: 'traveloop_notes',
  cities: 'traveloop_cities',
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
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
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
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
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
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        stops: [],
        shareToken: null,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  if (!getFromStorage(STORAGE_KEYS.budget)) {
    saveToStorage(STORAGE_KEYS.budget, []);
  }

  if (!getFromStorage(STORAGE_KEYS.packing)) {
    saveToStorage(STORAGE_KEYS.packing, []);
  }

  if (!getFromStorage(STORAGE_KEYS.notes)) {
    saveToStorage(STORAGE_KEYS.notes, []);
  }

  if (!getFromStorage(STORAGE_KEYS.cities)) {
    saveToStorage(STORAGE_KEYS.cities, [
      {
        _id: 'city1',
        name: 'Paris',
        country: 'France',
        description: 'The City of Light, known for its art, fashion, and culture',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        visitors: '30M+',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
      },
      {
        _id: 'city2',
        name: 'Tokyo',
        country: 'Japan',
        description: 'A vibrant metropolis blending tradition and modernity',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        visitors: '15M+',
        highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple'],
      },
      {
        _id: 'city3',
        name: 'New York',
        country: 'USA',
        description: 'The city that never sleeps, a global hub of culture and commerce',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        visitors: '60M+',
        highlights: ['Statue of Liberty', 'Central Park', 'Times Square'],
      },
      {
        _id: 'city4',
        name: 'Dubai',
        country: 'UAE',
        description: 'A futuristic city with stunning architecture and luxury',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        visitors: '16M+',
        highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall'],
      },
      {
        _id: 'city5',
        name: 'London',
        country: 'UK',
        description: 'Historic capital with royal palaces and world-class museums',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        visitors: '19M+',
        highlights: ['Big Ben', 'Tower Bridge', 'British Museum'],
      },
      {
        _id: 'city6',
        name: 'Bali',
        country: 'Indonesia',
        description: 'Tropical paradise with beautiful beaches and temples',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        visitors: '6M+',
        highlights: ['Ubud', 'Tanah Lot', 'Seminyak Beach'],
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

  // Budget
  getBudget: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const budget = getFromStorage(STORAGE_KEYS.budget) || [];
    return { data: { data: budget } };
  },

  createBudget: async (budgetData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const budget = getFromStorage(STORAGE_KEYS.budget) || [];
    const newItem = {
      _id: 'budget' + Date.now(),
      ...budgetData,
      amount: parseFloat(budgetData.amount),
      createdAt: new Date().toISOString(),
    };
    budget.push(newItem);
    saveToStorage(STORAGE_KEYS.budget, budget);
    return { data: { data: newItem } };
  },

  deleteBudget: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const budget = getFromStorage(STORAGE_KEYS.budget) || [];
    const filtered = budget.filter((b) => b._id !== id);
    saveToStorage(STORAGE_KEYS.budget, filtered);
    return { data: { success: true } };
  },

  // Packing
  getPacking: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const packing = getFromStorage(STORAGE_KEYS.packing) || [];
    return { data: { data: packing } };
  },

  createPacking: async (packingData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const packing = getFromStorage(STORAGE_KEYS.packing) || [];
    const newItem = {
      _id: 'pack' + Date.now(),
      ...packingData,
      createdAt: new Date().toISOString(),
    };
    packing.push(newItem);
    saveToStorage(STORAGE_KEYS.packing, packing);
    return { data: { data: newItem } };
  },

  updatePacking: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const packing = getFromStorage(STORAGE_KEYS.packing) || [];
    const index = packing.findIndex((p) => p._id === id);
    if (index !== -1) {
      packing[index] = { ...packing[index], ...updates };
      saveToStorage(STORAGE_KEYS.packing, packing);
    }
    return { data: { data: packing[index] } };
  },

  deletePacking: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const packing = getFromStorage(STORAGE_KEYS.packing) || [];
    const filtered = packing.filter((p) => p._id !== id);
    saveToStorage(STORAGE_KEYS.packing, filtered);
    return { data: { success: true } };
  },

  // Notes
  getNotes: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const notes = getFromStorage(STORAGE_KEYS.notes) || [];
    return { data: { data: notes } };
  },

  createNote: async (noteData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const notes = getFromStorage(STORAGE_KEYS.notes) || [];
    const newNote = {
      _id: 'note' + Date.now(),
      ...noteData,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    saveToStorage(STORAGE_KEYS.notes, notes);
    return { data: { data: newNote } };
  },

  updateNote: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const notes = getFromStorage(STORAGE_KEYS.notes) || [];
    const index = notes.findIndex((n) => n._id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates };
      saveToStorage(STORAGE_KEYS.notes, notes);
    }
    return { data: { data: notes[index] } };
  },

  deleteNote: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const notes = getFromStorage(STORAGE_KEYS.notes) || [];
    const filtered = notes.filter((n) => n._id !== id);
    saveToStorage(STORAGE_KEYS.notes, filtered);
    return { data: { success: true } };
  },

  // Cities
  getCities: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cities = getFromStorage(STORAGE_KEYS.cities) || [];
    return { data: { data: cities } };
  },
};

// Initialize mock data on load
initializeMockData();

export default mockApi;
