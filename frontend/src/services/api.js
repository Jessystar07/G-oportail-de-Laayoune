// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic CRUD service creator
export const createCrudService = (endpoint) => ({
  getAll: () => apiClient.get(`/${endpoint}/`),
  getById: (id) => apiClient.get(`/${endpoint}/${id}/`),
  create: (data) => apiClient.post(`/${endpoint}/`, data),
  update: (id, data) => apiClient.put(`/${endpoint}/${id}/`, data),
  delete: (id) => apiClient.delete(`/${endpoint}/${id}/`),
});

// Add default export
export default apiClient;