'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import {
  Briefcase, Code2, Trophy, Calendar, ExternalLink,
  Filter, Search, RefreshCw, Radio, Globe
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
      reasons.push(`Matches ${skill}`)
    } else if (learning_skills.some(s => s.toLowerCase() === normSkill)) {
      earned += 0.4
      reasons.push(`Learning ${skill}`)
    }
  })

  let interestBonus = 0
  const allTags = [...tags, opp.type, opp.company.toLowerCase()]
  interests.forEach(interest => {
    if (allTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
        opp.title.toLowerCase().includes(interest.toLowerCase())) {
      if (interestBonus < 15) {
        interestBonus += 5
        reasons.push(`Matches interest: ${interest}`)
      }
    }
  })

  const basePct = Math.round((earned / max) * 85)
  const finalScore = Math.min(100, basePct + interestBonus)

  if (reasons.length === 0) {
    reasons.push('General engineering listing')
  }

  return { score: finalScore, reasons }
}

const TYPE_CONFIG = {
  internship: { label: 'Internship', icon: Briefcase },
  job:        { label: 'Full-Time', icon: Code2 },
  hackathon:  { label: 'Hackathon', icon: Trophy },
  event:      { label: 'Event', icon: Calendar },
}

export default function OpportunitiesPage() {
  const { isDark } = useTheme()
  const supabase = createClient()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    mastered_skills: [], learning_skills: [], interests: [], career_goal: '', branch: '', semester: 1
  })
  const [loading, setLoading] = useState(true)
  const [fetchingLive, setFetchingLive] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [minMatch] = useState<number>(0)
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy] = useState<'match' | 'recent'>('match')

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

  const card = isDark
    ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl'
    : 'bg-white border border-zinc-200 text-zinc-900 rounded-xl shadow-sm'

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Career & Internship Opportunities
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Curated listings matched against your current semester skills and interests.
          </p>
        </div>

        <button
          onClick={fetchLiveWebFeed}
          disabled={fetchingLive}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <RefreshCw size={14} className={fetchingLive ? 'animate-spin' : ''} />
          {fetchingLive ? 'Updating feed...' : 'Sync Live Feed'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${card} p-4`}>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Strong Fit (80%+)</div>
          <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{stats.high}</div>
        </div>
        <div className={`${card} p-4`}>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Moderate Fit (50-79%)</div>
          <div className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{stats.medium}</div>
        </div>
        <div className={`${card} p-4`}>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Live Feed Listings</div>
          <div className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{stats.liveCount}</div>
        </div>
        <div className={`${card} p-4`}>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Available</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} p-4 space-y-3`}>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by role, company, or required skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full rounded-lg pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors border ${
              isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
            }`}
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-zinc-400 mr-1" />
          {(['all', 'internship', 'job', 'hackathon', 'event'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                typeFilter === t
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isDark
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {t === 'all' ? 'All Roles' : t}
            </button>
          ))}
          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              remoteOnly
                ? 'bg-blue-600 border-blue-600 text-white'
                : isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Globe size={12} /> Remote only
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-xs text-zinc-400 font-medium py-16">Loading opportunities...</div>
      ) : (
        <div className="space-y-3">
          {processed.map(opp => {
            const config = TYPE_CONFIG[opp.type] || TYPE_CONFIG.job
            const TypeIcon = config.icon

            return (
              <div key={opp.id} className={`${card} p-5 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors duration-150`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded border inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                        <TypeIcon size={12} /> {config.label}
                      </span>
                      {opp.is_live_feed && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded border inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                          <Radio size={11} className="text-blue-500" /> Live Feed
                        </span>
                      )}
                      {opp.is_remote && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded border inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                          <Globe size={11} /> Remote
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold leading-tight">{opp.title}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{opp.company} · {opp.location}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="text-emerald-700 dark:text-emerald-400">{opp.stipend_or_salary}</span>
                      {opp.deadline && (
                        <span className="text-zinc-500 dark:text-zinc-400">· Deadline: {opp.deadline}</span>
                      )}
                    </div>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.required_skills.map((s, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                    <div className="text-left sm:text-right">
                      <div className={`text-lg font-semibold ${
                        opp.matchScore >= 80 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {opp.matchScore}%
                      </div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide">Skill Match</span>
                    </div>

                    <a
                      href={opp.apply_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors"
                    >
                      Apply <ExternalLink size={12} />
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
