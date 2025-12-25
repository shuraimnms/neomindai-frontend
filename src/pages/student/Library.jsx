import { useEffect, useState } from 'react'
import { libraryAPI } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import GlassCard from '../../components/common/GlassCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import BookCard from '../../components/common/BookCard'

const Library = () => {
  const { callApi, loading, error } = useApi()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [search, category])

  const fetchBooks = async () => {
    const params = {}
    if (search) params.search = search
    if (category) params.category = category
    const result = await callApi(() => libraryAPI.getAll(params))
    if (result.success) setBooks(result.data.books || [])
  }

  const handleDownload = (book) => {
    if (book.external_link) {
      window.open(book.external_link, '_blank')
      return
    }
    // direct download URL returned by service wrapper
    const url = libraryAPI.download(book.id)
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Library</h1>
            <p className="text-gray-400">Browse and download books</p>
          </div>
          <div className="flex items-center space-x-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="px-4 py-2 rounded bg-dark-800/50" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category filter" className="px-4 py-2 rounded bg-dark-800/50" />
          </div>
        </div>
      </GlassCard>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : error ? (
        <GlassCard><div className="text-red-400">{error}</div></GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(b => (
            <BookCard key={b.id} book={b} onOpen={handleDownload} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Library
