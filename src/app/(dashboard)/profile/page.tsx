'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  User, Mail, Shield, Bell, Lock, Globe, Link as LinkIcon,
  Camera, Save, CheckCircle2, Flame, Star, Award, Sparkles, BookOpen
} from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'social'>('profile')

  const [profile, setProfile] = useState<{
    id: string
    full_name: string
    email: string
    university: string
    branch: string
    semester: number
    bio: string
    career_goal: string
    github_url: string
    linkedin_url: string
    portfolio_url: string
    mastered_skills: string[]
    learning_skills: string[]
    interests: string[]
    subscription_tier: string
    xp: number
    streak: number
  } | null>(null)

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [branch, setBranch] = useState('CSE')
  const [semester, setSemester] = useState(1)
  const [bio, setBio] = useState('')
  const [careerGoal, setCareerGoal] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [masteredInput, setMasteredInput] = useState('')
  const [learningInput, setLearningInput] = useState('')
  const [interestsInput, setInterestsInput] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) {
          setProfile(p)
          setFullName(p.full_name || '')
          setUniversity(p.university || '')
          setBranch(p.branch || 'CSE')
          setSemester(p.semester || 1)
          setBio(p.bio || '')
          setCareerGoal(p.career_goal || '')
          setGithubUrl(p.github_url || '')
          setLinkedinUrl(p.linkedin_url || '')
          setPortfolioUrl(p.portfolio_url || '')
          
          // CRITICAL FIX: Only join array if array exists, never overwrite saved skills with hardcoded fallbacks
          setMasteredInput(Array.isArray(p.mastered_skills) ? p.mastered_skills.join(', ') : '')
          setLearningInput(Array.isArray(p.learning_skills) ? p.learning_skills.join(', ') : '')
          setInterestsInput(Array.isArray(p.interests) ? p.interests.join(', ') : '')
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setSaveSuccess(false)

    const masteredArray = masteredInput.split(',').map(s => s.trim()).filter(Boolean)
    const learningArray = learningInput.split(',').map(s => s.trim()).filter(Boolean)
    const interestsArray = interestsInput.split(',').map(s => s.trim()).filter(Boolean)

    const updateData: any = {
      full_name: fullName,
      branch,
      semester: Number(semester),
      career_goal: careerGoal,
      mastered_skills: masteredArray,
      learning_skills: learningArray,
      interests: interestsArray,
    }

    // Attempt full update with optional columns
    let { error } = await supabase.from('profiles').update({
      ...updateData,
      university,
      bio,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
    }).eq('id', profile.id)

    // Fallback if schema lacks optional columns (like bio, university, social links)
    if (error && error.message.includes('column')) {
      const fallbackRes = await supabase.from('profiles').update(updateData).eq('id', profile.id)
      error = fallbackRes.error
    }

    if (!error) {
      setProfile(prev => prev ? {
        ...prev,
        full_name: fullName,
        university,
        branch,
        semester: Number(semester),
        bio,
        career_goal: careerGoal,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        mastered_skills: masteredArray,
        learning_skills: learningArray,
        interests: interestsArray
      } : null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    } else {
      alert('Error updating profile: ' + error.message)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center text-gray-500 py-16">Loading your profile...</div>
  }

  const isPro = profile?.subscription_tier === 'pro'

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Student OS Identity & Profile</h1>
          <p className="text-slate-500 font-semibold text-sm">All learning, opportunity matching, and AI recommendations link directly to this profile.</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-sm">
            <Flame className="text-amber-500" size={18} />
            <div>
              <p className="text-[9px] font-extrabold text-amber-600 uppercase">Streak</p>
              <p className="font-black text-slate-900 text-sm">{profile?.streak || 0}d</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-sm">
            <Star className="text-emerald-600 fill-emerald-600" size={18} />
            <div>
              <p className="text-[9px] font-extrabold text-emerald-700 uppercase">XP</p>
              <p className="font-black text-slate-900 text-sm">{profile?.xp || 0}</p>
            </div>
          </div>

          <div className={`bg-white border border-slate-200/80 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-sm ${
            isPro ? 'text-amber-700' : 'text-slate-500'
          }`}>
            <Award size={18} className={isPro ? 'text-amber-600' : 'text-slate-400'} />
            <div>
              <p className="text-[9px] font-extrabold uppercase">Plan</p>
              <p className="font-black text-slate-900 text-sm uppercase">{profile?.subscription_tier || 'PRO'}</p>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} /> Saved to Database! Opportunity Matchmaker & Learning Hub are now updated with your new skills.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', name: 'Public Info', icon: User },
            { id: 'skills', name: 'Skills & Career', icon: Sparkles },
            { id: 'social', name: 'Social Links', icon: LinkIcon },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} /> {tab.name}
              </button>
            )
          })}
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-sm">

            {/* TAB 1: PUBLIC INFO */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={profile?.email || ''}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">University / College Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University / IIT Hyderabad"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Branch</label>
                    <select
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      {['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Data Science', 'Mechanical', 'Civil'].map(b => (
                        <option key={b} value={b} className="bg-[#111118]">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Semester</label>
                    <select
                      value={semester}
                      onChange={e => setSemester(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s} className="bg-[#111118]">Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS & CAREER */}
            {activeTab === 'skills' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-white mb-1">Skills & Matchmaker Calibration</h3>
                <p className="text-xs text-gray-400 mb-4">These skills drive your Opportunity Matchmaker score, AI Resume Analysis, and Visual Roadmap unlocks.</p>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Target Career Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. SDE-1 at Top Product Company"
                    value={careerGoal}
                    onChange={e => setCareerGoal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Mastered Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, React, JavaScript, SQL, DSA"
                    value={masteredInput}
                    onChange={e => setMasteredInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Currently Learning Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js, Next.js, Docker, Machine Learning"
                    value={learningInput}
                    onChange={e => setLearningInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Tech Interests & Domains (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, AI/ML, Startups, Cloud"
                    value={interestsInput}
                    onChange={e => setInterestsInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL LINKS */}
            {activeTab === 'social' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-white mb-4">Portfolio & Social Profiles</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">GitHub Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Personal Portfolio / Website</label>
                  <input
                    type="text"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Save size={15} /> {saving ? 'Saving to Database...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
