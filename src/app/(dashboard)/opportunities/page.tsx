'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Briefcase, Code2, Trophy, Calendar, MapPin, ExternalLink,
  Star, Filter, Search, Zap, CheckCircle2, Clock, Wifi,
  User, AlertCircle, TrendingUp, RefreshCw, Radio
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
  is_live_feed?: boolean
  posted_at: string
}

interface UserProfile {
  mastered_skills: string[]
  learning_skills: string[]
  interests: string[]
  career_goal: string
  branch: string
  semester: number
}

function calculateMatchScore(opp: Opportunity, profile: UserProfile): { score: number; reasons: string[] } {
  const { required_skills, tags } = opp
  const { mastered_skills, learning_skills, interests } = profile
  const reasons: string[] = []

  if (!required_skills.length) {
    return { score: 100, reasons: ['Open to all skill levels'] }
  }

  let earned = 0
  let max = required_skills.length

  required_skills.forEach(skill => {
    const normSkill = skill.toLowerCase()
    if (mastered_skills.some(s => s.toLowerCase() === normSkill)) {
      earned += 1.0
      reasons.push(`✓ You know ${skill}`)
    } else if (learning_skills.some(s => s.toLowerCase() === normSkill)) {
      earned += 0.4
      reasons.push(`~ Learning ${skill}`)
    }
  })

  let interestBonus = 0
  const allTags = [...tags, opp.type, opp.company.toLowerCase()]
  interests.forEach(interest => {
    if (allTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
        opp.title.toLowerCase().includes(interest.toLowerCase())) {
      if (interestBonus < 15) {
        interestBonus += 5
        reasons.push(`🎯 Matches interest in ${interest}`)
      }
    }
  })

  const baseScore = max > 0 ? Math.round((earned / max) * 100) : 100
  const finalScore = Math.min(100, baseScore + interestBonus)

  return { score: finalScore, reasons }
}

