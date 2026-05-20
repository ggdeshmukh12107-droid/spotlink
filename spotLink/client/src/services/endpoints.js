import * as apiService from './api';

export const authService = {
  register: apiService.register,
  login: apiService.login,
  getMe: () => apiService.default.get('/api/auth/me'),
  updateProfile: (data) => apiService.default.put('/api/auth/profile', data),
};

export const parkingService = {
  getAll: apiService.searchParking,
  getById: apiService.getParkingById,
  create: apiService.createParkingSpace,
  update: (id, data) => apiService.default.put(`/api/parking/${id}`, data),
  delete: (id) => apiService.default.delete(`/api/parking/${id}`),
  getMySpaces: apiService.getMySpaces,
  getOwnerSpaces: apiService.getMySpaces,
};

export const bookingService = {
  create: apiService.createBooking,
  getMyBookings: apiService.getMyBookings,
  getById: (id) => apiService.default.get(`/api/bookings/${id}`),
  cancel: apiService.cancelBooking,
  complete: (id) => apiService.default.put(`/api/bookings/${id}/complete`),
  vacateAlert: (id, data) => apiService.default.put(`/api/bookings/${id}/vacate-alert`, data),
  getOwnerBookings: apiService.getOwnerBookings,
};

export const guestParkingService = {
  register: apiService.registerGuest,
  verify: (data) => apiService.verifyGuestCode(data.code || data.verificationCode),
  getSocietyGuests: (societyId) => apiService.default.get(`/api/guest-parking/society/${societyId}`),
  updateStatus: (id, data) => apiService.default.put(`/api/guest-parking/${id}/status`, data),
  reportViolation: (id, data) => apiService.default.post(`/api/guest-parking/${id}/violation`, data),
  getMyGuests: apiService.getMyGuests,
};

export const societyService = {
  getAll: () => apiService.default.get('/api/societies'),
  getById: (id) => apiService.default.get(`/api/societies/${id}`),
  create: (data) => apiService.default.post('/api/societies', data),
  update: (id, data) => apiService.default.put(`/api/societies/${id}`, data),
  join: (id) => apiService.default.post(`/api/societies/${id}/join`),
};
