import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaGraduationCap, FaUser, FaVideo, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaClipboardList } from 'react-icons/fa'
import { HiUserGroup, HiVideoCamera } from 'react-icons/hi'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/videos', label: 'Videos', icon: <FaVideo /> },
    { to: '/assignments', label: 'Assignments', icon: <FaClipboardList /> },
    { to: '/library', label: 'Library', icon: <FaGraduationCap /> },
    { to: '/profile', label: 'Profile', icon: <FaUser /> },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/students', label: 'Students', icon: <HiUserGroup /> },
    { to: '/admin/videos', label: 'Videos', icon: <HiVideoCamera /> },
    { to: '/admin/assignments', label: 'Assignments', icon: <FaClipboardList /> },
    { to: '/admin/library', label: 'Library', icon: <FaGraduationCap /> },
  ]

  const links = user?.role === 'admin' ? adminLinks : studentLinks

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl">
              <FaGraduationCap className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Academy MVP</h1>
              <p className="text-xs text-gray-400">Learn. Grow. Succeed.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      location.pathname === link.to
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl border border-primary-500 text-primary-300 hover:bg-primary-500/10 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden mt-4 glass-card rounded-xl p-4 animate-slide-up">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )  
}

export default Navbar