import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaUser, FaLock, FaGraduationCap, FaUserShield } from 'react-icons/fa'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await login(formData.email, formData.password, isAdminLogin)
    
    if (result.success) {
      navigate(isAdminLogin ? '/admin/dashboard' : '/dashboard')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl mb-4">
            <FaGraduationCap className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Academy MVP
          </h1>
          <p className="text-gray-400">
            {isAdminLogin ? 'Admin Portal' : 'Student Learning Platform'}
          </p>
        </div>

        <GlassCard>
          {/* Login Type Toggle */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                !isAdminLogin
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaUser />
              <span>Student Login</span>
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                isAdminLogin
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaUserShield />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  @
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="student@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login to {isAdminLogin ? 'Admin' : 'Student'} Portal</span>
                  <FaUser />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-800/50 rounded-xl">
            <h4 className="text-sm font-medium mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Student: student@test.com / password123</p>
              <p>Admin: admin@academy.com / Admin@123</p>
            </div>
          </div>

          {/* Signup Link */}
          {!isAdminLogin && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-300"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          )}
        </GlassCard>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Academy MVP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login