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

  const basePct = Math.round((earned / max) * 85)
  const finalScore = Math.min(100, basePct + interestBonus)

  if (reasons.length === 0) {
    reasons.push('General engineering opportunity')
  }

  return { score: finalScore, reasons }
}

const TYPE_CONFIG = {
  internship: { label: 'Internship', icon: Briefcase, bg: 'bg-sky-100 text-sky-700 border-sky-200' },
  job:        { label: 'Full-Time Job', icon: Code2, bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  hackathon:  { label: 'Hackathon', icon: Trophy, bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  event:      { label: 'Tech Event', icon: Calendar, bg: 'bg-purple-100 text-purple-700 border-purple-200' },
}

export default function OpportunitiesPage() {
  const supabase = createClient()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    mastered_skills: [], learning_skills: [], interests: [], career_goal: '', branch: '', semester: 1
  })
  const [loading, setLoading] = useState(true)
  const [fetchingLive, setFetchingLive] = useState(false)
  const [liveCount, setLiveCount] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [minMatch, setMinMatch] = useState<number>(0)
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('mastered_skills,learning_skills,interests,career_goal,branch,semester').eq('id', user.id).single()
        if (p) {
          setUserProfile({
            mastered_skills: p.mastered_skills || [],
            learning_skills: p.learning_skills || [],
            interests: p.interests || [],
            career_goal: p.career_goal || '',
            branch: p.branch || 'CSE',
            semester: p.semester || 1,
          })
        }
      }

      const { data: opps } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false })
      if (opps && opps.length > 0) setOpportunities(opps)
      setLoading(false)
    }
    loadData()
  }, [])

  const fetchLiveWebFeed = async () => {
    setFetchingLive(true)
    try {
      const res = await fetch('/api/opportunities/fetch-live')
      const json = await res.json()
      if (json.opportunities && json.opportunities.length > 0) {
        setLiveCount(json.count)
        setOpportunities(prev => {
          const ids = new Set(prev.map(o => o.id))
          const newItems = json.opportunities.filter((o: any) => !ids.has(o.id))
          return [...newItems, ...prev]
        })
      }
    } catch (e) {
      console.error('Failed to fetch live opportunities', e)
    }
    setFetchingLive(false)
  }

  const scoredOpps = useMemo(() => {
    return opportunities.map(opp => {
      const { score, reasons } = calculateMatchScore(opp, userProfile)
      return { ...opp, matchScore: score, matchReasons: reasons }
    })
  }, [opportunities, userProfile])

  const processed = useMemo(() => {
    return scoredOpps
      .filter(opp => {
        if (typeFilter !== 'all' && opp.type !== typeFilter) return false
        if (remoteOnly && !opp.is_remote) return false
        if (opp.matchScore < minMatch) return false
        if (search) {
          const q = search.toLowerCase()
          return opp.title.toLowerCase().includes(q) ||
            opp.company.toLowerCase().includes(q) ||
            opp.description.toLowerCase().includes(q) ||
            opp.required_skills.some(s => s.toLowerCase().includes(q))
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore
        return new Date(b.posted_at || 0).getTime() - new Date(a.posted_at || 0).getTime()
      })
  }, [scoredOpps, search, typeFilter, minMatch, remoteOnly, sortBy])

  const stats = useMemo(() => ({
    total: opportunities.length,
    high: scoredOpps.filter(o => o.matchScore >= 80).length,
    medium: scoredOpps.filter(o => o.matchScore >= 50 && o.matchScore < 80).length,
    liveCount: opportunities.filter(o => o.is_live_feed).length,
  }), [opportunities, scoredOpps])

  const hasNoProfile = !userProfile.mastered_skills.length && !userProfile.learning_skills.length

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500 text-slate-900">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase size={28} className="text-sky-600" /> Career & Internship Opportunities
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Real-time internships, hackathons & entry-level engineering roles matched with your skills.
          </p>
        </div>

        <button
          onClick={fetchLiveWebFeed}
          disabled={fetchingLive}
          className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <RefreshCw size={14} className={fetchingLive ? 'animate-spin' : ''} />
          {fetchingLive ? 'Fetching Web Feed...' : 'Sync Live Jobs Feed'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm">
          <p className="text-2xl font-black text-emerald-600">{stats.high}</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Strong Match 80%+</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm">
          <p className="text-2xl font-black text-amber-600">{stats.medium}</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Good Match 50-79%</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm">
          <p className="text-2xl font-black text-purple-600">{stats.liveCount}</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Live Web Feed Items</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm">
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Total Showing</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search role, company, keyword..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-slate-400" />
          {(['all', 'internship', 'job', 'hackathon', 'event'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${typeFilter === t ? 'bg-sky-600 text-white font-extrabold shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
          <button onClick={() => setRemoteOnly(!remoteOnly)}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${remoteOnly ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
            <Wifi size={11} /> Remote
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-slate-400 font-bold py-16">Loading opportunities...</div>
      ) : (
        <div className="space-y-4">
          {processed.map(opp => {
            const { icon: TypeIcon, bg } = TYPE_CONFIG[opp.type] || TYPE_CONFIG.job
            const isExpanded = expandedId === opp.id
            return (
              <div key={opp.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-md transition-all shadow-sm">
                <div className="p-6">
                  <div className="flex gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${bg}`}>
                          <TypeIcon size={11} /> {TYPE_CONFIG[opp.type]?.label || 'Job'}
                        </span>
                        {opp.is_live_feed && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full border bg-purple-100 border-purple-200 text-purple-700 flex items-center gap-1">
                            <Radio size={11} className="animate-pulse text-purple-600" /> LIVE API
                          </span>
                        )}
                        {opp.is_remote && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800">
                            🏠 Remote
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{opp.title}</h3>
                      <p className="text-xs text-slate-600 font-bold mb-3">{opp.company} • {opp.location}</p>

                      <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500 mb-4">
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">{opp.stipend_or_salary}</span>
                        {opp.deadline && <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">Deadline: {opp.deadline}</span>}
                      </div>

                      {/* Required Skills */}
                      <div className="flex flex-wrap gap-1.5">
                        {opp.required_skills.map((s, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="text-right">
                        <div className={`text-xl font-black ${opp.matchScore >= 80 ? 'text-emerald-600' : opp.matchScore >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                          {opp.matchScore}%
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">AI MATCH</span>
                      </div>

                      <a
                        href={opp.apply_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        Apply <ExternalLink size={13} />
                      </a>
                    </div>
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
