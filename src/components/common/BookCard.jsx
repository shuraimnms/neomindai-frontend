import React from 'react'

const BookCard = ({ book, onOpen }) => {
  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <div className="text-sm text-gray-400">{book.author}</div>
        <p className="mt-2 text-sm text-gray-300 line-clamp-3">{book.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">{book.category || 'Uncategorized'}</div>
          <div className="flex items-center space-x-2">
            <a href={book.external_link || '#'} target="_blank" rel="noreferrer" className="text-sm text-primary-400 hover:underline">Open</a>
            <button onClick={() => onOpen(book)} className="text-sm text-white bg-primary-600 px-3 py-1 rounded">Download</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCard
