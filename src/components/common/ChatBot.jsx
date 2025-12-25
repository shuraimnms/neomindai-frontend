import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { studentAPI, adminAPI } from '../../services/api'
import { io } from 'socket.io-client'

const ChatBot = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [dataCache, setDataCache] = useState({})
  const socketRef = useRef(null)

  useEffect(() => {
    // connect socket.io for realtime chat
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/i, '')
    const socket = io(base, { auth: { token: localStorage.getItem('token') } })
    socketRef.current = socket

    socket.on('connect', () => {
      // console.log('chat socket connected')
    })

    socket.on('chat:response', ({ id, answer, sources }) => {
      // append bot response
      push('bot', `${answer}${sources?.length ? `\n\nSource: ${sources.join(', ')}` : ''}`)
    })

    // Prefetch relevant data depending on role to answer quickly (REST fallback)
    const load = async () => {
      try {
        if (user?.role === 'admin') {
          const students = await adminAPI.getStudents()
          setDataCache((s) => ({ ...s, students: students.data.data }))
        } else {
          const dash = await studentAPI.getDashboard()
          const profile = await studentAPI.getProfile()
          const vids = await studentAPI.getVideos()
          setDataCache((s) => ({ ...s, dashboard: dash.data.data, profile: profile.data.data, videos: vids.data.data }))
        }
      } catch (e) {
        // ignore prefetch errors
      }
    }
    load()

    return () => {
      socket.disconnect()
    }
  }, [user])

  const push = (role, text) => setMessages((m) => [...m, { id: m.length + 1, role, text }])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const q = input.trim()
    if (!q) return
    push('user', q)
    setInput('')

    // send through socket for realtime processing
    const id = Date.now().toString(36)
    push('bot', '...')
    socketRef.current.emit('chat:query', { id, question: q })
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {open && (
        <div className="w-80 max-w-xs bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="font-semibold">Academy Bot</div>
            <button onClick={() => setOpen(false)} className="text-gray-400">✕</button>
          </div>
          <div className="p-3 max-h-64 overflow-auto space-y-2">
            {messages.length === 0 && (
              <div className="text-sm text-gray-400">Ask me about your profile, streak, recent videos, or activity.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`text-sm whitespace-pre-wrap ${m.role === 'user' ? 'text-right text-white' : 'text-left text-gray-200'}`}>
                <div className={`inline-block px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-primary-500/30' : 'bg-dark-800/50'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-white/5 flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-3 py-2 bg-transparent border border-white/5 rounded-lg text-sm" placeholder="Ask about your data..." />
            <button type="submit" className="px-3 py-2 bg-primary-500/80 rounded-lg text-sm">Ask</button>
          </form>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} className="w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center">
        💬
      </button>
    </div>
  )
}

export default ChatBot
