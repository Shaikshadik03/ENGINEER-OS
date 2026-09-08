'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Calendar, Plus, X, Zap, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  event_date: string
  category: string
  description: string
}

const CATEGORIES = ['Class', 'Exam', 'Hackathon', 'Meetup', 'Assignment', 'Other']
const CAT_COLORS_DARK: Record<string, string> = {
  Class: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Exam: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Hackathon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Meetup: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Assignment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}
const CAT_COLORS_LIGHT: Record<string, string> = {
  Class: 'bg-blue-100 text-blue-800 border-blue-200',
  Exam: 'bg-rose-100 text-rose-800 border-rose-200',
  Hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
  Meetup: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Assignment: 'bg-amber-100 text-amber-800 border-amber-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function CalendarPage() {
  const { isDark } = useTheme()
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

  const cardStyle = isDark
    ? 'bg-[#111118]/80 border-white/10 text-white backdrop-blur-xl'
    : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-xl'

  const inputStyle = isDark
    ? 'bg-[#0d0d12] border-white/10 text-white placeholder-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'

  return (
    <div className={`max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><Calendar className="text-sky-500" size={24} /> Academic Schedule</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>All events saved permanently in your database.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md">
          <Plus size={15} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className={`lg:col-span-2 ${cardStyle} rounded-3xl p-5 border`}>
          <div className="flex justify-between items-center mb-5">
            <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }} className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}>
              <ChevronLeft size={18} />
            </button>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{monthName} {viewYear}</h2>
            <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }} className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className={`text-center text-[10px] font-bold py-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = eventsByDate[dateStr] || []
              const isToday = dateStr === todayStr
              const colorMap = isDark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT

              return (
                <div key={dateStr} className={`min-h-[52px] rounded-xl p-1.5 border transition-all ${
                  isToday
                    ? isDark ? 'border-sky-500/60 bg-sky-500/10' : 'border-sky-500 bg-sky-50'
                    : isDark ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50'
                }`}>
                  <p className={`text-xs font-bold mb-1 ${isToday ? 'text-sky-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>{day}</p>
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded mb-0.5 border truncate ${colorMap[ev.category] || colorMap.Other}`}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+{dayEvents.length - 2} more</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events Panel */}
        <div className="space-y-4">
          <div className={`${cardStyle} rounded-3xl p-5 border`}>
            <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><Zap size={16} className="text-amber-500" /> Upcoming Events</h3>
            {loading ? (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Loading...</p>
            ) : upcoming.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No upcoming events. Add one!</p>
            ) : (
              <div className="space-y-2.5">
                {upcoming.map(ev => {
                  const colorMap = isDark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT
                  return (
                    <div key={ev.id} className="flex items-start justify-between gap-2 group">
                      <div className="flex gap-3 items-start">
                        <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${colorMap[ev.category] || colorMap.Other}`}>
                          {ev.category}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ev.title}</p>
                          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                          {ev.description && <p className={`text-[10px] mt-0.5 truncate max-w-[160px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{ev.description}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-rose-500/10">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${cardStyle} rounded-3xl p-6 w-full max-w-md shadow-2xl border`}>
            <div className={`flex justify-between items-center mb-5 pb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add Schedule Event</h3>
              <button onClick={() => setShowModal(false)} className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Event Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. DBMS End Exam" className={`w-full rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 border ${inputStyle}`} />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date *</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className={`w-full rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 border ${inputStyle}`} />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button type="button" key={cat} onClick={() => setNewCategory(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      newCategory === cat
                        ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
                        : isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description (optional)</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Notes about this event..." className={`w-full rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 border ${inputStyle}`} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 border text-xs font-bold py-3 rounded-2xl transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}>Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-2xl transition-all shadow-md">
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
