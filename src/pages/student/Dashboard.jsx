import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaVideo, 
  FaBookOpen, 
  FaClock, 
  FaChartLine, 
  FaPlayCircle,
  FaFire,
  FaStar,
  FaCalendarAlt
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { studentAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import StatsCard from '../../components/common/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import VideoCard from '../../components/common/VideoCard'
import { formatDate } from '../../utils/helpers'
import ChatBot from '../../components/common/ChatBot'

const StudentDashboard = () => {
  const { user } = useAuth()
  const { data, loading, error, callApi, setData } = useApi()
  const [recentVideos, setRecentVideos] = useState([])
  const [streakDays, setStreakDays] = useState(0)
  const [recentActivity, setRecentActivity] = useState([])

  // Friendly relative time helper (e.g., '2 hours ago')
  const timeAgo = (iso) => {
    if (!iso) return 'Unknown time'
    const now = new Date()
    const then = new Date(iso)
    const diff = Math.floor((now - then) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const badgeClassForType = (type) => {
    const t = (type || '').toLowerCase()
    if (t.includes('complete') || t.includes('completed')) return 'bg-green-500/20 text-green-300'
    if (t.includes('watch') || t.includes('watched') || t.includes('play')) return 'bg-primary-500/20 text-primary-300'
    return 'bg-dark-700 text-gray-300'
  }

  const labelForType = (type) => {
    const t = (type || '').toLowerCase()
    if (t.includes('complete')) return 'Completed'
    if (t.includes('watch') || t.includes('play')) return 'Watched'
    if (t.includes('quiz')) return 'Quiz'
    return t.charAt(0).toUpperCase() + (t.slice(1) || 'Action')
  }

  useEffect(() => {
    // Fetch dashboard data
    callApi(() => studentAPI.getDashboard(), null)
    
    // Fetch recent videos
    fetchRecentVideos()
  }, [])

  // Poll dashboard for realtime updates (does not toggle global loading)
  useEffect(() => {
    let mounted = true
    const fetchRealtime = async () => {
      try {
        const res = await studentAPI.getDashboard()
        if (!mounted) return
        // update useApi data store without toggling loading
        setData(res.data.data)
      } catch (err) {
        // ignore polling errors
      }
    }

    const interval = setInterval(fetchRealtime, 15000) // 15s
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [setData])

  const fetchRecentVideos = async () => {
    try {
      const response = await studentAPI.getVideos()
      setRecentVideos(response.data.data.videos.slice(0, 4))
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    }
  }

  // Derive streak and recent activity from dashboard data
  useEffect(() => {
    if (!data) return

    // recentActivity available from backend in common shapes
    const activityCandidates = data.recentActivity || data.activities || data.recentActivities || data.activity || data.events || []

    // Normalize recentActivity array
    const normalized = Array.isArray(activityCandidates) ? activityCandidates : []

    // Helper to extract ISO date string from various fields
    const extractDate = (item) => {
      const candidates = [item.date, item.createdAt, item.timestamp, item.time, item.at]
      for (const c of candidates) {
        if (!c) continue
        try {
          const d = new Date(c)
          if (!isNaN(d)) return d.toISOString()
        } catch (e) {}
      }
      return null
    }

    // Build a set of unique YYYY-MM-DD days the user was active
    const daySet = new Set()
    normalized.forEach((it) => {
      const iso = extractDate(it)
      if (iso) {
        const day = iso.slice(0, 10)
        daySet.add(day)
      }
    })

    // If backend provides a direct streak number, prefer it
    if (data.streakDays || data.streak || data.currentStreak) {
      setStreakDays(data.streakDays || data.streak || data.currentStreak)
    } else {
      // Compute consecutive days up to today
      const today = new Date()
      let count = 0
      for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        if (daySet.has(key)) {
          count += 1
        } else {
          break
        }
      }
      setStreakDays(count)
    }

    // Prepare a sorted recent activity list (most recent first)
    const sorted = normalized
      .map((it) => {
        const iso = extractDate(it)
        return {
          id: it.id || it._id || iso || Math.random().toString(36).slice(2, 9),
          title: it.title || it.name || it.videoTitle || it.action || 'Activity',
          time: iso || null,
          type: it.type || it.status || it.activityType || 'action',
        }
      })
      .filter((x) => x.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))

    setRecentActivity(sorted.slice(0, 8))
  }, [data])

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard>
          <div className="text-center p-8">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => callApi(() => studentAPI.getDashboard(), null)}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    )
  }

  const dashboardData = data || {
    user: user,
    stats: {
      totalVideos: 0,
      totalWatched: 0,
      completionRate: 0
    },
    greeting: `Welcome back, ${user?.name || 'Student'}!`
  }

  return (
    <>
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 via-purple-900/20 to-pink-900/20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {dashboardData.greeting} 👋
                </h1>
                <p className="text-gray-400">
                  Ready to continue your learning journey? Here's your progress overview.
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                    Student Account
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    Active
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
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
          title="Total Videos"
          value={dashboardData.stats.totalVideos}
          icon={FaVideo}
          color="bg-blue-500/20 text-blue-300"
          change={12}
        />
        
        <StatsCard
          title="Videos Watched"
          value={dashboardData.stats.totalWatched}
          icon={FaPlayCircle}
          color="bg-green-500/20 text-green-300"
          change={8}
        />
        
        <StatsCard
          title="Completion Rate"
          value={`${dashboardData.stats.completionRate}%`}
          icon={FaChartLine}
          color="bg-purple-500/20 text-purple-300"
          change={15}
        />
        
        <StatsCard
          title="Learning Hours"
          value="24.5"
          icon={FaClock}
          color="bg-yellow-500/20 text-yellow-300"
          change={5}
        />
      </motion.div>

      {/* Recent Videos & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Recent Videos</h2>
                <p className="text-gray-400">Continue where you left off</p>
              </div>
              <Link
                to="/videos"
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors duration-300"
              >
                View All
              </Link>
            </div>

            {recentVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentVideos.map((video, index) => (
                  <VideoCard key={video.id || index} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaVideo className="text-4xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Videos Yet</h3>
                <p className="text-gray-400 mb-4">
                  Videos will appear here once added by admin
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Quick Actions & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/videos"
                className="flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FaPlayCircle className="text-blue-300" />
                  </div>
                  <div>
                    <div className="font-medium">Watch Videos</div>
                    <div className="text-sm text-gray-400">Browse all courses</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  →
                </div>
              </Link>

              <button className="w-full flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300 group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaBookOpen className="text-purple-300" />
                  </div>
                  <div>
                    <div className="font-medium">Learning Path</div>
                    <div className="text-sm text-gray-400">View your progress</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white">→</div>
              </button>

              <Link
                to="/profile"
                className="flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-700 rounded-xl transition-colors duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaStar className="text-green-300" />
                  </div>
                  <div>
                    <div className="font-medium">Profile</div>
                    <div className="text-sm text-gray-400">Update your details</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white">→</div>
              </Link>
            </div>
          </GlassCard>

          {/* Learning Streak */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Learning Streak</h3>
              <FaFire className="text-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{streakDays} {streakDays === 1 ? 'day' : 'days'}</div>
              <p className="text-gray-400">{streakDays > 0 ? "Keep going! You're on fire! 🔥" : 'Start learning today to build your streak.'}</p>
              <div className="flex justify-center space-x-1 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full ${
                      day <= Math.min(streakDays, 7) ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-dark-700'
                    }`}
                    title={`Day ${day}`}
                  />
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Upcoming Schedule */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <FaCalendarAlt className="text-primary-300" />
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                    <div>
                      <div className="font-medium">{act.title}</div>
                      <div className="text-sm text-gray-400">{timeAgo(act.time)}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${badgeClassForType(act.type)}`}>
                      {labelForType(act.type)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-6">No recent activity</div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Welcome Message for New Users */}
      {dashboardData.stats.totalVideos === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="bg-gradient-to-r from-primary-900/20 to-purple-900/20 border-primary-500/30">
            <div className="text-center py-8">
              <FaStar className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Welcome to Academy MVP! 🎉</h3>
              <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                You're all set to start your learning journey. The admin will add videos soon.
                In the meantime, explore the platform and update your profile.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link
                  to="/profile"
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                >
                  Complete Your Profile
                </Link>
                <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl border border-white/10 transition-colors duration-300">
                  Take a Tour
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
    <ChatBot />
    </>
  )
}

export default StudentDashboard