'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  CreditCard, CheckCircle2, Shield, Zap, Sparkles,
  Award, Lock, User, Save, AlertCircle, RefreshCw
} from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SettingsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<{
    id: string
    full_name: string
    email: string
    branch: string
    semester: number
    career_goal: string
    subscription_tier: string
    xp: number
    mastered_skills: string[]
    learning_skills: string[]
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Profile Form State
  const [fullName, setFullName] = useState('')
  const [branch, setBranch] = useState('CSE')
  const [semester, setSemester] = useState(1)
  const [careerGoal, setCareerGoal] = useState('')
  const [masteredSkills, setMasteredSkills] = useState('')
  const [learningSkills, setLearningSkills] = useState('')

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) {
          setProfile(p)
          setFullName(p.full_name || '')
          setBranch(p.branch || 'CSE')
          setSemester(p.semester || 1)
          setCareerGoal(p.career_goal || '')
          setMasteredSkills((p.mastered_skills || []).join(', '))
          setLearningSkills((p.learning_skills || []).join(', '))
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  // Handle Razorpay Payment Upgrade
  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    if (!profile) return
    setUpgrading(true)

    try {
      // 1. Create order from API
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const order = await res.json()

      // If in Demo / Test Mode without live keys, perform instant test upgrade
      if (order.isDemo || !window.Razorpay) {
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: order.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            userId: profile.id
          }),
        })
        if (verifyRes.ok) {
          setProfile(prev => prev ? { ...prev, subscription_tier: 'pro' } : null)
          alert('🎉 Test Payment Successful! Your account has been upgraded to PRO!')
        }
        setUpgrading(false)
        return
      }

      // 2. Open Real Razorpay Checkout Modal
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Engineer OS Pro',
        description: `${plan === 'annual' ? 'Annual' : 'Monthly'} Subscription Upgrade`,
        order_id: order.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: profile.id
            }),
          })
          if (verifyRes.ok) {
            setProfile(prev => prev ? { ...prev, subscription_tier: 'pro' } : null)
            alert('🎉 Payment Verified! Welcome to Engineer OS Pro!')
          }
        },
        prefill: {
          name: profile.full_name,
          email: profile.email,
        },
        theme: {
          color: '#6366f1',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      alert('Payment failed: ' + err.message)
    } finally {
      setUpgrading(false)
    }
  }

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSavingProfile(true)
    setSaveSuccess(false)

    const masteredArray = masteredSkills.split(',').map(s => s.trim()).filter(Boolean)
    const learningArray = learningSkills.split(',').map(s => s.trim()).filter(Boolean)

    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      branch,
      semester: Number(semester),
      career_goal: careerGoal,
      mastered_skills: masteredArray,
      learning_skills: learningArray,
    }).eq('id', profile.id)

    if (!error) {
      setProfile(prev => prev ? {
        ...prev, full_name: fullName, branch, semester: Number(semester),
        career_goal: careerGoal, mastered_skills: masteredArray, learning_skills: learningArray
      } : null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
    setSavingProfile(false)
  }

  const isPro = profile?.subscription_tier === 'pro'

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">

      {/* Header */}
      <div className="pb-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Account & Billing Settings</h1>
          <p className="text-gray-500 text-sm">Manage your student profile, skills, and subscription plan.</p>
        </div>

        {/* Current Plan Badge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold ${
          isPro ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400'
        }`}>
          {isPro ? <Zap size={15} className="fill-amber-400" /> : <Shield size={15} />}
          <span>CURRENT PLAN: {isPro ? 'PRO UNLOCKED ⚡' : 'FREE TIER'}</span>
        </div>
      </div>

      {/* SECTION 1: MONETIZATION & PRICING CARDS */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <CreditCard className="text-indigo-400" size={20} /> Upgrade Engineer OS Plan
          </h2>
          <p className="text-xs text-gray-500">Unlock all 8 semesters, advanced video courses, career roadmaps & priority recruiting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FREE PLAN CARD */}
          <div className={`bg-[#111118] border rounded-2xl p-6 relative flex flex-col justify-between ${
            !isPro ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' : 'border-white/10 opacity-70'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Free Student Tier</h3>
                  <p className="text-xs text-gray-500">Basic syllabus & community access</p>
                </div>
                <span className="text-xl font-bold text-white">₹0<span className="text-xs text-gray-500 font-normal">/mo</span></span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-gray-400">
                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> CSE Semester 1 Pilot Syllabus</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Opportunity Matchmaker Feed</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Standard Career Roadmaps</p>
                <p className="flex items-center gap-2 text-gray-600"><Lock size={14} className="shrink-0" /> Advanced Semesters 2-8 Content</p>
                <p className="flex items-center gap-2 text-gray-600"><Lock size={14} className="shrink-0" /> Priority Co-founder Matching</p>
              </div>
            </div>

            <div className="mt-6 pt-4">
              <button disabled className="w-full bg-white/5 text-gray-500 text-xs font-bold py-3 rounded-xl cursor-default">
                {!isPro ? 'Active Plan' : 'Downgrade'}
              </button>
            </div>
          </div>

          {/* PRO PLAN CARD (RAZORPAY INTEGRATED) */}
          <div className="bg-gradient-to-b from-indigo-900/30 to-[#111118] border-2 border-indigo-500/50 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl shadow-indigo-500/10">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
              MOST POPULAR ⚡
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Engineer OS Pro <Sparkles size={16} className="text-amber-400" />
                  </h3>
                  <p className="text-xs text-indigo-300">Complete 4-year B.Tech Operating System</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">₹199<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                  <p className="text-[10px] text-amber-400 font-semibold">or ₹1,499/yr (save 37%)</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-gray-300">
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> <b>All 8 Semesters</b> & All Branches Unlocked</p>
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> Premium Embedded Video Lectures & Code Notes</p>
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> Interactive Quizzes + 2x XP Rewards</p>
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> Unlimited Visual Skill-Tree Roadmaps</p>
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> Priority Startup Scout Founder Pitching</p>
                <p className="flex items-center gap-2 font-medium"><CheckCircle2 size={14} className="text-amber-400 shrink-0" /> Verified Pro Badge on Profile & Community</p>
              </div>
            </div>

            <div className="mt-6 pt-4 space-y-2">
              {isPro ? (
                <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> PRO Active — All Features Unlocked!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpgrade('monthly')}
                    disabled={upgrading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {upgrading ? 'Processing...' : 'Pay ₹199 / Month'}
                  </button>
                  <button
                    onClick={() => handleUpgrade('annual')}
                    disabled={upgrading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    {upgrading ? 'Processing...' : 'Pay ₹1,499 / Year'}
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                <Shield size={10} /> Secure checkout powered by Razorpay Payments India
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: EDIT STUDENT PROFILE */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <User className="text-indigo-400" size={20} /> Edit Student Profile
          </h2>
          <p className="text-xs text-gray-500">Update your details to calibrate the Opportunity Matchmaker & syllabus views.</p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Profile changes updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email (Read Only)</label>
              <input
                type="text"
                disabled
                value={profile?.email || ''}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Career Goal</label>
            <input
              type="text"
              placeholder="e.g. SDE at Product Company / AI Startup Founder"
              value={careerGoal}
              onChange={e => setCareerGoal(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mastered Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Python, React, JavaScript, SQL, DSA"
              value={masteredSkills}
              onChange={e => setMasteredSkills(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Learning Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Node.js, Docker, Next.js, Machine Learning"
              value={learningSkills}
              onChange={e => setLearningSkills(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              <Save size={16} /> {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
