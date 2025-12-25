import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assignmentAPI } from '../../services/api'

const AssignmentDetails = () => {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)

  const load = async () => {
    try {
      const res = await assignmentAPI.student.get(id)
      setAssignment(res.data.data.assignment || res.data.data)
      setText(res.data.data.submission?.text_answer || '')
    } catch (err) { console.error(err) }
  }

  useEffect(()=>{ load() }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('text_answer', text)
      if (file) fd.append('file', file)
      await assignmentAPI.student.submit(id, fd)
      await load()
      alert('Submitted')
    } catch (err) { console.error(err) }
  }

  const handleSuggest = async () => {
    try {
      const res = await assignmentAPI.student.suggest(id, { text: text })
      if (res.data?.data?.suggested_text) {
        setText(res.data.data.suggested_text)
        alert('Suggestion applied')
      }
    } catch (err) { console.error(err); alert('Suggestion failed') }
  }

  if (!assignment) return <p>Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
      <p className="text-sm text-gray-400 mb-4">Due: {new Date(assignment.due_date).toLocaleString()}</p>
      <div className="mb-4">
        <p>{assignment.description}</p>
        {assignment.file_url && <p className="mt-2"><a href={import.meta.env.VITE_API_URL + assignment.file_url.replace('/api','')} target="_blank" rel="noreferrer" className="text-primary-300">Download attachment</a></p>}
      </div>

      <div className="glass-card p-4">
        <h3 className="font-semibold mb-2">Submit Assignment</h3>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <textarea value={text} onChange={e=>setText(e.target.value)} className="input h-32" placeholder="Your answer (text)" />
          <input type="file" onChange={e=>setFile(e.target.files[0])} accept="application/pdf,image/*" />
          <div className="flex space-x-2">
            <button type="button" onClick={handleSuggest} className="px-4 py-2 bg-yellow-500 text-black rounded-xl">Suggest Improvement</button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-xl">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentDetails
