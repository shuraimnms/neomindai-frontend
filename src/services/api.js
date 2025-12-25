import axios from 'axios'

// Update API_URL to use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      // Show timeout error to user
      // You could dispatch a notification here if you have a notification system
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
      // You could dispatch a server error notification here
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// Video API
export const videoAPI = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
}

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getVideos: () => api.get('/student/videos'),
  getAssignments: () => api.get('/student/assignments'),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudentDetails: (id) => api.get(`/admin/students/${id}`),
  toggleStudentStatus: (id) => api.put(`/admin/students/${id}/toggle`),
}

// Assignment API
export const assignmentAPI = {
  // Admin
  admin: {
    list: (params) => api.get('/admin/assignments', { params }),
    getById: (id) => api.get(`/admin/assignments/${id}`),
    create: (data) => api.post('/admin/assignments', data),
    update: (id, data) => api.put(`/admin/assignments/${id}`, data),
    delete: (id) => api.delete(`/admin/assignments/${id}`),
    getStats: () => api.get('/admin/assignments/stats')
  }
}

// Library APIs
export const libraryAPI = {
  // Public
  getAll: (params) => api.get('/library', { params }),
  getById: (id) => api.get(`/library/${id}`),
  download: (id) => `${API_URL}/library/${id}/download`, // returns direct URL for download/redirect

  // Admin (multipart for file upload)
  admin: {
    getAll: (params) => api.get('/admin/library', { params }),
    create: (formData) => api.post('/admin/library', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => api.put(`/admin/library/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/admin/library/${id}`),
    getById: (id) => api.get(`/admin/library/${id}`)
  }
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api