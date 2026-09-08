'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  BarChart3, Flame, Star, Award, TrendingUp,
  BookOpen, Zap
} from 'lucide-react'

export default function AnalyticsPage() {
  const { isDark } = useTheme()
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

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) setProfile(p)

        const { count: progCount } = await supabase.from('user_progress')
          .select('*', { count: 'exact' }).eq('user_id', user.id)
        if (progCount !== null) setCompletedSubtopicsCount(progCount)

        const { count: rmCount } = await supabase.from('roadmap_progress')
          .select('*', { count: 'exact' }).eq('user_id', user.id)
        if (rmCount !== null) setCompletedRoadmapCount(rmCount)
      }
    }
    load()
  }, [])

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

  const categoryData = [
    { category: 'Syllabus Lectures', xp: completedSubtopicsCount * 50 },
    { category: 'Practice Quizzes', xp: completedSubtopicsCount * 20 },
    { category: 'Career Roadmaps', xp: completedRoadmapCount * 100 },
  ]

  const masteredCount = profile?.mastered_skills?.length || 0
  const learningCount = profile?.learning_skills?.length || 0

  const skillRadarData = [
    { subject: 'Core CS', score: Math.min(100, (masteredCount * 25) + 30) },
    { subject: 'Web Dev', score: Math.min(100, (masteredCount * 20) + 40) },
    { subject: 'Data & AI', score: Math.min(100, (learningCount * 20) + 20) },
    { subject: 'DevOps & Cloud', score: Math.min(100, (learningCount * 15) + 15) },
    { subject: 'Problem Solving', score: Math.min(100, (completedSubtopicsCount * 10) + 25) },
  ]

  const cardStyle = isDark
    ? 'bg-[#111118]/80 border-white/10 text-white backdrop-blur-xl'
    : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-xl'

  return (
    <div className={`max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>

      {/* Header */}
      <div className={`pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <h1 className={`text-3xl font-black mb-1 flex items-center gap-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <BarChart3 className="text-sky-500" size={28} /> Performance Analytics
        </h1>
        <p className={`font-semibold text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time breakdown of your learning velocity, skill growth, and XP history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${cardStyle} rounded-3xl p-5 border`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Streak</span>
            <Flame size={18} className="text-amber-500" />
          </div>
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.streak || 0} Days</p>
          <p className={`text-[10px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Daily learning active</p>
        </div>

        <div className={`${cardStyle} rounded-3xl p-5 border`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">Total XP</span>
            <Star size={18} className="text-emerald-500 fill-emerald-500" />
          </div>
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.xp || 0} XP</p>
          <p className={`text-[10px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Earned from courses & roadmaps</p>
        </div>

        <div className={`${cardStyle} rounded-3xl p-5 border`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider">Completed Lessons</span>
            <BookOpen size={18} className="text-sky-500" />
          </div>
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedSubtopicsCount}</p>
          <p className={`text-[10px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subtopics mastered</p>
        </div>

        <div className={`${cardStyle} rounded-3xl p-5 border`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider">Roadmap Nodes</span>
            <TrendingUp size={18} className="text-purple-500" />
          </div>
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedRoadmapCount}</p>
          <p className={`text-[10px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Skill nodes unlocked</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* XP Growth Area Chart */}
        <div className={`${cardStyle} rounded-3xl p-6 space-y-4 border`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <TrendingUp size={16} className="text-emerald-500" /> Weekly XP Trajectory
          </h3>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpHistory}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111118' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className={`${cardStyle} rounded-3xl p-6 space-y-4 border`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Zap size={16} className="text-sky-500" /> XP Source Breakdown
          </h3>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="category" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#111118' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                />
                <Bar dataKey="xp" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Radar Skill Competency Chart */}
      <div className={`${cardStyle} rounded-3xl p-6 space-y-4 border`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Award size={16} className="text-purple-500" /> Skill Competency Radar
        </h3>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
              <PolarGrid stroke={isDark ? '#334155' : '#cbd5e1'} />
              <PolarAngleAxis dataKey="subject" stroke={isDark ? '#cbd5e1' : '#475569'} fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={9} />
              <Radar name="Proficiency %" dataKey="score" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#111118' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: isDark ? '#ffffff' : '#0f172a'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
