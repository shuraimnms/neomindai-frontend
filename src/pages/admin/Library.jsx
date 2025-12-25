import { useEffect, useState } from 'react'
import { libraryAPI } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const AdminLibrary = () => {
  const { callApi, loading } = useApi()
  const [books, setBooks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', author: '', description: '', category: '', external_link: '' })
  const [file, setFile] = useState(null)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    const res = await callApi(() => libraryAPI.admin.getAll())
    if (res.success) setBooks(res.data.books || [])
  }

  const openAdd = () => { setEditing(null); setForm({ title: '', author: '', description: '', category: '', external_link: '' }); setFile(null); setShowModal(true) }
  const openEdit = (b) => { setEditing(b); setForm({ title: b.title, author: b.author, description: b.description, category: b.category, external_link: b.external_link || '' }); setFile(null); setShowModal(true) }

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required')

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('author', form.author)
    fd.append('description', form.description)
    fd.append('category', form.category)
    fd.append('external_link', form.external_link)
    if (file) fd.append('file', file)

    try {
      if (editing) {
        const res = await libraryAPI.admin.update(editing.id, fd)
        setBooks(books.map(b => (b.id === editing.id ? res.data.data.book : b)))
        toast.success('Book updated')
      } else {
        const res = await libraryAPI.admin.create(fd)
        setBooks([res.data.data.book, ...books])
        toast.success('Book created')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return
    try {
      await libraryAPI.admin.delete(id)
      setBooks(books.filter(b => b.id !== id))
      toast.success('Deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Library</h1>
            <p className="text-gray-400">Manage library books</p>
          </div>
          <div>
            <button onClick={openAdd} className="btn-primary flex items-center space-x-2"><FaPlus /><span>Add Book</span></button>
          </div>
        </div>
      </GlassCard>

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner /></div> : (
        <GlassCard>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-400">
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id} className="border-t border-white/5">
                  <td className="py-3">{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEdit(b)} className="px-3 py-1 bg-blue-600 rounded text-white"><FaEdit /></button>
                      <button onClick={() => handleDelete(b.id)} className="px-3 py-1 bg-red-600 rounded text-white"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="glass-card max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{editing ? 'Edit Book' : 'Add Book'}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="space-y-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 rounded bg-dark-800/50" />
              <input placeholder="Author" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} className="w-full px-4 py-2 rounded bg-dark-800/50" />
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 rounded bg-dark-800/50" />
              <input placeholder="External link (optional)" value={form.external_link} onChange={(e) => setForm({...form, external_link: e.target.value})} className="w-full px-4 py-2 rounded bg-dark-800/50" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 rounded bg-dark-800/50" rows={4} />
              <div>
                <label className="block mb-2">Upload PDF (optional)</label>
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-white/5">Cancel</button>
                <button onClick={handleSave} className="btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLibrary
