import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaExpand, FaCompress, FaStepForward, FaStepBackward } from 'react-icons/fa'

const VideoPlayer = ({ videoUrl, title, onClose }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    
    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        onClick={togglePlay}
      />
      
      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isPlaying ? (
                <FaPause className="text-xl" />
              ) : (
                <FaPlay className="text-xl" />
              )}
            </button>

            {/* Skip Backward */}
            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaStepBackward className="text-lg" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaStepForward className="text-lg" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <FaVolumeUp />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => {
                setPlaybackRate(parseFloat(e.target.value))
                videoRef.current.playbackRate = parseFloat(e.target.value)
              }}
              className="bg-dark-800 border border-white/10 rounded px-2 py-1 text-sm"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isFullscreen ? (
                <FaCompress className="text-lg" />
              ) : (
                <FaExpand className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <div className="w-20 h-20 bg-primary-500/80 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
            <FaPlay className="text-3xl ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}

export default VideoPlayer