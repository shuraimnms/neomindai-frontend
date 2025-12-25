import { FaGraduationCap, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { APP_NAME } from '../../utils/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/10 bg-dark-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">{APP_NAME}</h2>
                <p className="text-sm text-gray-400">Modern Learning Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering students with cutting-edge educational technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Dashboard</a></li>
              <li><a href="/videos" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Videos</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Profile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">About Us</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-300 transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-dark-800 hover:bg-primary-600 rounded-xl transition-colors duration-300">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="p-2 bg-dark-800 hover:bg-blue-500 rounded-xl transition-colors duration-300">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="p-2 bg-dark-800 hover:bg-blue-700 rounded-xl transition-colors duration-300">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 bg-dark-800 border border-white/10 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-r-xl hover:shadow-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with ❤️ for modern education
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer