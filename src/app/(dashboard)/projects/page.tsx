'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Rocket, ThumbsUp, Plus, Mail, Users, Filter,
  Sparkles, CheckCircle2, ArrowUpRight, X, User
} from 'lucide-react'

interface StartupIdea {
  id: string
  user_id: string
  author_name: string
  title: string
  tagline: string
  description: string
  stage: 'idea' | 'prototype' | 'mvp' | 'beta'
  roles_needed: string[]
  contact_email: string
  upvotes: number
  created_at: string
}

const STAGE_CONFIG = {
  idea:      { label: 'Idea Stage',   bg: 'bg-amber-100 border-amber-200 text-amber-800' },
  prototype: { label: 'Prototype',    bg: 'bg-sky-100 border-sky-200 text-sky-800' },
  mvp:       { label: 'MVP Ready',    bg: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
  beta:      { label: 'Live Beta',    bg: 'bg-purple-100 border-purple-200 text-purple-800' },
}

export default function StartupScoutPage() {
  const supabase = createClient()
  const [ideas, setIdeas] = useState<StartupIdea[]>([])
  const [userVotedIds, setUserVotedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [authorName, setAuthorName] = useState('Anonymous')
  const [loading, setLoading] = useState(true)

  // Filter state
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStage, setFormStage] = useState<'idea' | 'prototype' | 'mvp' | 'beta'>('idea')
  const [formRoles, setFormRoles] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: profile } = await supabase.from('profiles').select('full_name,email').eq('id', user.id).single()
        if (profile) {
          setAuthorName(profile.full_name || 'Student Founder')
          setFormEmail(profile.email || '')
        }
        const { data: votes } = await supabase.from('startup_votes').select('startup_id').eq('user_id', user.id)
        if (votes) setUserVotedIds(new Set(votes.map(v => v.startup_id)))
      }

      const { data: fetchedIdeas } = await supabase.from('startup_ideas').select('*').order('upvotes', { ascending: false })
      if (fetchedIdeas) setIdeas(fetchedIdeas)
      setLoading(false)
    }
    load()
  }, [])

  const handleVote = async (idea: StartupIdea) => {
    if (!userId) return
    const hasVoted = userVotedIds.has(idea.id)

    if (hasVoted) {
      await supabase.from('startup_votes').delete().eq('user_id', userId).eq('startup_id', idea.id)
      const newUpvotes = Math.max(0, idea.upvotes - 1)
      await supabase.from('startup_ideas').update({ upvotes: newUpvotes }).eq('id', idea.id)

      setUserVotedIds(prev => {
        const next = new Set(prev)
        next.delete(idea.id)
        return next
      })
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, upvotes: newUpvotes } : i))
    } else {
      await supabase.from('startup_votes').insert({ user_id: userId, startup_id: idea.id })
      const newUpvotes = idea.upvotes + 1
      await supabase.from('startup_ideas').update({ upvotes: newUpvotes }).eq('id', idea.id)

      setUserVotedIds(prev => new Set([...prev, idea.id]))
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, upvotes: newUpvotes } : i))
    }
  }

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSubmitting(true)

    const rolesArray = formRoles.split(',').map(r => r.trim()).filter(Boolean)
    const newIdea = {
      user_id: userId,
      author_name: authorName,
      title: formTitle,
      tagline: formTagline,
      description: formDesc,
      stage: formStage,
      roles_needed: rolesArray,
      contact_email: formEmail,
      upvotes: 1
    }

    const { data, error } = await supabase.from('startup_ideas').insert(newIdea).select().single()

    if (!error && data) {
      setIdeas(prev => [data, ...prev])
      setShowModal(false)
      setFormTitle('')
      setFormTagline('')
      setFormDesc('')
      setFormRoles('')
    }
    setSubmitting(false)
  }

  const filteredIdeas = ideas.filter(idea => {
    if (stageFilter !== 'all' && idea.stage !== stageFilter) return false
    if (roleFilter !== 'all' && !idea.roles_needed.some(r => r.toLowerCase() === roleFilter.toLowerCase())) return false
    return true
  })

  const allRoles = Array.from(new Set(ideas.flatMap(i => i.roles_needed)))

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 text-slate-900">

      {/* Header & CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2 tracking-tight">
            <Rocket className="text-sky-600" size={28} /> Startup Scout
          </h1>
          <p className="text-slate-500 font-semibold text-sm">Post campus startup ideas, pitch to peers, and recruit technical co-founders.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={16} /> Pitch Your Startup
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-extrabold uppercase">STAGE:</span>
          {(['all', 'idea', 'prototype', 'mvp', 'beta'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                stageFilter === st ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All Stages' : st}
            </button>
          ))}
        </div>

        {allRoles.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Users size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-extrabold uppercase">ROLE NEEDED:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Roles</option>
              {allRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="text-center text-slate-400 font-bold py-16">Loading campus startups...</div>
      ) : filteredIdeas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 font-medium shadow-sm">
          No startup ideas match your selected filters. Be the first to pitch one!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIdeas.map(idea => {
            const hasVoted = userVotedIds.has(idea.id)
            const stageInfo = STAGE_CONFIG[idea.stage]

            return (
              <div
                key={idea.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start shadow-sm"
              >
                {/* Left: Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${stageInfo.bg}`}>
                      {stageInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <User size={12} /> {idea.author_name}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{idea.title}</h3>
                    <p className="text-xs text-sky-700 font-bold leading-snug">{idea.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{idea.description}</p>

                  {/* Roles Needed */}
                  {idea.roles_needed.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Users size={12} /> RECRUITING:
                      </span>
                      {idea.roles_needed.map(r => (
                        <span key={r} className="text-xs px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Upvotes & Contact */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleVote(idea)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      hasVoted
                        ? 'bg-sky-600 border-sky-500 text-white shadow-sm font-extrabold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp size={14} className={hasVoted ? 'fill-white' : ''} />
                    <span>{idea.upvotes}</span>
                  </button>

                  <a
                    href={`mailto:${idea.contact_email}?subject=Interested%20in%20joining%20${encodeURIComponent(idea.title)}`}
                    className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white text-xs font-extrabold px-4 py-2.5 rounded-2xl transition-all shadow-sm"
                  >
                    <Mail size={13} /> Join Team <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* PITCH MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-sky-600" /> Pitch Your Campus Startup
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Startup Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EduSynth AI"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">One-line Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-powered lecture summariser for B.Tech students."
                  value={formTagline}
                  onChange={e => setFormTagline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the problem, your solution, and what you are building..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Development Stage *</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="idea">Idea Stage</option>
                    <option value="prototype">Prototype</option>
                    <option value="mvp">MVP Ready</option>
                    <option value="beta">Live Beta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roles Needed (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Dev, ML Engineer, UI/UX Designer"
                  value={formRoles}
                  onChange={e => setFormRoles(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-extrabold py-3 rounded-2xl transition-all shadow-md"
                >
                  {submitting ? 'Publishing...' : 'Publish Pitch 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
