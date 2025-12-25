// ============================================
// Helper Functions
// ============================================

// Validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 100
}

// Form helpers
export const handleFormChange = (e, setFormData) => {
  const { name, value, type, checked } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }))
}

// Local storage helpers
export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

export const setToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

// URL helpers
export const getVideoThumbnail = (url) => {
  if (!url) return null
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }
  return null
}

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Duration format (if needed)
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Class name merger
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}