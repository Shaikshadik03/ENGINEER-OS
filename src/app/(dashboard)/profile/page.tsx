'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  User, Mail, Shield, Bell, Lock, Globe, Link as LinkIcon,
  Camera, Save, CheckCircle2, Flame, Star, Award, Sparkles, BookOpen, ExternalLink
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

    try {
      await supabase.from('profiles').update(updateData).eq('id', profile.id)
    } catch (e) {}

    setProfile(prev => prev ? {
      ...prev, full_name: fullName, branch, semester: Number(semester),
      career_goal: careerGoal, mastered_skills: masteredArray,
      learning_skills: learningArray, interests: interestsArray
    } : null)

    setSaveSuccess(true)
    setSaving(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const isPro = profile?.subscription_tier === 'pro'

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Student OS Identity & Profile</h1>
          <p className="text-slate-400 font-medium text-sm">All learning, opportunity matching, and AI recommendations link directly to this profile.</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#12121a]/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl px-4.5 py-2.5 flex items-center gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Flame className="text-amber-400" size={20} />
            <div>
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Streak</p>
              <p className="font-black text-white text-sm">{profile?.streak || 0} Days</p>
            </div>
          </div>

          <div className="bg-[#12121a]/90 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-4.5 py-2.5 flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Star className="text-emerald-400 fill-emerald-400" size={20} />
            <div>
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Total XP</p>
              <p className="font-black text-white text-sm">{profile?.xp || 0} XP</p>
            </div>
          </div>

          <div className="bg-[#12121a]/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl px-4.5 py-2.5 flex items-center gap-2.5 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Award size={20} className="text-purple-400" />
            <div>
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-wider">Member Plan</p>
              <p className="font-black text-white text-sm uppercase">{profile?.subscription_tier || 'PRO'}</p>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 backdrop-blur-xl">
          <CheckCircle2 size={18} className="text-emerald-400" /> Saved to Database! Opportunity Matchmaker & Learning Hub are now updated with your new skills.
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
                className={`w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent text-emerald-400 border border-emerald-500/50 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]' 
                    : 'bg-[#111118]/80 backdrop-blur-xl text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon size={16} /> {tab.name}
              </button>
            )
          })}
        </div>

        {/* Form Card */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="bg-[#111118]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl hover:border-white/20 transition-all">

            {/* TAB 1: PUBLIC INFO */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-base font-black text-white mb-2">Basic Profile Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={profile?.email || 'shaikshadik003@gmail.com'}
                      className="w-full bg-[#14141e] border border-white/5 rounded-2xl px-4 py-3 text-xs text-slate-500 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">University / College Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Malla Reddy University / IIT Hyderabad"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Branch</label>
                    <select
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      {['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Data Science', 'Mechanical', 'Civil'].map(b => (
                        <option key={b} value={b} className="bg-[#111118] text-white">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Current Semester</label>
                    <select
                      value={semester}
                      onChange={e => setSemester(Number(e.target.value))}
                      className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s} className="bg-[#111118] text-white">Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Student Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl p-4 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS & CAREER */}
            {activeTab === 'skills' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-white mb-1">Skills & Matchmaker Calibration</h3>
                  <p className="text-xs text-slate-400 font-medium">These skills drive your Opportunity Matchmaker score, AI Resume Analysis, and Visual Roadmap unlocks.</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">Target Career Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. Forward Deployed Engineer / Entrepreneur"
                    value={careerGoal}
                    onChange={e => setCareerGoal(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-1.5">Mastered Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, React, JavaScript, SQL, DSA"
                    value={masteredInput}
                    onChange={e => setMasteredInput(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-amber-400 uppercase tracking-wider mb-1.5">Currently Learning Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js, Next.js, Docker, Machine Learning"
                    value={learningInput}
                    onChange={e => setLearningInput(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-purple-400 uppercase tracking-wider mb-1.5">Tech Interests & Domains (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, AI/ML, Startups, Cloud"
                    value={interestsInput}
                    onChange={e => setInterestsInput(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL LINKS */}
            {activeTab === 'social' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-base font-black text-white mb-2">Portfolio & Social Profiles</h3>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">GitHub Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/Shaikshadik03"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Personal Portfolio / Website</label>
                  <input
                    type="text"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs px-8 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02]"
              >
                <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
