'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Data Science', 'Mechanical', 'Civil']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const SKILLS_OPTIONS = [
  'Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust',
  'HTML/CSS', 'React', 'Next.js', 'Vue', 'Angular',
  'Node.js', 'Express', 'Django', 'FastAPI', 'Spring Boot',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'DSA', 'System Design', 'Machine Learning', 'Deep Learning', 'NLP',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Git', 'Linux', 'REST APIs', 'GraphQL',
]
const INTERESTS_OPTIONS = [
  'Web Development', 'Mobile Development', 'AI/ML', 'Data Science',
  'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain/Web3',
  'Game Development', 'UI/UX Design', 'Open Source', 'Startups',
  'Competitive Programming', 'Research', 'FinTech', 'EdTech',
]

const STEPS = ['Basic Info', 'Skills', 'Interests & Goals']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [masteredSkills, setMasteredSkills] = useState<string[]>([])
  const [learningSkills, setLearningSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [careerGoal, setCareerGoal] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const toggleSkill = (skill: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(skill)) setter(list.filter(s => s !== skill))
    else setter([...list, skill])
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      university,
      branch,
      semester: parseInt(semester),
      github_url: github,
      linkedin_url: linkedin,
      portfolio_url: portfolio,
      mastered_skills: masteredSkills,
      learning_skills: learningSkills,
      interests,
      career_goal: careerGoal,
      subscription_tier: 'free',
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const Tag = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        selected
          ? 'bg-indigo-600 text-white border border-indigo-500'
          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set up your Engineer OS</h1>
          <p className="text-gray-400 mt-1 text-sm">This powers your personalized AI experience across the entire OS.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-indigo-600' : 'bg-white/10'}`} />
              <p className={`text-xs mt-2 ${i === step ? 'text-white' : 'text-gray-600'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 shadow-xl">

          {/* STEP 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Tell us about yourself</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Shadik Shaik"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">University / College *</label>
                  <input value={university} onChange={e => setUniversity(e.target.value)} placeholder="e.g. Mahindra University"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Branch *</label>
                    <select value={branch} onChange={e => setBranch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Current Semester *</label>
                    <select value={semester} onChange={e => setSemester(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                      <option value="">Select</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">GitHub URL</label>
                  <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/yourusername"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">LinkedIn URL</label>
                  <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourusername"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Skills */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Your technical skills</h2>
                <p className="text-gray-500 text-xs mb-4">This is how Aira calculates your job match scores. Be honest — select what you actually know well.</p>
                <p className="text-xs text-indigo-400 mb-3 font-medium">✅ Skills I have mastered</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map(s => (
                    <Tag key={s} label={s} selected={masteredSkills.includes(s)} onClick={() => toggleSkill(s, masteredSkills, setMasteredSkills)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-yellow-400 mb-3 font-medium">📚 Currently learning</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.filter(s => !masteredSkills.includes(s)).map(s => (
                    <Tag key={s} label={s} selected={learningSkills.includes(s)} onClick={() => toggleSkill(s, learningSkills, setLearningSkills)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Interests & career goal</h2>
                <p className="text-gray-500 text-xs mb-4">Used to surface roadmaps and opportunities relevant to you — not generic ones.</p>
                <p className="text-xs text-purple-400 mb-3 font-medium">🚀 Domains I care about</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map(i => (
                    <Tag key={i} label={i} selected={interests.includes(i)} onClick={() => toggleSkill(i, interests, setInterests)} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">My career goal (in one sentence)</label>
                <input value={careerGoal} onChange={e => setCareerGoal(e.target.value)}
                  placeholder="e.g. Get a full-stack internship by Year 3, join a product startup"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mt-4">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">
                ← Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => {
                  if (step === 0 && (!fullName || !university || !branch || !semester)) {
                    setError('Please fill in all required fields.')
                    return
                  }
                  setError('')
                  setStep(s => s + 1)
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {loading ? 'Saving...' : 'Launch My OS 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
