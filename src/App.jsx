import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentVideos from './pages/student/Videos'
import StudentProfile from './pages/student/Profile'
import StudentLibrary from './pages/student/Library'
// Student assignments removed

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageVideos from './pages/admin/ManageVideos'
import AdminLibrary from './pages/admin/Library'
import ManageAssignments from './pages/admin/ManageAssignments'
import CreateEditAssignment from './pages/admin/CreateEditAssignment'

// Common Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/videos" element={<StudentVideos />} />
                <Route path="/library" element={<StudentLibrary />} />
                <Route path="/profile" element={<StudentProfile />} />
                {/* Student assignments routes removed */}
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/videos" element={<ManageVideos />} />
                <Route path="/admin/library" element={<AdminLibrary />} />
                <Route path="/admin/assignments" element={<ManageAssignments />} />
                <Route path="/admin/assignments/create" element={<CreateEditAssignment />} />
                <Route path="/admin/assignments/:id" element={<CreateEditAssignment />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e293b',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e293b',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  )
}

export default App
