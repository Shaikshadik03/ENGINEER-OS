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
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {greeting}, {displayName}! {greetingEmoji}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {profile?.branch || 'CSE'} Semester {profile?.semester || 1} • {pendingTasksCount} pending tasks today.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/learning"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <BookOpen size={16} /> Resume Learning
          </Link>
          <Link
            href="/resume-analyzer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <FileText size={16} /> AI Resume Coach
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-[#111118] border border-orange-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Streak</span>
            <Flame className="text-orange-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{profile?.streak || 0} Days</h3>
          <p className="text-[10px] text-gray-500">Daily learning active</p>
        </div>

        {/* Total XP */}
        <div className="bg-[#111118] border border-emerald-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Total XP</span>
            <Star className="text-emerald-500 fill-emerald-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{profile?.xp || 0} XP</h3>
          <p className="text-[10px] text-gray-500">Mastery points earned</p>
        </div>

        {/* Lessons Completed */}
        <div className="bg-[#111118] border border-indigo-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Completed Lessons</span>
            <BookOpen className="text-indigo-400" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{completedCount}</h3>
          <p className="text-[10px] text-gray-500">Subtopics completed</p>
        </div>

        {/* Access Tier */}
        <div className="bg-[#111118] border border-purple-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Access Tier</span>
            <Trophy className="text-purple-400" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 uppercase">{profile?.subscription_tier || 'FREE'}</h3>
          <p className="text-[10px] text-gray-500">OS Subscription Plan</p>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" /> Today's Priority Action Plan
              </h2>
              <Link href="/tasks" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Manage All Tasks →
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.map(task => {
                const isDone = task.status === 'done'
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 line-through opacity-60'
                        : 'bg-white/5 border-white/10 hover:border-indigo-500/40 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-gray-600'
                      }`}>
                        {isDone && <CheckCircle2 size={14} className="text-black font-bold" />}
                      </div>
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                        {task.tag}
                      </span>
                      <span className="text-xs text-gray-500">{task.due_date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/roadmaps"
              className="bg-[#111118] border border-white/10 hover:border-indigo-500/50 rounded-2xl p-5 transition-all block group"
            >
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Visual Career Roadmaps</h3>
              <p className="text-xs text-gray-500">6 interactive skill trees unlocked by your profile skills.</p>
            </Link>

            <Link
              href="/leetcode"
              className="bg-[#111118] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 transition-all block group"
            >
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">LeetCode Campus Sync</h3>
              <p className="text-xs text-gray-500">Sync live stats & climb the college DSA leaderboard.</p>
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-[#111118] border border-indigo-500/30 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" /> AI Matched Opportunity
            </h2>

            {topMatch ? (
              <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Top Match For You</span>
                <h4 className="font-bold text-white text-sm">{topMatch.title}</h4>
                <p className="text-xs text-gray-400">{topMatch.company} • {topMatch.location}</p>
                <p className="text-[10px] text-emerald-400 font-bold">{topMatch.stipend_or_salary}</p>
                <Link
                  href="/opportunities"
                  className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-lg block text-center transition-all"
                >
                  View & Apply Now →
                </Link>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Syncing live opportunities feed...</div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
