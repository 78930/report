import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp, name) => api.post('/auth/verify-otp', { phone, otp, name }),
  completeRegistration: (data) => api.post('/auth/register-complete', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

// ISSUES
export const issueAPI = {
  create: (formData) =>
    api.post('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  getAll: (params) => api.get('/issues', { params }),
  getMine: (params) => api.get('/issues/my', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  getByTicket: (ticketId) => api.get(`/issues/ticket/${ticketId}`),
  upvote: (id) => api.post(`/issues/${id}/upvote`),
  addComment: (id, text) => api.post(`/issues/${id}/comment`, { text }),
  submitFeedback: (id, rating, comment) => api.post(`/issues/${id}/feedback`, { rating, comment }),
  getMetrics: () => api.get('/issues/metrics'),
};

export default api;