const TYPE_CONFIG = {
  job:        { label: 'Job',        icon: Briefcase, bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400' },
  internship: { label: 'Internship', icon: Code2,     bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' },
  hackathon:  { label: 'Hackathon',  icon: Trophy,    bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400' },
  event:      { label: 'Event',      icon: Calendar,  bg: 'bg-purple-500/10 border-purple-500/25 text-purple-400' },
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : score >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-gray-500 bg-white/5 border-white/10'
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${color}`}>
      <Zap size={12} />{score}% Match
    </div>
  )
}

export default function OpportunitiesPage() {
  const supabase = createClient()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [profile, setProfile] = useState<UserProfile>({
    mastered_skills: [], learning_skills: [], interests: [],
    career_goal: '', branch: 'CSE', semester: 1
  })
  const [loading, setLoading] = useState(true)
  const [syncingLive, setSyncingLive] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [minMatch, setMinMatch] = useState(0)
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match')

  // Load database opportunities
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles')
          .select('mastered_skills,learning_skills,interests,career_goal,branch,semester')
          .eq('id', user.id).single()
        if (data) setProfile(data as UserProfile)
      }
      const { data: opps } = await supabase.from('opportunities').select('*').order('posted_at', { ascending: false })
      if (opps) setOpportunities(opps)
      setLoading(false)
    }
    load()
  }, [])

  // Sync Live API Feed
  const syncLiveFeed = async () => {
    setSyncingLive(true)
    try {
      const res = await fetch('/api/opportunities/fetch-live')
      const data = await res.json()
      if (data.success && data.listings.length > 0) {
        setOpportunities(prev => {
          const existingIds = new Set(prev.map(o => o.id))
          const newUnique = data.listings.filter((l: any) => !existingIds.has(l.id))
          return [...newUnique, ...prev]
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSyncingLive(false)
    }
  }

  const processed = useMemo(() => {
    return opportunities
      .map(opp => ({ ...opp, ...calculateMatchScore(opp, profile) }))
      .filter(opp => {
        if (typeFilter !== 'all' && opp.type !== typeFilter) return false
        if (remoteOnly && !opp.is_remote) return false
        if (opp.score < minMatch) return false
        if (search && !`${opp.title} ${opp.company} ${opp.description}`.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => sortBy === 'match'
        ? b.score - a.score
        : new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      )
  }, [opportunities, profile, typeFilter, remoteOnly, minMatch, search, sortBy])

  const hasNoProfile = profile.mastered_skills.length === 0 && profile.interests.length === 0

  const stats = useMemo(() => ({
    high: processed.filter(o => o.score >= 80).length,
    medium: processed.filter(o => o.score >= 50 && o.score < 80).length,
    total: processed.length,
    liveCount: processed.filter(o => o.is_live_feed).length
  }), [processed])

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">

      {/* Header & Live Sync CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Briefcase className="text-indigo-400" size={24} /> Opportunity Matchmaker
          </h1>
          <p className="text-gray-500 text-sm">
            AI-matched against your skills + live tech API feeds.
          </p>
        </div>

        <button
          onClick={syncLiveFeed}
          disabled={syncingLive}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Radio size={14} className={syncingLive ? 'animate-pulse' : ''} />
          {syncingLive ? 'Syncing Live API...' : 'Sync Live Web Jobs'}
        </button>
      </div>

      {/* Profile Warning */}
      {hasNoProfile && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 text-sm font-bold mb-1">Your profile has no skills or interests set.</p>
            <p className="text-amber-400/70 text-xs">Match scores will be 0%. Go to <a href="/settings" className="underline">Settings</a> to add your skills and calibrate the AI engine.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111118] border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.high}</p>
          <p className="text-xs text-gray-500 mt-1">Strong Match 80%+</p>
        </div>
        <div className="bg-[#111118] border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
          <p className="text-xs text-gray-500 mt-1">Good Match 50-79%</p>
        </div>
        <div className="bg-[#111118] border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.liveCount}</p>
          <p className="text-xs text-gray-500 mt-1">Live Web Feed Items</p>
        </div>
        <div className="bg-[#111118] border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Showing</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search role, company, keyword..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-gray-500" />
          {(['all', 'internship', 'job', 'hackathon', 'event'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
          <button onClick={() => setRemoteOnly(!remoteOnly)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${remoteOnly ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            <Wifi size={11} /> Remote
          </button>
          <span className="text-xs text-gray-600">Min Match:</span>
          {[0, 50, 70, 90].map(m => (
            <button key={m} onClick={() => setMinMatch(m)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${minMatch === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {m === 0 ? 'Any' : `${m}%+`}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {(['match', 'recent'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${sortBy === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                {s === 'match' ? 'Best Match' : 'Recent'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading opportunities...</div>
      ) : (
        <div className="space-y-3">
          {processed.map(opp => {
            const { icon: TypeIcon, bg } = TYPE_CONFIG[opp.type] || TYPE_CONFIG.job
            const isExpanded = expandedId === opp.id
            return (
              <div key={opp.id} className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className="p-5">
                  <div className="flex gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${bg}`}>
                          <TypeIcon size={11} /> {TYPE_CONFIG[opp.type]?.label || 'Job'}
                        </span>
                        {opp.is_live_feed && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/25 text-purple-400 flex items-center gap-1">
                            <Radio size={11} className="animate-pulse" /> LIVE API
                          </span>
                        )}
                        {opp.is_remote && <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/25 text-emerald-400 flex items-center gap-1"><Wifi size={11} /> Remote</span>}
                        {opp.is_verified && <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/25 text-blue-400 flex items-center gap-1"><CheckCircle2 size={11} /> Verified</span>}
                        {opp.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500">{tag}</span>
                        ))}
                      </div>

                      <h3 className="text-base font-bold text-white mb-0.5">{opp.title}</h3>
                      <p className="text-sm text-indigo-400 font-semibold mb-3">{opp.company}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={11} />{opp.location}</span>
                        {opp.stipend_or_salary && <span className="flex items-center gap-1"><Star size={11} />{opp.stipend_or_salary}</span>}
                        <span className="flex items-center gap-1"><Clock size={11} />{opp.deadline}</span>
                      </div>

                      {/* Required skills */}
                      {opp.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {opp.required_skills.map(skill => {
                            const normSkill = skill.toLowerCase()
                            const isMastered = profile.mastered_skills.some(s => s.toLowerCase() === normSkill)
                            const isLearning = profile.learning_skills.some(s => s.toLowerCase() === normSkill)
                            return (
                              <span key={skill} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isMastered ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : isLearning ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                {isMastered ? '✓' : isLearning ? '~' : '○'} {skill}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right CTA */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <MatchBadge score={opp.score} />
                      <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
                        Apply <ExternalLink size={12} />
                      </a>
                      <button onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                        className="text-xs text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                        <TrendingUp size={12} /> {isExpanded ? 'Hide' : 'Why I match'}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/5 bg-black/30 px-5 py-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap size={12} className="text-indigo-400" /> Why your score is {opp.score}%
                    </p>
                    <div className="space-y-1.5">
                      {opp.reasons.length > 0
                        ? opp.reasons.map((r, i) => (
                          <p key={i} className="text-xs text-gray-300">{r}</p>
                        ))
                        : <p className="text-xs text-gray-500">None of the required skills match your profile yet.</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
