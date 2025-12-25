import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaPlay, 
  FaClock, 
  FaCalendar,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa'
import { useApi } from '../../hooks/useApi'
import { videoAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import VideoCard from '../../components/common/VideoCard'
import { formatDate } from '../../utils/helpers'

const StudentVideos = () => {
  const { data, loading, error, callApi } = useApi()
  const [videos, setVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const result = await callApi(() => videoAPI.getAll(), null)
    if (result.success) {
      setVideos(result.data.videos)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (sortType) => {
    setSortBy(sortType)
    let sortedVideos = [...videos]
    
    switch (sortType) {
      case 'newest':
        sortedVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        sortedVideos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'title-asc':
        sortedVideos.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sortedVideos.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }
    
    setVideos(sortedVideos)
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    // Add more filter logic here when we have more metadata
    return matchesSearch
  })

  const handleVideoClick = (video) => {
    setSelectedVideo(video)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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
                Recorded Classes
              </h1>
              <p className="text-gray-400">
                Access all recorded lectures anytime, anywhere. Learn at your own pace.
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <div className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                  {videos.length} Videos Available
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  Unlimited Access
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <FaPlay className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GlassCard>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search videos by title or description..."
                  className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                {sortBy.includes('desc') ? <FaSortAmountDown /> : <FaSortAmountUp />}
              </div>
            </div>

            {/* Filter Button */}
            <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-300">
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>

          {/* Active filters display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <div className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-xs"
                >
                  ×
                </button>
              </div>
            )}
            <div className="px-3 py-1 bg-dark-700 rounded-full text-sm">
              Sort: {sortBy.replace('-', ' ')}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Videos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error ? (
          <GlassCard>
            <div className="text-center py-12">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Failed to Load Videos</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchVideos}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </GlassCard>
        ) : filteredVideos.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                All Videos ({filteredVideos.length})
              </h2>
              <div className="text-gray-400">
                Showing {filteredVideos.length} of {videos.length} videos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <VideoCard
                      video={video}
                      onClick={() => handleVideoClick(video)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <GlassCard>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-2">No Videos Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? `No videos match your search for "${searchTerm}". Try a different search term.`
                  : 'No videos have been added yet. Check back soon!'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Added on {formatDate(selectedVideo.created_at)}
                  </p>
                </div>
                <button
                  onClick={closeVideoModal}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              {/* Video Player */}
              <div className="p-6">
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                  <iframe
                    src={selectedVideo.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FaClock />
                        <span>{selectedVideo.duration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FaCalendar />
                        <span>{formatDate(selectedVideo.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-300">
                      {selectedVideo.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end space-x-4">
                <button
                  onClick={closeVideoModal}
                  className="px-6 py-2 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors duration-300"
                >
                  Close
                </button>
                <a
                  href={selectedVideo.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 btn-primary"
                >
                  Watch on YouTube
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Help */}
      {videos.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">Content Coming Soon!</h3>
              <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                Our admin is working hard to add high-quality educational videos.
                You'll be notified as soon as new content is available.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                  onClick={fetchVideos}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                >
                  Refresh Page
                </button>
                <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 rounded-xl border border-white/10 transition-colors duration-300">
                  Request Content
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

export default StudentVideos