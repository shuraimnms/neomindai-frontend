import { FaPlay, FaClock, FaCalendar } from 'react-icons/fa'
import { getVideoThumbnail } from '../../utils/helpers'
import GlassCard from './GlassCard'

const VideoCard = ({ video, onClick }) => {
  // Get thumbnail URL
  const thumbnail = getVideoThumbnail(video.video_url) || video.thumbnail_url
  
  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <GlassCard
      hover
      onClick={onClick}
      className="cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <div className="aspect-video bg-gradient-to-br from-primary-900/50 to-purple-900/50 flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/320x180/1e293b/94a3b8?text=No+Thumbnail'
              }}
            />
          ) : (
            <FaPlay className="text-4xl text-white/50" />
          )}
        </div>
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
            <FaPlay className="text-2xl text-white" />
          </div>
        </div>
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-lg text-xs flex items-center space-x-1">
            <FaClock className="text-xs" />
            <span>{video.duration}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-300 transition-colors duration-300">
          {video.title}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-2">
          {video.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <FaCalendar />
            <span>{formatDate(video.created_at)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

export default VideoCard