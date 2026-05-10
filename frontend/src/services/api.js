import axios from 'axios';
import mockApi from './mockApi';

// Set to true to use mock data (no backend needed)
// Set to false to use real backend
const USE_MOCK_API = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor: attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by clearing storage and redirecting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wrapper to use mock API when enabled
const apiWrapper = {
  get: async (url, config) => {
    if (USE_MOCK_API) {
      // Route to mock API methods
      if (url === '/api/auth/me') return mockApi.getMe();
      if (url === '/api/trips') return mockApi.getTrips();
      if (url === '/api/trips/stats') return mockApi.getTripStats();
      if (url.startsWith('/api/trips/')) {
        const tripId = url.split('/')[3];
        return mockApi.getTripById(tripId);
      }
    }
    return api.get(url, config);
  },
  
  post: async (url, data, config) => {
    if (USE_MOCK_API) {
      if (url === '/api/auth/login') return mockApi.login(data.email, data.password);
      if (url === '/api/auth/signup') return mockApi.register(data.name, data.email, data.password);
      if (url === '/api/trips') return mockApi.createTrip(data);
    }
    return api.post(url, data, config);
  },
  
  put: async (url, data, config) => {
    if (USE_MOCK_API) {
      if (url.startsWith('/api/trips/')) {
        const tripId = url.split('/')[3];
        return mockApi.updateTrip(tripId, data);
      }
    }
    return api.put(url, data, config);
  },
  
  delete: async (url, config) => {
    if (USE_MOCK_API) {
      if (url.startsWith('/api/trips/')) {
        const tripId = url.split('/')[3];
        return mockApi.deleteTrip(tripId);
      }
    }
    return api.delete(url, config);
  },
};

export default apiWrapper;
