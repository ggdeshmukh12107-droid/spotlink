import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});

// Inject token on every request using standard token key
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Handle 401 globally (Redirect on protected route failures, allow credentials errors to output toasts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Named exports as requested
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);
export const searchParking = (filters) => api.get('/api/parking', { params: filters });
export const getParkingById = (id) => api.get(`/api/parking/${id}`);
export const createBooking = (data) => api.post('/api/bookings', data);
export const getMyBookings = () => api.get('/api/bookings/my-bookings');
export const cancelBooking = (id) => api.put(`/api/bookings/${id}/cancel`);
export const registerGuest = (data) => api.post('/api/guest-parking', data);
export const verifyGuestCode = (code) => api.post('/api/guest-parking/verify', { verificationCode: code });

// Additional named exports to fully wire all dashboard functionalities
export const getOwnerBookings = () => api.get('/api/bookings/owner-bookings');
export const getMySpaces = () => api.get('/api/parking/my-spaces');
export const createParkingSpace = (data) => api.post('/api/parking', data);
export const getMyGuests = () => api.get('/api/guest-parking/mine');

export default api;
