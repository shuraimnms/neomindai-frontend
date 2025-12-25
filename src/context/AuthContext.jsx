import { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

// Create and export AuthContext
export const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser))
          
          // Verify token with server
          const response = await authAPI.getCurrentUser()
          setUser(response.data.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.data.user))
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = async (email, password, isAdmin = false) => {
    try {
      setError(null)
      const response = isAdmin 
        ? await authAPI.adminLogin({ email, password })
        : await authAPI.login({ email, password })
      
      const { user, token } = response.data.data
      
      // Store token and user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null)
      const response = await authAPI.register({ name, email, password })
      
      const { user, token } = response.data.data
      
      // Store token and user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      window.location.href = '/login'
    }
  }

  // Update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}