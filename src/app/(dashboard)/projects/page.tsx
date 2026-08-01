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
  idea:      { label: 'Idea Stage',   bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400' },
  prototype: { label: 'Prototype',    bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400' },
  mvp:       { label: 'MVP Ready',    bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' },
  beta:      { label: 'Live Beta',    bg: 'bg-purple-500/10 border-purple-500/25 text-purple-400' },
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

  // Load user + data
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
        // Load user votes
        const { data: votes } = await supabase.from('startup_votes').select('startup_id').eq('user_id', user.id)
        if (votes) setUserVotedIds(new Set(votes.map(v => v.startup_id)))
      }

      const { data: fetchedIdeas } = await supabase.from('startup_ideas').select('*').order('upvotes', { ascending: false })
      if (fetchedIdeas) setIdeas(fetchedIdeas)
      setLoading(false)
    }
    load()
  }, [])

  // Upvote / Downvote Handler
  const handleVote = async (idea: StartupIdea) => {
    if (!userId) return
    const hasVoted = userVotedIds.has(idea.id)

    if (hasVoted) {
      // Remove vote
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
      // Add vote
      await supabase.from('startup_votes').insert({ user_id: userId, startup_id: idea.id })
      const newUpvotes = idea.upvotes + 1
      await supabase.from('startup_ideas').update({ upvotes: newUpvotes }).eq('id', idea.id)

      setUserVotedIds(prev => new Set([...prev, idea.id]))
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, upvotes: newUpvotes } : i))
    }
  }

  // Create Startup Post
  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !formTitle || !formTagline || !formDesc || !formEmail) return

    setSubmitting(true)
    const rolesArray = formRoles.split(',').map(r => r.trim()).filter(Boolean)

    const { data: newIdea, error } = await supabase.from('startup_ideas').insert({
      user_id: userId,
      author_name: authorName,
      title: formTitle,
      tagline: formTagline,
      description: formDesc,
      stage: formStage,
      roles_needed: rolesArray.length > 0 ? rolesArray : ['Co-founder'],
      contact_email: formEmail,
      upvotes: 1
    }).select().single()

    if (!error && newIdea) {
      // Auto-vote on own creation
      await supabase.from('startup_votes').insert({ user_id: userId, startup_id: newIdea.id })
      setUserVotedIds(prev => new Set([...prev, newIdea.id]))
      setIdeas(prev => [newIdea, ...prev])
      setShowModal(false)

      // Reset form
      setFormTitle('')
      setFormTagline('')
      setFormDesc('')
      setFormRoles('')
    }
    setSubmitting(false)
  }

  // Filter logic
  const filteredIdeas = ideas.filter(idea => {
    if (stageFilter !== 'all' && idea.stage !== stageFilter) return false
    if (roleFilter !== 'all' && !idea.roles_needed.some(r => r.toLowerCase().includes(roleFilter.toLowerCase()))) return false
    return true
  })

  // Extract all unique roles needed
  const allRoles = Array.from(new Set(ideas.flatMap(i => i.roles_needed)))

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">

      {/* Header & CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Rocket className="text-indigo-400" size={24} /> Startup Scout
          </h1>
          <p className="text-gray-500 text-sm">Post campus startup ideas, pitch to peers, and recruit technical co-founders.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} /> Pitch Your Startup
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 font-semibold">Stage:</span>
          {(['all', 'idea', 'prototype', 'mvp', 'beta'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                stageFilter === st ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Stages' : st}
            </button>
          ))}
        </div>

        {allRoles.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Users size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 font-semibold">Role Needed:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="all" className="bg-[#111118]">All Roles</option>
              {allRoles.map(r => (
                <option key={r} value={r} className="bg-[#111118]">{r}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading campus startups...</div>
      ) : filteredIdeas.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
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
                className="bg-[#111118] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col md:flex-row gap-6 justify-between items-start"
              >
                {/* Left: Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stageInfo.bg}`}>
                      {stageInfo.label}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <User size={12} /> {idea.author_name}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{idea.title}</h3>
                    <p className="text-sm text-indigo-400 font-semibold leading-snug">{idea.tagline}</p>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{idea.description}</p>

                  {/* Roles Needed */}
                  {idea.roles_needed.length > 0 && (
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Users size={12} /> Recruiting:
                      </span>
                      {idea.roles_needed.map(r => (
                        <span key={r} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Upvotes & Contact */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* Upvote Button */}
                  <button
                    onClick={() => handleVote(idea)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      hasVoted
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-indigo-500 hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={14} className={hasVoted ? 'fill-white' : ''} />
                    <span>{idea.upvotes}</span>
                  </button>

                  {/* Contact Founder CTA */}
                  <a
                    href={`mailto:${idea.contact_email}?subject=Interested%20in%20joining%20${encodeURIComponent(idea.title)}`}
                    className="flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" /> Pitch Your Campus Startup
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Startup Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EduSynth AI"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">One-line Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-powered lecture summariser for B.Tech students."
                  value={formTagline}
                  onChange={e => setFormTagline(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the problem, your solution, and what you are building..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Development Stage *</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="idea" className="bg-[#111118]">Idea Stage</option>
                    <option value="prototype" className="bg-[#111118]">Prototype</option>
                    <option value="mvp" className="bg-[#111118]">MVP Ready</option>
                    <option value="beta" className="bg-[#111118]">Live Beta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Roles Needed (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Dev, ML Engineer, UI/UX Designer"
                  value={formRoles}
                  onChange={e => setFormRoles(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
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
