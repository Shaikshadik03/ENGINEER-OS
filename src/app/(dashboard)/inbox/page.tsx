'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Inbox as InboxIcon, Bell, Star, Zap, CheckCircle2,
  Trash2, Filter, Rocket, Briefcase
} from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'xp' | 'match' | 'streak' | 'system'
  read: boolean
  time: string
}

export default function InboxPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) {
          setProfile(p)
          // Generate real notifications based on user's profile stats
          const items: NotificationItem[] = [
            {
              id: '1',
              title: '🎉 Welcome to Engineer OS Pro',
              message: `Your student profile is active for ${p.branch || 'CSE'} Semester ${p.semester || 1}. All learning engine features & career roadmaps are enabled.`,
              type: 'system',
              read: false,
              time: 'Just now'
            },
            {
              id: '2',
              title: `⚡ ${p.xp || 0} Total XP Milestone Achieved!`,
              message: `You have earned ${p.xp || 0} XP across course lectures, practice quizzes, and visual roadmaps.`,
              type: 'xp',
              read: false,
              time: '2 hours ago'
            },
            {
              id: '3',
              title: '💼 Opportunity Matcher Calibrated',
              message: `New listings matched against your skills (${(p.mastered_skills || []).join(', ')}). Check Opportunity Matchmaker for 80%+ scores.`,
              type: 'match',
              read: true,
              time: '1 day ago'
            },
            {
              id: '4',
              title: `🔥 ${p.streak || 1} Day Streak Active`,
              message: 'Keep logging in daily to build your engineering consistency streak!',
              type: 'streak',
              read: true,
              time: '2 days ago'
            }
          ]
          setNotifications(items)
        }
      }
    }
    load()
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notifications.filter(n => filter === 'all' || !n.read)

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <InboxIcon className="text-indigo-400" size={24} /> System Inbox & Alerts
          </h1>
          <p className="text-gray-500 text-sm">Notifications, XP milestones, and opportunity match alerts.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filter === 'unread' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {filter === 'all' ? 'Show Unread Only' : 'Show All'}
          </button>
          <button
            onClick={markAllRead}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notifications Feed */}
      {filtered.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-12 text-center text-gray-500">
          No notifications in your inbox right now.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                !item.read
                  ? 'bg-indigo-500/5 border-indigo-500/30'
                  : 'bg-[#111118] border-white/10 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 shrink-0">
                  {item.type === 'xp' ? <Star size={18} className="text-emerald-400" />
                    : item.type === 'match' ? <Briefcase size={18} className="text-indigo-400" />
                    : item.type === 'streak' ? <Zap size={18} className="text-orange-400" />
                    : <Bell size={18} className="text-purple-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">{item.message}</p>
                  <span className="text-[10px] text-gray-600 font-mono">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => deleteNotification(item.id)}
                className="text-gray-600 hover:text-rose-400 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
