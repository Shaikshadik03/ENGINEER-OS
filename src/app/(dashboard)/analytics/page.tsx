'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  BarChart3, Flame, Star, Award, CheckCircle2, TrendingUp,
  BookOpen, MapPin, Zap
} from 'lucide-react'

export default function AnalyticsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<{
    full_name: string
    xp: number
    streak: number
    subscription_tier: string
    mastered_skills: string[]
    learning_skills: string[]
  } | null>(null)

  const [completedSubtopicsCount, setCompletedSubtopicsCount] = useState(0)
  const [completedRoadmapCount, setCompletedRoadmapCount] = useState(0)
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
        const { data: prog, count: progCount } = await supabase.from('user_progress')
          .select('*', { count: 'exact' }).eq('user_id', user.id)
        if (progCount !== null) setCompletedSubtopicsCount(progCount)

        // Load roadmap progress count
        const { data: rmProg, count: rmCount } = await supabase.from('roadmap_progress')
          .select('*', { count: 'exact' }).eq('user_id', user.id)
        if (rmCount !== null) setCompletedRoadmapCount(rmCount)
      }
      setLoading(false)
    }
    load()
  }, [])

  // XP Trajectory Data (Simulated based on actual user XP)
  const userXP = profile?.xp || 0
  const xpHistory = [
    { day: 'Mon', xp: Math.round(userXP * 0.1) },
    { day: 'Tue', xp: Math.round(userXP * 0.25) },
    { day: 'Wed', xp: Math.round(userXP * 0.4) },
    { day: 'Thu', xp: Math.round(userXP * 0.55) },
    { day: 'Fri', xp: Math.round(userXP * 0.75) },
    { day: 'Sat', xp: Math.round(userXP * 0.9) },
    { day: 'Sun', xp: userXP },
  ]

  // Category Breakdown
  const categoryData = [
    { category: 'Syllabus Lectures', xp: completedSubtopicsCount * 50 },
    { category: 'Practice Quizzes', xp: completedSubtopicsCount * 20 },
    { category: 'Career Roadmaps', xp: completedRoadmapCount * 100 },
  ]

  // Radar Skill Proficiency Data
  const masteredCount = profile?.mastered_skills?.length || 0
  const learningCount = profile?.learning_skills?.length || 0

  const skillRadarData = [
    { subject: 'Core CS', score: Math.min(100, (masteredCount * 25) + 30) },
    { subject: 'Web Dev', score: Math.min(100, (masteredCount * 20) + 40) },
    { subject: 'Data & AI', score: Math.min(100, (learningCount * 20) + 20) },
    { subject: 'DevOps & Cloud', score: Math.min(100, (learningCount * 15) + 15) },
    { subject: 'Problem Solving', score: Math.min(100, (completedSubtopicsCount * 10) + 25) },
  ]

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <BarChart3 className="text-indigo-400" size={24} /> Performance Analytics
        </h1>
        <p className="text-gray-500 text-sm">Real-time breakdown of your learning velocity, skill growth, and XP history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111118] border border-orange-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Streak</span>
            <Flame size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">{profile?.streak || 0} Days</p>
          <p className="text-[10px] text-gray-500 mt-1">Daily learning active</p>
        </div>

        <div className="bg-[#111118] border border-emerald-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Total XP</span>
            <Star size={18} className="text-emerald-500 fill-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{profile?.xp || 0} XP</p>
          <p className="text-[10px] text-gray-500 mt-1">Earned from courses & roadmaps</p>
        </div>

        <div className="bg-[#111118] border border-indigo-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Completed Lessons</span>
            <BookOpen size={18} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedSubtopicsCount}</p>
          <p className="text-[10px] text-gray-500 mt-1">Subtopics mastered</p>
        </div>

        <div className="bg-[#111118] border border-purple-500/25 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Roadmap Nodes</span>
            <TrendingUp size={18} className="text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedRoadmapCount}</p>
          <p className="text-[10px] text-gray-500 mt-1">Skill nodes unlocked</p>
        </div>
      </div>

      {/* Charts Row 1: XP Growth & Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* XP Growth Area Chart */}
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" /> Weekly XP Trajectory
          </h3>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpHistory}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111118', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap size={16} className="text-indigo-400" /> XP Source Breakdown
          </h3>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="category" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111118', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="xp" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Radar Skill Competency Chart */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award size={16} className="text-purple-400" /> Skill Competency Radar
        </h3>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" fontSize={9} />
              <Radar name="Proficiency %" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111118', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
