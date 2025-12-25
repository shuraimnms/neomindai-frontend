import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaUserCheck, 
  FaUserTimes,
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaUserPlus
} from 'react-icons/fa'
import { useApi } from '../../hooks/useApi'
import { adminAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/helpers'

const ManageStudents = () => {
  const { data, loading, error, callApi } = useApi()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, statusFilter])

  const fetchStudents = async () => {
    const result = await callApi(() => adminAPI.getStudents(), null)
    if (result.success) {
      setStudents(result.data.students)
    }
  }

  const filterStudents = () => {
    let filtered = [...students]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student =>
        statusFilter === 'active' ? student.is_active : !student.is_active
      )
    }

    setFilteredStudents(filtered)
  }

  const handleToggleStatus = async (studentId, currentStatus) => {
    try {
      await adminAPI.toggleStudentStatus(studentId)
      
      // Update local state
      setStudents(students.map(student =>
        student.id === studentId
          ? { ...student, is_active: !currentStatus }
          : student
      ))
      
      toast.success(`Student ${currentStatus ? 'deactivated' : 'activated'} successfully`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student status')
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      // In a real app, you would call delete API
      toast.success('Delete functionality coming soon!')
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
                Manage Students
              </h1>
              <p className="text-gray-400">
                View and manage all student accounts in the academy
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {filteredStudents.length} Students
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  {students.filter(s => s.is_active).length} Active
                </div>
                <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                  {students.filter(s => !s.is_active).length} Inactive
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <FaUserPlus className="text-3xl text-white" />
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                  statusFilter === 'all'
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'bg-dark-800 hover:bg-dark-700 text-gray-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  statusFilter === 'active'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-dark-800 hover:bg-dark-700 text-gray-400'
                }`}
              >
                <FaUserCheck />
                <span>Active</span>
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  statusFilter === 'inactive'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-dark-800 hover:bg-dark-700 text-gray-400'
                }`}
              >
                <FaUserTimes />
                <span>Inactive</span>
              </button>
            </div>

            {/* Sort Button */}
            <button className="px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-300">
              <FaSort />
              <span>Sort</span>
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
            {statusFilter !== 'all' && (
              <div className="px-3 py-1 bg-dark-700 rounded-full text-sm">
                Status: {statusFilter}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard>
          {loading && students.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Failed to Load Students</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchStudents}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : currentStudents.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-medium">Student</th>
                      <th className="text-left py-4 px-4 font-medium">Email</th>
                      <th className="text-left py-4 px-4 font-medium">Status</th>
                      <th className="text-left py-4 px-4 font-medium">Joined</th>
                      <th className="text-left py-4 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student) => (
                      <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="font-bold text-white">
                                {student.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-400">ID: {student.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-300">{student.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            student.is_active
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {student.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {student.created_at ? formatDate(student.created_at) : 'Unknown'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(student)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye className="text-blue-300" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(student.id, student.is_active)}
                              className={`p-2 rounded-lg transition-colors ${
                                student.is_active
                                  ? 'hover:bg-red-500/20'
                                  : 'hover:bg-green-500/20'
                              }`}
                              title={student.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {student.is_active ? (
                                <FaUserTimes className="text-red-300" />
                              ) : (
                                <FaUserCheck className="text-green-300" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="text-red-300" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <div className="text-gray-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-700 rounded-xl transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 rounded-xl transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-800 hover:bg-dark-700'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-700 rounded-xl transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-2">No Students Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? 'No students match your current filters. Try adjusting your search criteria.'
                  : 'No students have registered yet. Students will appear here once they sign up.'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}
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
                  <h3 className="text-2xl font-bold">Student Details</h3>
                  <p className="text-gray-400">Complete information about this student</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {selectedStudent.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{selectedStudent.name}</h4>
                    <p className="text-gray-400">{selectedStudent.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        selectedStudent.is_active
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {selectedStudent.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {selectedStudent.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Account Information</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Student ID:</span>
                        <span className="font-mono">{selectedStudent.id.substring(0, 12)}...</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Joined:</span>
                        <span>{selectedStudent.created_at ? formatDate(selectedStudent.created_at) : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Last Updated:</span>
                        <span>{selectedStudent.updated_at ? formatDate(selectedStudent.updated_at) : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Activity</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Videos Watched:</span>
                        <span className="text-green-300">0</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Completion Rate:</span>
                        <span>0%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Learning Hours:</span>
                        <span>0h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/10">
                  <h5 className="font-medium mb-4">Actions</h5>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleToggleStatus(selectedStudent.id, selectedStudent.is_active)}
                      className={`px-4 py-2 rounded-xl transition-colors ${
                        selectedStudent.is_active
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                      }`}
                    >
                      {selectedStudent.is_active ? 'Deactivate Account' : 'Activate Account'}
                    </button>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-xl transition-colors">
                      Send Message
                    </button>
                    <button className="px-4 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-xl transition-colors">
                      View Progress
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ManageStudents