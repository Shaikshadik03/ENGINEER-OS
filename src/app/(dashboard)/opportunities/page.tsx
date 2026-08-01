'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Briefcase, Code2, Trophy, Calendar, MapPin, ExternalLink,
  Star, Filter, Search, Zap, CheckCircle2, Clock, Wifi
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  company: string
  type: 'job' | 'internship' | 'hackathon' | 'event'
  location: string
  is_remote: boolean
  stipend_or_salary: string
  description: string
  required_skills: string[]
  apply_url: string
  deadline: string
  tags: string[]
  is_verified: boolean
  posted_at: string
}

// ── MATCH SCORE ENGINE ──
// Compares user's skills against opportunity required_skills
// Mastered = 1.0 weight, Learning = 0.5 weight
function calculateMatchScore(
  required: string[],
  mastered: string[],
  learning: string[]
): number {
  if (!required.length) return 100
  let score = 0
  required.forEach(skill => {
    if (mastered.includes(skill)) score += 1.0
    else if (learning.includes(skill)) score += 0.5
  })
  return Math.round((score / required.length) * 100)
}

const TYPE_CONFIG = {
  job:        { label: 'Job',        icon: Briefcase, color: 'indigo',  bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400' },
  internship: { label: 'Internship', icon: Code2,     color: 'emerald', bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' },
  hackathon:  { label: 'Hackathon',  icon: Trophy,    color: 'amber',   bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400' },
  event:      { label: 'Event',      icon: Calendar,  color: 'purple',  bg: 'bg-purple-500/10 border-purple-500/25 text-purple-400' },
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : score >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-gray-500 bg-white/5 border-white/10'
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${color}`}>
      <Zap size={12} />
      {score}% Match
    </div>
  )
}

export default function OpportunitiesPage() {
  const supabase = createClient()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [masteredSkills, setMasteredSkills] = useState<string[]>([])
  const [learningSkills, setLearningSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [minMatch, setMinMatch] = useState(0)
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match')

  // Load user profile + opportunities
  useEffect(() => {
    async function load() {
      setLoading(true)
      // Load user skills
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles')
          .select('mastered_skills,learning_skills').eq('id', user.id).single()
        if (profile) {
          setMasteredSkills(profile.mastered_skills || [])
          setLearningSkills(profile.learning_skills || [])
        }
      }
      // Load opportunities
      const { data: opps } = await supabase.from('opportunities').select('*')
      if (opps) setOpportunities(opps)
      setLoading(false)
    }
    load()
  }, [])

  // Add match score to each opportunity + apply filters
  const processed = useMemo(() => {
    return opportunities
      .map(opp => ({
        ...opp,
        matchScore: calculateMatchScore(opp.required_skills, masteredSkills, learningSkills)
      }))
      .filter(opp => {
        if (typeFilter !== 'all' && opp.type !== typeFilter) return false
        if (remoteOnly && !opp.is_remote) return false
        if (opp.matchScore < minMatch) return false
        if (search && !`${opp.title} ${opp.company} ${opp.description}`.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => sortBy === 'match'
        ? b.matchScore - a.matchScore
        : new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      )
  }, [opportunities, masteredSkills, learningSkills, typeFilter, remoteOnly, minMatch, search, sortBy])

  // Stats
  const stats = useMemo(() => {
    const scored = opportunities.map(o => ({
      ...o, matchScore: calculateMatchScore(o.required_skills, masteredSkills, learningSkills)
    }))
    return {
      high: scored.filter(o => o.matchScore >= 80).length,
      medium: scored.filter(o => o.matchScore >= 50 && o.matchScore < 80).length,
      total: opportunities.length,
    }
  }, [opportunities, masteredSkills, learningSkills])

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1">Opportunity Matchmaker</h1>
        <p className="text-gray-500 text-sm">AI-scored against your actual skills. No fake listings.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111118] border border-emerald-500/25 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.high}</p>
          <p className="text-xs text-gray-500 mt-1">Strong Match (80%+)</p>
        </div>
        <div className="bg-[#111118] border border-amber-500/25 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
          <p className="text-xs text-gray-500 mt-1">Good Match (50-79%)</p>
        </div>
        <div className="bg-[#111118] border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Listings</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by role, company, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-gray-500" />
            {(['all', 'internship', 'job', 'hackathon', 'event'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Remote Toggle */}
          <button onClick={() => setRemoteOnly(!remoteOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${remoteOnly ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            <Wifi size={12} /> Remote Only
          </button>

          {/* Min Match Filter */}
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-indigo-400" />
            <span className="text-xs text-gray-500">Min Match:</span>
            {[0, 50, 70, 90].map(m => (
              <button key={m} onClick={() => setMinMatch(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${minMatch === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                {m === 0 ? 'Any' : `${m}%+`}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex gap-2">
            <button onClick={() => setSortBy('match')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortBy === 'match' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>
              Best Match
            </button>
            <button onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortBy === 'recent' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500 font-semibold">
        Showing <span className="text-white">{processed.length}</span> opportunities
        {masteredSkills.length === 0 && (
          <span className="ml-2 text-amber-400">⚠ Add skills to your profile to see match scores.</span>
        )}
      </p>

      {/* Listings */}
      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading opportunities...</div>
      ) : processed.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
          No opportunities match your current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {processed.map(opp => {
            const { icon: TypeIcon, bg } = TYPE_CONFIG[opp.type]
            return (
              <div key={opp.id} className="bg-[#111118] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${bg}`}>
                        <TypeIcon size={11} />{TYPE_CONFIG[opp.type].label}
                      </span>
                      {opp.is_remote && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/25 text-emerald-400 flex items-center gap-1">
                          <Wifi size={11} /> Remote
                        </span>
                      )}
                      {opp.is_verified && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/25 text-blue-400 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      )}
                      {opp.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                      ))}
                    </div>

                    <h3 className="text-base font-bold text-white mb-0.5">{opp.title}</h3>
                    <p className="text-sm text-indigo-400 font-semibold mb-2">{opp.company}</p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{opp.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12} />{opp.location}</span>
                      {opp.stipend_or_salary && <span className="flex items-center gap-1"><Star size={12} />{opp.stipend_or_salary}</span>}
                      <span className="flex items-center gap-1"><Clock size={12} />Deadline: {opp.deadline}</span>
                    </div>

                    {/* Required Skills */}
                    {opp.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {opp.required_skills.map(skill => {
                          const hasMastered = masteredSkills.includes(skill)
                          const hasLearning = learningSkills.includes(skill)
                          return (
                            <span key={skill}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${hasMastered ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : hasLearning ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                              {hasMastered ? '✓' : hasLearning ? '~' : '○'} {skill}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right — Match Score + CTA */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0">
                    <MatchBadge score={(opp as any).matchScore} />
                    <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
                      Apply Now <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
