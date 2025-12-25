import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSort,
  FaFilter,
  FaCalendar,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { useApi } from '../../hooks/useApi'
import { videoAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import VideoCard from '../../components/common/VideoCard'
import { toast } from 'react-hot-toast'
import { formatDate, getVideoThumbnail } from '../../utils/helpers'

const ManageVideos = () => {
  const { data, loading, error, callApi } = useApi()
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: '00:00'
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [videos, searchTerm])

  const fetchVideos = async () => {
    const result = await callApi(() => videoAPI.getAll(), null)
    if (result.success) {
      setVideos(result.data.videos)
    }
  }

  const filterVideos = () => {
    let filtered = [...videos]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVideos(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddVideo = async () => {
    try {
      const response = await videoAPI.create(formData)
      setVideos([response.data.data.video, ...videos])
      setShowAddModal(false)
      resetForm()
      toast.success('Video added successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add video')
    }
  }

  const handleEditVideo = async () => {
    try {
      const response = await videoAPI.update(selectedVideo.id, formData)
      setVideos(videos.map(video =>
        video.id === selectedVideo.id ? response.data.data.video : video
      ))
      setShowEditModal(false)
      setSelectedVideo(null)
      resetForm()
      toast.success('Video updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update video')
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await videoAPI.delete(videoId)
        setVideos(videos.filter(video => video.id !== videoId))
        toast.success('Video deleted successfully!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete video')
      }
    }
  }

  const handleEditClick = (video) => {
    setSelectedVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      duration: video.duration || '00:00'
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration: '00:00'
    })
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const generateThumbnail = () => {
    if (formData.video_url.includes('youtube.com') || formData.video_url.includes('youtu.be')) {
      const videoId = formData.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
      if (videoId) {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }))
        toast.success('YouTube thumbnail generated!')
      }
    }
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
                Manage Videos
              </h1>
              <p className="text-gray-400">
                Add, edit, and manage recorded class videos
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {videos.length} Videos
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Total Duration: {videos.reduce((acc, video) => acc + parseFloat(video.duration || 0), 0)}h
                </div>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add New Video</span>
            </button>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search videos by title or description..."
                  className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Button */}
            <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-300">
              <FaSort />
              <span>Sort</span>
            </button>

            {/* Filter Button */}
            <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-300">
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>

          {/* Active filters display */}
          {searchTerm && (
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Videos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading && videos.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    <VideoCard video={video} />
                    
                    {/* Admin Actions Overlay */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(video)}
                          className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </div>
                    </div>
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
                  : 'No videos have been added yet. Click "Add New Video" to get started!'}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={openAddModal}
                  className="btn-primary"
                >
                  Add Your First Video
                </button>
              )}
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Add/Edit Video Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false)
              setShowEditModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {showEditModal ? 'Edit Video' : 'Add New Video'}
                    </h3>
                    <p className="text-gray-400">
                      {showEditModal ? 'Update video details' : 'Add a new recorded class video'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter video title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field min-h-[100px] resize-none"
                      placeholder="Enter video description"
                      rows="4"
                    />
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video URL *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleInputChange}
                        className="input-field flex-grow"
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                      <button
                        onClick={generateThumbnail}
                        className="px-4 py-3 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-xl transition-colors"
                        title="Generate YouTube Thumbnail"
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Supports YouTube, Vimeo, and direct video URLs
                    </p>
                  </div>

                  {/* Thumbnail URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      name="thumbnail_url"
                      value={formData.thumbnail_url}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    {formData.thumbnail_url && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-400 mb-2">Preview:</div>
                        <div className="w-32 h-20 rounded-lg overflow-hidden">
                          <img
                            src={formData.thumbnail_url}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/320x180/1e293b/94a3b8?text=Thumbnail+Error'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="HH:MM:SS or MM:SS"
                    />
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-dark-800/50 rounded-xl">
                    <h4 className="font-medium mb-3">Preview</h4>
                    <div className="aspect-video bg-gradient-to-br from-primary-900/50 to-purple-900/50 rounded-lg flex items-center justify-center">
                      {formData.video_url ? (
                        <div className="text-center">
                          <FaEye className="text-4xl text-gray-400 mb-2 mx-auto" />
                          <p className="text-gray-300">{formData.title || 'Untitled Video'}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {formData.duration || '00:00'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-400">Enter URL to see preview</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                    <button
                      onClick={() => {
                        setShowAddModal(false)
                        setShowEditModal(false)
                      }}
                      className="px-6 py-2 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={showEditModal ? handleEditVideo : handleAddVideo}
                      className="px-6 py-2 btn-primary"
                    >
                      {showEditModal ? 'Update Video' : 'Add Video'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageVideos