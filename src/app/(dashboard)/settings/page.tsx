'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import {
  CreditCard, CheckCircle2, Shield, Zap, Sparkles,
  Lock, User, Save
} from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SettingsPage() {
  const { isDark } = useTheme()
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

  const [, setLoading] = useState(true)
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
          setMasteredSkills(Array.isArray(p.mastered_skills) ? p.mastered_skills.join(', ') : '')
          setLearningSkills(Array.isArray(p.learning_skills) ? p.learning_skills.join(', ') : '')
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
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const order = await res.json()

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
          color: '#0284c7',
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

  const cardStyle = isDark
    ? 'bg-[#111118]/80 border-white/10 text-white backdrop-blur-xl'
    : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-sm backdrop-blur-xl'

  const inputStyle = isDark
    ? 'bg-[#0d0d12] border-white/10 text-white focus:bg-[#0d0d12]'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'

  return (
    <div className={`max-w-5xl mx-auto pb-16 space-y-10 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>

      {/* Header */}
      <div className={`pb-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div>
          <h1 className={`text-3xl font-black mb-1 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Account & Billing Settings</h1>
          <p className={`font-semibold text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your student profile, skills, and subscription plan.</p>
        </div>

        {/* Current Plan Badge */}
        <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 text-xs font-black shadow-sm ${
          isPro
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : isDark ? 'bg-[#0d0d12] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          {isPro ? <Zap size={16} className="fill-amber-500 text-amber-500" /> : <Shield size={16} />}
          <span>CURRENT PLAN: {isPro ? 'PRO UNLOCKED ⚡' : 'FREE TIER'}</span>
        </div>
      </div>

      {/* SECTION 1: MONETIZATION & PRICING CARDS */}
      <div className="space-y-6">
        <div>
          <h2 className={`text-xl font-black mb-1 flex items-center gap-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CreditCard className="text-sky-500" size={22} /> Upgrade Engineer OS Plan
          </h2>
          <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unlock all 8 semesters, advanced video courses, career roadmaps & priority recruiting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FREE PLAN CARD */}
          <div className={`${cardStyle} rounded-3xl p-6 sm:p-8 flex flex-col justify-between border`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Free Student Tier</h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Basic syllabus & community access</p>
                </div>
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>₹0<span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/mo</span></span>
              </div>

              <div className={`space-y-3 pt-4 border-t text-xs font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> CSE Semester 1 Pilot Syllabus</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> Opportunity Matchmaker Feed</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> Standard Career Roadmaps</p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}><Lock size={15} className="shrink-0" /> Advanced Semesters 2-8 Content</p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}><Lock size={15} className="shrink-0" /> Priority Co-founder Matching</p>
              </div>
            </div>

            <div className="mt-6 pt-4">
              <button disabled className={`w-full text-xs font-bold py-3.5 rounded-2xl cursor-default border ${
                isDark ? 'bg-white/5 text-slate-500 border-white/10' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {!isPro ? 'Active Plan' : 'Downgrade'}
              </button>
            </div>
          </div>

          {/* PRO PLAN CARD (RAZORPAY INTEGRATED) */}
          <div className={`rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between border-2 shadow-md ${
            isDark
              ? 'bg-gradient-to-b from-sky-500/10 to-[#111118] border-sky-500/50 text-white'
              : 'bg-gradient-to-b from-sky-50 to-white border-sky-400 text-slate-900'
          }`}>
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              MOST POPULAR ⚡
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Engineer OS Pro <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                  </h3>
                  <p className={`text-xs font-bold ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>Complete 4-year B.Tech Operating System</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>₹199<span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span></span>
                  <p className="text-[10px] text-amber-500 font-extrabold">or ₹1,499/yr (save 37%)</p>
                </div>
              </div>

              <div className={`space-y-3 pt-4 border-t text-xs font-semibold ${isDark ? 'border-sky-500/20 text-slate-200' : 'border-sky-100 text-slate-700'}`}>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> <b>All 8 Semesters</b> & All Branches Unlocked</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> Premium Embedded Video Lectures & Code Notes</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> Interactive Quizzes + 2x XP Rewards</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> Unlimited Visual Skill-Tree Roadmaps</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> Priority Startup Scout Founder Pitching</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sky-500 shrink-0" /> Verified Pro Badge on Profile & Community</p>
              </div>
            </div>

            <div className="mt-6 pt-4 space-y-2">
              {isPro ? (
                <div className={`w-full text-xs font-extrabold py-3.5 rounded-2xl text-center flex items-center justify-center gap-2 border shadow-sm ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                }`}>
                  <CheckCircle2 size={18} /> PRO Active — All Features Unlocked!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpgrade('monthly')}
                    disabled={upgrading}
                    className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md"
                  >
                    {upgrading ? 'Processing...' : 'Pay ₹199 / Month'}
                  </button>
                  <button
                    onClick={() => handleUpgrade('annual')}
                    disabled={upgrading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md"
                  >
                    {upgrading ? 'Processing...' : 'Pay ₹1,499 / Year'}
                  </button>
                </div>
              )}
              <p className={`text-[10px] font-semibold text-center flex items-center justify-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Shield size={12} /> Secure checkout powered by Razorpay Payments India
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: EDIT STUDENT PROFILE */}
      <div className={`${cardStyle} rounded-3xl p-6 sm:p-8 space-y-6 border`}>
        <div>
          <h2 className={`text-xl font-black mb-1 flex items-center gap-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <User className="text-sky-500" size={22} /> Edit Student Profile
          </h2>
          <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your details to calibrate the Opportunity Matchmaker & syllabus views.</p>
        </div>

        {saveSuccess && (
          <div className={`text-xs font-bold p-4 rounded-2xl flex items-center gap-2 border ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-900'
          }`}>
            <CheckCircle2 size={18} /> Profile changes updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email (Read Only)</label>
              <input
                type="text"
                disabled
                value={profile?.email || 'shaikshadik003@gmail.com'}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-bold cursor-not-allowed border ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Branch</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
              >
                {['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Data Science', 'Mechanical', 'Civil'].map(b => (
                  <option key={b} value={b} className={isDark ? 'bg-[#111118] text-white' : 'bg-white text-slate-900'}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s} className={isDark ? 'bg-[#111118] text-white' : 'bg-white text-slate-900'}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Primary Career Goal</label>
            <input
              type="text"
              placeholder="e.g. Forward Deployed Engineer / Entrepreneur"
              value={careerGoal}
              onChange={e => setCareerGoal(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-emerald-500 uppercase tracking-wider mb-1.5">Mastered Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Python, React, JavaScript, SQL, DSA"
              value={masteredSkills}
              onChange={e => setMasteredSkills(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-amber-500 uppercase tracking-wider mb-1.5">Currently Learning Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Node.js, Next.js, Docker, Machine Learning"
              value={learningSkills}
              onChange={e => setLearningSkills(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all border ${inputStyle}`}
            />
          </div>

          <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs px-7 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-md"
            >
              <Save size={16} /> {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
