import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaEdit, 
  FaSave,
  FaKey,
  FaShieldAlt,
  FaGraduationCap,
  FaChartLine
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { studentAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

const StudentProfile = () => {
  const { user, updateUser } = useAuth()
  const { data, loading, error, callApi } = useApi()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const fetchProfileData = async () => {
    await callApi(() => studentAPI.getProfile(), null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      const response = await studentAPI.updateProfile({ name: formData.name })
      updateUser(response.data.data.user)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    // In a real app, you would call an API to change password
    toast.success('Password change functionality coming soon!')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const profileData = data?.user || user

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                My Profile
              </h1>
              <p className="text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-lg font-bold">{user?.name}</div>
                <div className="text-sm text-gray-400">{user?.role}</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Information */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Basic Information</h3>
                <p className="text-gray-400">Update your personal details</p>
              </div>
              <button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 ${
                  isEditing 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-primary-500/20 text-primary-300'
                }`}
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-xl">
                    <FaUser className="text-gray-400" />
                    <span>{profileData?.name || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-xl">
                  <FaEnvelope className="text-gray-400" />
                  <span>{profileData?.email || 'Not set'}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Email cannot be changed. Contact admin for email updates.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Created
                </label>
                <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-xl">
                  <FaCalendar className="text-gray-400" />
                  <span>{profileData?.created_at ? formatDate(profileData.created_at) : 'Unknown'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  User Role
                </label>
                <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-xl">
                  <FaGraduationCap className="text-gray-400" />
                  <span className="capitalize">{profileData?.role || 'student'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Status
                </label>
                <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-xl">
                  <FaShieldAlt className="text-green-300" />
                  <span className="text-green-300">Active</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Change Password */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Change Password</h3>
                <p className="text-gray-400">Update your login credentials</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <FaKey className="text-blue-300" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Enter new password"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <FaSave />
                <span>Update Password</span>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sidebar - Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Account Stats */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FaChartLine className="text-blue-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="font-medium">
                      {profileData?.created_at ? formatDate(profileData.created_at) : 'Recently'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaGraduationCap className="text-green-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Learning Level</div>
                    <div className="font-medium">Beginner</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaShieldAlt className="text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Account Status</div>
                    <div className="font-medium text-green-300">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300">
                <div className="font-medium">Download Data</div>
                <div className="text-sm text-gray-400">Export your learning data</div>
              </button>

              <button className="w-full text-left p-3 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300">
                <div className="font-medium">Privacy Settings</div>
                <div className="text-sm text-gray-400">Manage your privacy options</div>
              </button>

              <button className="w-full text-left p-3 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300">
                <div className="font-medium">Notification Preferences</div>
                <div className="text-sm text-gray-400">Customize notifications</div>
              </button>

              <button className="w-full text-left p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors duration-300">
                <div className="font-medium text-red-300">Delete Account</div>
                <div className="text-sm text-red-400/70">Permanently remove your account</div>
              </button>
            </div>
          </GlassCard>

          {/* Support */}
          <GlassCard>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-gray-400 mb-4">
                Our support team is here to help you
              </p>
              <button className="w-full btn-secondary">
                Contact Support
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Data Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Your Data is Safe With Us</h3>
              <p className="text-gray-300 text-sm">
                We use industry-standard encryption to protect your personal information.
                Read our <a href="#" className="text-primary-300">Privacy Policy</a> for details.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FaShieldAlt className="text-2xl text-green-300" />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default StudentProfile