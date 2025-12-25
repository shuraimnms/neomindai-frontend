import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { assignmentAPI, adminAPI } from '../../services/api'
import AssignmentBuilder from '../../components/admin/AssignmentBuilder'
import { FaPlus, FaEdit, FaArrowLeft, FaClipboardList, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const CreateEditAssignment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEdit = searchParams.get('edit') === 'true'

  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'draft',
    questions: [],
    recipients: []
  })

  useEffect(() => {
    loadStudents()
    if (isEdit && id) {
      loadAssignment()
    }
  }, [id, isEdit])

  const loadStudents = async () => {
    try {
      const res = await adminAPI.getStudents({ limit: 1000 })
      setStudents(res.data.data.students || [])
    } catch (err) {
      console.error('Failed to load students:', err)
    }
  }

  const loadAssignment = async () => {
    try {
      setLoading(true)
      const res = await assignmentAPI.admin.getById(id)
      const data = res.data.data.assignment
      setAssignment({
        title: data.title || '',
        description: data.description || '',
        due_date: data.due_date ? new Date(data.due_date).toISOString().slice(0, 16) : '',
        status: data.status || 'draft',
        questions: data.questions || [],
        recipients: data.recipients?.map(r => r.student_id) || []
      })
    } catch (err) {
      console.error('Failed to load assignment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (assignmentData) => {
    try {
      setLoading(true)
      const payload = {
        title: assignmentData.title,
        description: assignmentData.description,
        due_date: assignmentData.due_date,
        status: assignmentData.status,
        questions: assignmentData.questions,
        recipients: assignmentData.recipients
      }

      if (isEdit) {
        await assignmentAPI.admin.update(id, payload)
      } else {
        await assignmentAPI.admin.create(payload)
      }

      navigate('/admin/assignments')
    } catch (err) {
      console.error('Failed to save assignment:', err)
      alert('Failed to save assignment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/assignments"
                className="flex items-center space-x-2 px-4 py-2 glass-card rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <FaArrowLeft className="text-primary-400" />
                <span>Back to Assignments</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3 px-6 py-3 glass-card rounded-xl">
              <div className="flex items-center space-x-2">
                <FaClipboardList className="text-primary-400 text-xl" />
                <span className="text-sm font-medium">
                  {isEdit ? 'Edit Mode' : 'Create Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl">
                {isEdit ? (
                  <FaEdit className="text-2xl text-white" />
                ) : (
                  <FaPlus className="text-2xl text-white" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  {isEdit ? 'Edit Assignment' : 'Create Assignment'}
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  {isEdit
                    ? 'Update assignment details and questions'
                    : 'Design engaging assignments for your students'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <FaUsers className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-white">{students.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <FaClipboardList className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Questions</p>
                  <p className="text-2xl font-bold text-white">{assignment.questions?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <FaClock className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Due Date</p>
                  <p className="text-lg font-bold text-white">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleDateString()
                      : 'Not set'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Builder */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <AssignmentBuilder
            initialData={assignment}
            students={students}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit={isEdit}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <FaCheckCircle className="text-green-400" />
            <span>All changes are automatically saved</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEditAssignment
