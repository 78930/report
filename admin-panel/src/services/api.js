import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const adminAPI = {
  login: (email, password) => API.post('/auth/admin-login', { email, password }),
  getDashboard: () => API.get('/admin/dashboard'),
  getIssues: (params) => API.get('/admin/issues', { params }),
  updateStatus: (id, data) => API.put(`/admin/issues/${id}/status`, data),
  assignIssue: (id, data) => API.put(`/admin/issues/${id}/assign`, data),
  getUsers: (params) => API.get('/admin/users', { params }),
  createOfficer: (data) => API.post('/admin/users/officer', data),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
  getDepartments: () => API.get('/admin/departments'),
  createDepartment: (data) => API.post('/admin/departments', data),
  getMetrics: () => API.get('/issues/metrics'),
};

export default API;
