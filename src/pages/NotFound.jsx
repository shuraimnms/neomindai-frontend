import { Link } from 'react-router-dom'
import { FaHome, FaGraduationCap, FaExclamationTriangle } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
          <div className="relative">
            <FaExclamationTriangle className="text-8xl text-yellow-500 mx-auto mb-4" />
            <h1 className="text-9xl font-bold gradient-text">404</h1>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for seems to have graduated early.
          It might have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/dashboard"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <FaHome />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/videos"
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <FaGraduationCap />
            <span>Browse Videos</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="p-6 glass-card">
          <h3 className="text-lg font-semibold mb-3">Here are some helpful links:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/dashboard"
              className="p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700 transition-colors duration-300"
            >
              <div className="font-medium">Dashboard</div>
              <div className="text-sm text-gray-400">Your learning hub</div>
            </Link>
            <Link
              to="/videos"
              className="p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700 transition-colors duration-300"
            >
              <div className="font-medium">Videos</div>
              <div className="text-sm text-gray-400">Recorded classes</div>
            </Link>
            <Link
              to="/profile"
              className="p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700 transition-colors duration-300"
            >
              <div className="font-medium">Profile</div>
              <div className="text-sm text-gray-400">Your account settings</div>
            </Link>
            <a
              href="#"
              className="p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700 transition-colors duration-300"
            >
              <div className="font-medium">Help Center</div>
              <div className="text-sm text-gray-400">Get support</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound