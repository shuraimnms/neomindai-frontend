import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assignmentAPI } from '../../services/api'

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await assignmentAPI.admin.list()
      setAssignments(res.data.data.assignments || res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete assignment?')) return
    try {
      await assignmentAPI.admin.delete(id)
      load()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <div className="space-x-2">
          <button onClick={() => navigate('/admin/assignments/create')} className="px-4 py-2 bg-primary-600 text-white rounded-xl">Create</button>
        </div>
      </div>

      <div className="grid gap-4">
        {assignments.length === 0 && <p className="text-gray-400">No assignments yet.</p>}
        {assignments.map(a => (
          <div key={a.id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-400">Due: {new Date(a.due_date).toLocaleString()}</p>
            </div>
            <div className="space-x-2">
              <Link to={`/admin/assignments/${a.id}`} className="px-3 py-1 bg-white/5 rounded-md">View</Link>
              <button onClick={() => navigate(`/admin/assignments/${a.id}?edit=true`)} className="px-3 py-1 bg-white/5 rounded-md">Edit</button>
              <button onClick={() => handleDelete(a.id)} className="px-3 py-1 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageAssignments
