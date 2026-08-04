'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Target, CheckCircle2, Zap, Trophy, Clock, ArrowRight,
  Flame, Star, BookOpen, Briefcase, Plus, Sparkles, FileText
} from 'lucide-react'

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500 text-slate-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {greeting}, {displayName}! {greetingEmoji}
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">
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
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Streak</span>
            <Flame className="text-amber-500" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{profile?.streak || 0} Days</h3>
          <p className="text-[10px] font-semibold text-slate-400">Daily learning active</p>
        </div>

        {/* Total XP */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Total XP</span>
            <Star className="text-emerald-500 fill-emerald-500" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{profile?.xp || 0} XP</h3>
          <p className="text-[10px] font-semibold text-slate-400">Mastery points earned</p>
        </div>

        {/* Lessons Completed */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">Completed Lessons</span>
            <BookOpen className="text-sky-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{completedCount}</h3>
          <p className="text-[10px] font-semibold text-slate-400">Subtopics completed</p>
        </div>

        {/* Access Tier */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Access Tier</span>
            <Trophy className="text-purple-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase">{profile?.subscription_tier || 'PRO'}</h3>
          <p className="text-[10px] font-semibold text-slate-400">OS Subscription Plan</p>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" /> Today's Priority Action Plan
              </h2>
              <Link href="/tasks" className="text-xs text-sky-600 hover:text-sky-800 font-bold">
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
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-70'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle2 size={14} className="text-white font-bold" />}
                      </div>
                      <span className="text-xs font-semibold">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                        {task.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">{task.due_date}</span>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center font-medium">
                  🎉 No pending tasks today! Keep up your daily study streak.
                </div>
              )}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/roadmaps"
              className="bg-white border border-slate-200/80 hover:border-sky-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all block group"
            >
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">Visual Career Roadmaps</h3>
              <p className="text-xs text-slate-500 font-medium">6 interactive skill trees unlocked by your profile skills.</p>
            </Link>

            <Link
              href="/leetcode"
              className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all block group"
            >
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">LeetCode Campus Sync</h3>
              <p className="text-xs text-slate-500 font-medium">Sync live stats & climb the college DSA leaderboard.</p>
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-sky-600" /> AI Matched Opportunity
            </h2>

            {topMatch ? (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">Top Match For You</span>
                <h4 className="font-bold text-slate-900 text-sm">{topMatch.title}</h4>
                <p className="text-xs text-slate-600 font-medium">{topMatch.company} • {topMatch.location}</p>
                <p className="text-[11px] text-emerald-700 font-extrabold">{topMatch.stipend_or_salary}</p>
                <Link
                  href="/opportunities"
                  className="mt-2 text-xs bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2.5 rounded-xl block text-center transition-all shadow-sm"
                >
                  View & Apply Now →
                </Link>
              </div>
            ) : (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">Top Match For You</span>
                <h4 className="font-bold text-slate-900 text-sm">SDE Intern</h4>
                <p className="text-xs text-slate-600 font-medium">Google India • Hyderabad, India</p>
                <p className="text-[11px] text-emerald-700 font-extrabold">₹80,000/month</p>
                <Link
                  href="/opportunities"
                  className="mt-2 text-xs bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2.5 rounded-xl block text-center transition-all shadow-sm"
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
