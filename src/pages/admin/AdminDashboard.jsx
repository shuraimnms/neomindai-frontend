import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaUsers, 
  FaVideo, 
  FaChartLine, 
  FaCalendarAlt,
  FaUserCheck,
  FaUserTimes,
  FaGraduationCap,
  FaClock,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'
import { useApi } from '../../hooks/useApi'
import { adminAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import StatsCard from '../../components/common/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ChatBot from '../../components/common/ChatBot'

const AdminDashboard = () => {
  const { data, loading, error, callApi } = useApi()
  const [recentActivity, setRecentActivity] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
    fetchRecentActivity()
  }, [])

  const fetchDashboardData = async () => {
    await callApi(() => adminAPI.getDashboard(), null)
  }

  const fetchRecentActivity = async () => {
    try {
      // Simulated recent activity data
      setRecentActivity([
        { id: 1, type: 'new_student', user: 'John Doe', time: '10 minutes ago', icon: '👤' },
        { id: 2, type: 'video_added', user: 'Physics Tutorial', time: '1 hour ago', icon: '🎬' },
        { id: 3, type: 'student_active', user: 'Alice Johnson', time: '2 hours ago', icon: '✅' },
        { id: 4, type: 'video_updated', user: 'Math Basics', time: '3 hours ago', icon: '📝' },
      ])
    } catch (error) {
      console.error('Failed to fetch activity:', error)
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const dashboardData = data?.stats || {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalVideos: 0,
    recentStudents: 0
  }

  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Overview of academy performance and management
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    Administrator
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    Full Access
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FaGraduationCap className="text-4xl md:text-5xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Students"
          value={dashboardData.totalStudents}
          icon={FaUsers}
          color="bg-blue-500/20 text-blue-300"
          change={12}
        />
        
        <StatsCard
          title="Active Students"
          value={dashboardData.activeStudents}
          icon={FaUserCheck}
          color="bg-green-500/20 text-green-300"
          change={8}
        />
        
        <StatsCard
          title="Inactive Students"
          value={dashboardData.inactiveStudents}
          icon={FaUserTimes}
          color="bg-red-500/20 text-red-300"
          change={-3}
        />
        
        <StatsCard
          title="Total Videos"
          value={dashboardData.totalVideos}
          icon={FaVideo}
          color="bg-purple-500/20 text-purple-300"
          change={5}
        />
      </motion.div>

      {/* Charts & Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Student Growth</h2>
                <p className="text-gray-400">Monthly student registration trends</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-400 text-sm">
                  <FaArrowUp className="mr-1" />
                  <span>+{dashboardData.recentStudents} this week</span>
                </div>
              </div>
            </div>

            {/* Simplified Chart */}
            <div className="h-64 flex items-end space-x-4 pt-8">
              {[40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, dashboardData.totalStudents].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${Math.min(value / 3, 100)}%` }}
                    title={`${value} students`}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Recent Activity</h2>
                <p className="text-gray-400">Latest platform actions</p>
              </div>
              <FaClock className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700 transition-colors duration-300"
                >
                  <div className="text-2xl mr-3">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-gray-400 capitalize">
                      {activity.type.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 p-3 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors duration-300">
              View All Activity
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{dashboardData.recentStudents}</div>
              <div className="text-gray-400">New Students (7 days)</div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <FaChartLine className="text-green-300 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <FaArrowUp className="mr-1" />
            <span>+12% from last week</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">85%</div>
              <div className="text-gray-400">Active Rate</div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FaUserCheck className="text-blue-300 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <FaArrowUp className="mr-1" />
            <span>+5% from last month</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-gray-400">Avg. Watch Time</div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FaVideo className="text-purple-300 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-400 text-sm">
            <FaArrowDown className="mr-1" />
            <span>-2% from last week</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <GlassCard>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/students')}
              className="p-6 bg-dark-800/50 hover:bg-blue-500/20 rounded-xl transition-all duration-300 group text-left"
            >
              <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <FaUsers className="text-blue-300 text-xl" />
              </div>
              <div className="font-medium mb-1">Manage Students</div>
              <div className="text-sm text-gray-400">View and manage all students</div>
            </button>

            <button
              onClick={() => navigate('/admin/videos')}
              className="p-6 bg-dark-800/50 hover:bg-purple-500/20 rounded-xl transition-all duration-300 group text-left"
            >
              <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <FaVideo className="text-purple-300 text-xl" />
              </div>
              <div className="font-medium mb-1">Manage Videos</div>
              <div className="text-sm text-gray-400">Add and edit video content</div>
            </button>

            <button className="p-6 bg-dark-800/50 hover:bg-green-500/20 rounded-xl transition-all duration-300 group text-left">
              <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <FaChartLine className="text-green-300 text-xl" />
              </div>
              <div className="font-medium mb-1">View Analytics</div>
              <div className="text-sm text-gray-400">Detailed platform analytics</div>
            </button>

            <button className="p-6 bg-dark-800/50 hover:bg-red-500/20 rounded-xl transition-all duration-300 group text-left">
              <div className="p-3 bg-red-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <FaCalendarAlt className="text-red-300 text-xl" />
              </div>
              <div className="font-medium mb-1">Schedule</div>
              <div className="text-sm text-gray-400">Manage upcoming events</div>
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="border-red-500/30">
            <div className="text-center py-8">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Failed to Load Dashboard</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
    <ChatBot />
    </>
  )
}

export default AdminDashboard