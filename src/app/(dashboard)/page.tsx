'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  CheckCircle2, ArrowRight,
  Flame, Award, BookOpen, FileText,
  Briefcase, Shield
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
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good evening'
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

  useEffect(() => {
    async function load() {
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

  const displayName = profile?.full_name ? profile.full_name : 'Student'
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length
  const greeting = getGreeting()

  const card = isDark
    ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl'
    : 'bg-white border border-zinc-200 text-zinc-900 rounded-xl shadow-sm'

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">

      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            {greeting}, {displayName}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {profile?.branch || 'CSE'} · Semester {profile?.semester || 1} · {pendingTasksCount} task{pendingTasksCount === 1 ? '' : 's'} scheduled for today
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            href="/learning"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-colors duration-150"
          >
            <BookOpen size={15} /> Syllabus & Courses
          </Link>
          <Link
            href="/resume-analyzer"
            className={`inline-flex items-center gap-2 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors duration-150 border ${
              isDark 
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200' 
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800'
            }`}
          >
            <FileText size={15} /> Resume Builder
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className={`${card} p-5`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Study Streak</span>
            <Flame className="text-orange-500" size={18} />
          </div>
          <div className="text-2xl font-semibold tracking-tight">{profile?.streak || 0} days</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Consecutive active days</p>
        </div>

        {/* Total XP */}
        <div className={`${card} p-5`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Points</span>
            <Award className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          <div className="text-2xl font-semibold tracking-tight">{profile?.xp || 0} XP</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Earned from modules & quizzes</p>
        </div>

        {/* Lessons Completed */}
        <div className={`${card} p-5`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed Lessons</span>
            <BookOpen className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          <div className="text-2xl font-semibold tracking-tight">{completedCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Curriculum topics finished</p>
        </div>

        {/* Access Tier */}
        <div className={`${card} p-5`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Account Tier</span>
            <Shield className="text-zinc-400" size={18} />
          </div>
          <div className="text-2xl font-semibold tracking-tight uppercase">{profile?.subscription_tier || 'Standard'}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Active student enrollment</p>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${card} p-6 space-y-4`}>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" /> Today's Tasks
              </h2>
              <Link href="/tasks" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1">
                View all tasks <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-2">
              {tasks.length > 0 ? tasks.map(task => {
                const isDone = task.status === 'done'
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-150 cursor-pointer ${
                      isDone
                        ? isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through' : 'bg-zinc-50 border-zinc-200 text-zinc-400 line-through'
                        : isDark ? 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-800 text-zinc-200' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isDone 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : isDark ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className="text-xs font-medium">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {task.tag}
                      </span>
                      {task.due_date && <span className="text-xs text-zinc-400">{task.due_date}</span>}
                    </div>
                  </div>
                )
              }) : (
                <div className={`p-6 rounded-lg border text-xs text-center font-normal ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}>
                  No tasks scheduled for today. You are all caught up.
                </div>
              )}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/roadmaps"
              className={`${card} p-5 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors duration-150 block group`}
            >
              <div className="text-sm font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Career Roadmaps
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Step-by-step technical paths for software and engineering roles.</p>
            </Link>

            <Link
              href="/leetcode"
              className={`${card} p-5 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors duration-150 block group`}
            >
              <div className="text-sm font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                LeetCode Practice Tracker
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Monitor solved problem counts, difficulty tiers, and campus rankings.</p>
            </Link>
          </div>
        </div>

        {/* Recommended Opportunity */}
        <div className="space-y-6">
          <div className={`${card} p-6 space-y-4`}>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Briefcase size={16} className="text-blue-600 dark:text-blue-400" /> Recommended Opportunity
            </h2>

            {topMatch ? (
              <div className={`rounded-lg p-4 space-y-2.5 border ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">Matched to your profile</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{topMatch.stipend_or_salary}</span>
                </div>
                <h3 className="font-semibold text-sm">{topMatch.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{topMatch.company} · {topMatch.location}</p>
                <Link
                  href="/opportunities"
                  className="mt-3 text-xs font-medium px-3.5 py-2 rounded-lg block text-center transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View details & apply
                </Link>
              </div>
            ) : (
              <div className={`rounded-lg p-4 space-y-2.5 border ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">Software Engineering</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Competitive Stipend</span>
                </div>
                <h3 className="font-semibold text-sm">Software Development Intern</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Google India · Hyderabad, India</p>
                <Link
                  href="/opportunities"
                  className="mt-3 text-xs font-medium px-3.5 py-2 rounded-lg block text-center transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View details & apply
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
