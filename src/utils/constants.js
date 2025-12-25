// App constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Academy MVP'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  VIDEOS: '/videos',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_VIDEOS: '/admin/videos',
}

// Video platforms
export const VIDEO_PLATFORMS = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  CLOUDINARY: 'cloudinary',
  OTHER: 'other',
}

// Status colors
export const STATUS_COLORS = {
  ACTIVE: 'bg-green-500/20 text-green-300',
  INACTIVE: 'bg-red-500/20 text-red-300',
  PENDING: 'bg-yellow-500/20 text-yellow-300',
}

// Duration format
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Date format
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}