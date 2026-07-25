import axios from 'axios';

// Points at the Django backend. Override via a .env file at the project
// root with VITE_API_BASE_URL=http://your-host:8000/api if you're not
// running both on localhost during development.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mi-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refreshes the access token once on a 401, then retries the original
// request. If the refresh itself fails (refresh token expired too), the
// user is logged out and sent back to login.
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('mi-refresh-token');

      if (!refreshToken) {
        localStorage.removeItem('mi-user');
        localStorage.removeItem('mi-token');
        localStorage.removeItem('mi-refresh-token');
        window.location.href = '/login';
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh: refreshToken });
        localStorage.setItem('mi-token', data.access);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('mi-user');
        localStorage.removeItem('mi-token');
        localStorage.removeItem('mi-refresh-token');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  signup: (payload) => api.post('/auth/signup/', payload),
  me: () => api.get('/auth/me/'),
  changePassword: (oldPassword, newPassword) =>
    api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
};

export const shipmentService = {
  getAll: (params) => api.get('/shipments/', { params }),
  getById: (id) => api.get(`/shipments/${id}/`),
  trackByNumber: (trackingNumber) => api.get(`/shipments/by-tracking-number/${trackingNumber}/`),
  create: (data) => api.post('/shipments/', data),
  update: (id, data) => api.patch(`/shipments/${id}/`, data),
  delete: (id) => api.delete(`/shipments/${id}/`),
  addEvent: (id, eventData) => api.post(`/shipments/${id}/add_event/`, eventData),
};

// Public tracker — no auth required, used by a customer-facing tracking
// page. The authenticated dashboard's Tracking page uses shipmentService
// instead, since it needs the fuller (internal) shipment detail shape.
export const publicTrackingService = {
  track: (trackingNumber) => axios.get(`${BASE_URL}/track/${trackingNumber}/`),
};

export const customerService = {
  getAll: (params) => api.get('/customers/', { params }),
  getById: (code) => api.get(`/customers/${code}/`),
  create: (data) => api.post('/customers/', data),
  update: (code, data) => api.patch(`/customers/${code}/`, data),
  delete: (code) => api.delete(`/customers/${code}/`),
};

export const staffService = {
  getAll: (params) => api.get('/staff/', { params }),
  getById: (code) => api.get(`/staff/${code}/`),
  create: (data) => api.post('/staff/', data),
  update: (code, data) => api.patch(`/staff/${code}/`, data),
  delete: (code) => api.delete(`/staff/${code}/`),
};

export const notificationService = {
  getAll: () => api.get('/notifications/'),
  markRead: (id) => api.post(`/notifications/${id}/mark_read/`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats/'),
};

export default api;
