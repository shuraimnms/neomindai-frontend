import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaPlay } from 'react-icons/fa'
import { useApi } from '../../hooks/useApi'
import { studentAPI } from '../../services/api'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Assignments = () => {
  const { data, loading, error, callApi } = useApi()
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      const res = await callApi(() => studentAPI.getAssignments())
      setAssignments(res.data.data.assignments || res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'overdue':
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="text-green-400" />
      case 'pending':
        return <FaClock className="text-yellow-400" />
      case 'overdue':
        return <FaExclamationTriangle className="text-red-400" />
      default:
        return <FaPlay className="text-gray-400" />
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-gray-400 mt-2">Complete your assignments and track your progress</p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="border-red-500/30">
            <div className="text-center p-6">
              <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Error Loading Assignments</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={loadAssignments}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {assignments.length === 0 && !loading ? (
          <GlassCard>
            <div className="text-center py-12">
              <FaCalendarAlt className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Assignments Yet</h3>
              <p className="text-gray-400">
                Assignments will appear here once assigned by your instructor
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <GlassCard className="hover:bg-dark-800/50 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{assignment.title}</h3>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                          <span className="capitalize">{assignment.status || 'Not Started'}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-3">{assignment.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>Created: {new Date(assignment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors duration-300 inline-flex items-center space-x-2"
                      >
                        <span>View Assignment</span>
                        <FaPlay className="text-sm" />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Assignments
