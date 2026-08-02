'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Plus, X, BookOpen, Zap, Coffee, Users, ChevronLeft, ChevronRight, Trash2, CheckCircle2 } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  event_date: string
  category: string
  description: string
}

const CATEGORIES = ['Class', 'Exam', 'Hackathon', 'Meetup', 'Assignment', 'Other']
const CAT_COLORS: Record<string, string> = {
  Class: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Exam: 'bg-red-500/20 text-red-400 border-red-500/30',
  Hackathon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Meetup: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Assignment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function CalendarPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // New event form
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newCategory, setNewCategory] = useState('Class')
  const [newDesc, setNewDesc] = useState('')

  // Calendar navigation
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })

      if (data) setEvents(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !newTitle || !newDate) return
    setSaving(true)

    const { data, error } = await supabase.from('calendar_events').insert({
      user_id: userId,
      title: newTitle,
      event_date: newDate,
      category: newCategory,
      description: newDesc,
    }).select().single()

    if (!error && data) {
      setEvents(prev => [...prev, data].sort((a, b) => a.event_date.localeCompare(b.event_date)))
      setNewTitle(''); setNewDate(''); setNewCategory('Class'); setNewDesc('')
      setShowModal(false)
    } else {
      alert('Error saving event: ' + error?.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('calendar_events').delete().eq('id', id)
    if (!error) setEvents(prev => prev.filter(e => e.id !== id))
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })

  const eventsByDate: Record<string, CalendarEvent[]> = {}
  events.forEach(ev => {
    const d = ev.event_date
    if (!eventsByDate[d]) eventsByDate[d] = []
    eventsByDate[d].push(ev)
  })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // Upcoming events
  const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Calendar className="text-indigo-400" size={24} /> Academic Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">All events saved permanently in your database.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={15} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-[#111118] border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-5">
            <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-white">{monthName} {viewYear}</h2>
            <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-500 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = eventsByDate[dateStr] || []
              const isToday = dateStr === todayStr
              return (
                <div key={dateStr} className={`min-h-[52px] rounded-xl p-1.5 border transition-all ${isToday ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-white/5 bg-white/2 hover:bg-white/5'}`}>
                  <p className={`text-xs font-bold mb-1 ${isToday ? 'text-indigo-400' : 'text-gray-400'}`}>{day}</p>
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded mb-0.5 border truncate ${CAT_COLORS[ev.category] || CAT_COLORS.Other}`}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[9px] text-gray-500">+{dayEvents.length - 2} more</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events Panel */}
        <div className="space-y-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-400" /> Upcoming Events</h3>
            {loading ? (
              <p className="text-xs text-gray-500">Loading...</p>
            ) : upcoming.length === 0 ? (
              <p className="text-xs text-gray-500">No upcoming events. Add one!</p>
            ) : (
              <div className="space-y-2.5">
                {upcoming.map(ev => (
                  <div key={ev.id} className="flex items-start justify-between gap-2 group">
                    <div className="flex gap-3 items-start">
                      <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${CAT_COLORS[ev.category] || CAT_COLORS.Other}`}>
                        {ev.category}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{ev.title}</p>
                        <p className="text-[10px] text-gray-500">{new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                        {ev.description && <p className="text-[10px] text-gray-600 mt-0.5 truncate max-w-[160px]">{ev.description}</p>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 rounded-lg hover:bg-red-500/10">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-white">Add Schedule Event</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Event Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. DBMS End Exam" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date *</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button type="button" key={cat} onClick={() => setNewCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description (optional)</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Notes about this event..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold py-3 rounded-xl hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all">
                  {saving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
