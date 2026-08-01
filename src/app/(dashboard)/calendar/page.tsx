'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, MapPin,
  Plus, Clock, Sparkles, X, CheckCircle2
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: number // day of month (1-31)
  type: 'class' | 'hackathon' | 'exam' | 'meetup'
}

export default function CalendarPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Smart India Hackathon Kickoff', date: 12, type: 'hackathon' },
    { id: '2', title: 'OS & C Programming Exam', date: 14, type: 'exam' },
    { id: '3', title: 'AWS Developer Meetup', date: 18, type: 'meetup' },
    { id: '4', title: 'Google Cloud Next Stream', date: 25, type: 'class' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDay, setEventDay] = useState(15)
  const [eventType, setEventType] = useState<'class' | 'hackathon' | 'exam' | 'meetup'>('hackathon')

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim()) return
    const newEv: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title: eventTitle.trim(),
      date: Number(eventDay),
      type: eventType,
    }
    setEvents(prev => [...prev, newEv])
    setShowModal(false)
    setEventTitle('')
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500 flex flex-col">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <CalendarIcon className="text-indigo-400" size={24} /> Academic & Exam Schedule
          </h1>
          <p className="text-gray-500 text-sm">Balance college classes, exam deadlines, hackathons, and prep milestones.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} /> Add Schedule Event
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden flex flex-col">

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
          {days.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 border-collapse">
          {Array.from({ length: 35 }).map((_, i) => {
            const date = i - 2
            const isToday = date === 14
            const isCurrentMonth = date > 0 && date <= 31
            const dayEvents = events.filter(e => e.date === date)

            return (
              <div
                key={i}
                className={`min-h-[110px] p-2 border-r border-b border-white/5 ${
                  !isCurrentMonth ? 'bg-black/40 text-gray-700' : 'hover:bg-white/5'
                } transition-colors relative cursor-pointer`}
              >
                {/* Date Number */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                      : isCurrentMonth
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}
                >
                  {isCurrentMonth ? date : ''}
                </div>

                {/* Day Events */}
                {isCurrentMonth && (
                  <div className="space-y-1">
                    {dayEvents.map(ev => {
                      const colorMap = {
                        hackathon: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                        exam: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
                        meetup: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                        class: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
                      }
                      return (
                        <div
                          key={ev.id}
                          className={`px-2 py-1 rounded-md border text-[10px] font-semibold truncate ${colorMap[ev.type]}`}
                        >
                          {ev.title}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* EVENT CREATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" /> Add Event to Schedule
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems Mid-Sem Exam"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Day of Month</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={eventDay}
                    onChange={e => setEventDay(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Event Category</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="exam" className="bg-[#111118]">Exam</option>
                    <option value="hackathon" className="bg-[#111118]">Hackathon</option>
                    <option value="class" className="bg-[#111118]">Class / Lecture</option>
                    <option value="meetup" className="bg-[#111118]">Meetup</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
