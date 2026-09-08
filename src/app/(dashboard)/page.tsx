'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Target, CheckCircle2, Zap, Trophy, Clock, ArrowRight,
  Flame, Star, BookOpen, Briefcase, Plus, Sparkles, FileText
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface TaskItem {
  id: string
  title: string
  tag: string
  status: 'todo' | 'inprogress' | 'done'
  due_date: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 21) return 'Good Evening'
  return 'Good Night'
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '☀️'
  if (hour >= 12 && hour < 17) return '🌤️'
  if (hour >= 17 && hour < 21) return '🌆'
  return '🌙'
}

export default function RootDashboard() {
  const supabase = createClient()
  const { isDark } = useTheme()
  const [profile, setProfile] = useState<{
    full_name: string
    branch: string
    semester: number
    xp: number
    streak: number
    subscription_tier: string
    mastered_skills: string[]
    learning_skills: string[]
  } | null>(null)

  const [completedCount, setCompletedCount] = useState(0)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [topMatch, setTopMatch] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Load profile
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) setProfile(p)

        // Load learning progress count
        const { count: progCount } = await supabase.from('user_progress')
          .select('*', { count: 'exact' }).eq('user_id', user.id)
        if (progCount !== null) setCompletedCount(progCount)

        // Load tasks from Supabase tasks table
        const { data: tData } = await supabase.from('tasks')
          .select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        
        if (tData && tData.length > 0) {
          setTasks(tData)
        }

        // Load top opportunity recommendation
        const { data: opps } = await supabase.from('opportunities').select('*').limit(1).single()
        if (opps) setTopMatch(opps)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Toggle Task Completion
  const toggleTaskStatus = async (task: TaskItem) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done'
    const updated = tasks.map(t => t.id === task.id ? { ...t, status: nextStatus as any } : t)
    setTasks(updated)
    await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id)
  }

  const displayName = profile?.full_name ? profile.full_name : 'Engineer'
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length
  const greeting = getGreeting()
  const greetingEmoji = getGreetingEmoji()

  const cardStyle = isDark 
    ? 'bg-[#111118]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white' 
    : 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:border-sky-300 hover:shadow-md text-slate-900'

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">

      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
        <div>
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {greeting}, {displayName}! {greetingEmoji}
          </h1>
          <p className={`font-semibold text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {profile?.branch || 'CSE'} Semester {profile?.semester || 1} • {pendingTasksCount} pending tasks today.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/learning"
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <BookOpen size={16} /> Resume Learning
          </Link>
          <Link
            href="/resume-analyzer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <FileText size={16} /> AI Resume Coach
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className={`${cardStyle} rounded-3xl p-5 transition-all`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Streak</span>
            <Flame className="text-amber-500" size={20} />
          </div>
          <h3 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.streak || 0} Days</h3>
          <p className="text-[10px] font-semibold text-slate-400">Daily learning active</p>
        </div>

        {/* Total XP */}
        <div className={`${cardStyle} rounded-3xl p-5 transition-all`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Total XP</span>
            <Star className="text-emerald-400 fill-emerald-400" size={20} />
          </div>
          <h3 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.xp || 0} XP</h3>
          <p className="text-[10px] font-semibold text-slate-400">Mastery points earned</p>
        </div>

        {/* Lessons Completed */}
        <div className={`${cardStyle} rounded-3xl p-5 transition-all`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">Completed Lessons</span>
            <BookOpen className="text-sky-400" size={20} />
          </div>
          <h3 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedCount}</h3>
          <p className="text-[10px] font-semibold text-slate-400">Subtopics completed</p>
        </div>

        {/* Access Tier */}
        <div className={`${cardStyle} rounded-3xl p-5 transition-all`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Access Tier</span>
            <Trophy className="text-purple-400" size={20} />
          </div>
          <h3 className={`text-2xl font-black mb-1 uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.subscription_tier || 'PRO'}</h3>
          <p className="text-[10px] font-semibold text-slate-400">OS Subscription Plan</p>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${cardStyle} rounded-3xl p-6 space-y-4`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <CheckCircle2 size={18} className="text-emerald-400" /> Today's Priority Action Plan
              </h2>
              <Link href="/tasks" className="text-xs text-sky-400 hover:text-sky-300 font-bold">
                Manage All Tasks →
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.length > 0 ? tasks.map(task => {
                const isDone = task.status === 'done'
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? isDark ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 line-through opacity-70' : 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-70'
                        : isDark ? 'bg-[#181824]/90 border-white/10 hover:bg-[#202030] text-slate-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-black' : isDark ? 'border-slate-600 bg-black/40' : 'border-slate-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle2 size={14} className="text-black font-bold" />}
                      </div>
                      <span className="text-xs font-semibold">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        {task.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">{task.due_date}</span>
                    </div>
                  </div>
                )
              }) : (
                <div className={`p-4 rounded-2xl border text-xs text-center font-medium ${
                  isDark ? 'bg-[#181824]/90 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  🎉 No pending tasks today! Keep up your daily study streak.
                </div>
              )}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/roadmaps"
              className={`${cardStyle} rounded-3xl p-5 transition-all block group`}
            >
              <h3 className={`text-base font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-sky-600'}`}>Visual Career Roadmaps</h3>
              <p className="text-xs text-slate-400 font-medium">6 interactive skill trees unlocked by your profile skills.</p>
            </Link>

            <Link
              href="/leetcode"
              className={`${cardStyle} rounded-3xl p-5 transition-all block group`}
            >
              <h3 className={`text-base font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'}`}>LeetCode Campus Sync</h3>
              <p className="text-xs text-slate-400 font-medium">Sync live stats & climb the college DSA leaderboard.</p>
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className={`${cardStyle} rounded-3xl p-6 space-y-4`}>
            <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles size={16} className="text-sky-400" /> AI Matched Opportunity
            </h2>

            {topMatch ? (
              <div className={`rounded-2xl p-4 space-y-2 border ${
                isDark ? 'bg-[#181826]/90 border-emerald-500/30' : 'bg-sky-50 border-sky-200'
              }`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-sky-700'}`}>Top Match For You</span>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{topMatch.title}</h4>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{topMatch.company} • {topMatch.location}</p>
                <p className="text-[11px] text-emerald-400 font-extrabold">{topMatch.stipend_or_salary}</p>
                <Link
                  href="/opportunities"
                  className={`mt-2 text-xs font-extrabold px-4 py-2.5 rounded-xl block text-center transition-all shadow-sm ${
                    isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  View & Apply Now →
                </Link>
              </div>
            ) : (
              <div className={`rounded-2xl p-4 space-y-2 border ${
                isDark ? 'bg-[#181826]/90 border-emerald-500/30' : 'bg-sky-50 border-sky-200'
              }`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-sky-700'}`}>Top Match For You</span>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>SDE Intern</h4>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Google India • Hyderabad, India</p>
                <p className="text-[11px] text-emerald-400 font-extrabold">₹80,000/month</p>
                <Link
                  href="/opportunities"
                  className={`mt-2 text-xs font-extrabold px-4 py-2.5 rounded-xl block text-center transition-all shadow-sm ${
                    isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  View & Apply Now →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

