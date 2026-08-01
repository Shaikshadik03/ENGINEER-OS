'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Sparkles, AlertCircle, CheckCircle2,
  TrendingUp, Award, HelpCircle, ArrowRight, Zap, Target
} from 'lucide-react'

const TARGET_ROLES = [
  { id: 'fullstack', label: 'Full Stack Developer', keywords: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs', 'Git', 'Next.js', 'Docker'] },
  { id: 'sde1', label: 'SDE-1 (Product Company)', keywords: ['DSA', 'Java', 'Python', 'System Design', 'OOP', 'SQL', 'Algorithms', 'Data Structures'] },
  { id: 'datascience', label: 'Data Scientist', keywords: ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'Scikit-Learn', 'Statistics', 'Matplotlib'] },
  { id: 'devops', label: 'DevOps Engineer', keywords: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git', 'Bash', 'Terraform'] },
  { id: 'ml', label: 'ML Engineer', keywords: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Deep Learning', 'FastAPI', 'MLOps'] },
  { id: 'android', label: 'Android Developer', keywords: ['Kotlin', 'Java', 'Android Studio', 'Jetpack Compose', 'MVVM', 'Retrofit', 'Room'] },
]

interface AnalysisResult {
  atsScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  strengths: string[]
  improvements: string[]
  interviewQuestions: Array<{
    id: number
    question: string
    category: 'Technical' | 'System Design' | 'Behavioral'
    hint: string
    modelAnswer: string
  }>
}

export default function ResumeAnalyzerPage() {
  const supabase = createClient()
  const [resumeText, setResumeText] = useState('')
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0].id)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [userProfile, setUserProfile] = useState<{ mastered_skills: string[] } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('mastered_skills').eq('id', user.id).single()
        if (profile) setUserProfile(profile)
      }
    }
    load()
  }, [])

  // Analyze Resume Function
  const handleAnalyze = () => {
    if (!resumeText.trim()) return
    setAnalyzing(true)

    const target = TARGET_ROLES.find(r => r.id === selectedRole) || TARGET_ROLES[0]
    const textLower = resumeText.toLowerCase()

    const matched: string[] = []
    const missing: string[] = []

    target.keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        matched.push(kw)
      } else {
        missing.push(kw)
      }
    })

    // Calculate score
    const keywordPct = Math.round((matched.length / target.keywords.length) * 70)
    const hasLengthBonus = resumeText.length > 200 ? 15 : 5
    const hasProjectBonus = (textLower.includes('project') || textLower.includes('built') || textLower.includes('github')) ? 15 : 5
    const atsScore = Math.min(100, keywordPct + hasLengthBonus + hasProjectBonus)

    const strengths: string[] = []
    const improvements: string[] = []

    if (matched.length >= 4) strengths.push(`Strong coverage of core ${target.label} technologies (${matched.join(', ')}).`)
    if (resumeText.length > 300) strengths.push('Good detail length and structural depth.')
    if (textLower.includes('github') || textLower.includes('http')) strengths.push('Includes project portfolio links.')

    if (missing.length > 0) improvements.push(`Missing key role keywords: ${missing.join(', ')}. Try integrating these into your project bullet points.`)
    if (!textLower.includes('achieved') && !textLower.includes('improved') && !textLower.includes('%')) {
      improvements.push('Add quantifiable metric impacts to your bullet points (e.g. "Improved query performance by 40%").')
    }

    // Role-specific Interview Questions
    const questions = [
      {
        id: 1,
        question: `Explain how you would architect a production-ready application using ${matched[0] || target.keywords[0]}.`,
        category: 'Technical' as const,
        hint: 'Focus on modularity, state management, error handling, and performance optimization.',
        modelAnswer: `Explain clear separation of concerns, API data caching, component breakdown, and environment variable security.`
      },
      {
        id: 2,
        question: `How do you handle database indexing and query optimization when working with ${target.keywords.find(k => k.includes('SQL') || k.includes('Postgre')) || 'SQL'}?`,
        category: 'Technical' as const,
        hint: 'Mention EXPLAIN ANALYZE, B-tree indexes, avoiding SELECT *, and connection pooling.',
        modelAnswer: `Discuss analyzing query execution plans, creating composite indexes on frequently filtered columns, and limiting N+1 query problems.`
      },
      {
        id: 3,
        question: 'Describe a challenging bug you encountered in a campus or personal project and how you debugged it.',
        category: 'Behavioral' as const,
        hint: 'Use the STAR method (Situation, Task, Action, Result).',
        modelAnswer: `Detail the symptom, log inspection tools used (DevTools / server logs), root cause analysis, and the regression test added to prevent recurrence.`
      },
      {
        id: 4,
        question: `How do you ensure system scalability and zero downtime during deployments?`,
        category: 'System Design' as const,
        hint: 'Discuss CI/CD pipelines, Docker containers, load balancers, and rollback strategies.',
        modelAnswer: `Explain containerizing applications with Docker, automated unit/integration tests in GitHub Actions, and blue-green or rolling deployment strategies.`
      }
    ]

    setTimeout(() => {
      setResult({
        atsScore,
        matchedKeywords: matched,
        missingKeywords: missing,
        strengths,
        improvements,
        interviewQuestions: questions
      })
      setAnalyzing(false)
    }, 600)
  }

  // Pre-fill from profile skills
  const autofillFromProfile = () => {
    if (userProfile?.mastered_skills?.length) {
      setResumeText(`Engineering Student | B.Tech\n\nTechnical Skills:\n- ${userProfile.mastered_skills.join(', ')}\n\nProjects:\n- Developed full-stack web application with responsive UI, Supabase backend authentication, and REST APIs.\n- Built data pipeline and analytics dashboard tracking performance metrics.`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <FileText className="text-indigo-400" size={24} /> AI Resume Coach & Mock Interviewer
        </h1>
        <p className="text-gray-500 text-sm">Analyze your resume against real tech roles, fix ATS missing keywords, and practice role-specific interview questions.</p>
      </div>

      {/* Main Analyzer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Input Panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Target size={14} className="text-indigo-400" /> Target Job Role
              </label>
              {userProfile?.mastered_skills?.length && (
                <button
                  onClick={autofillFromProfile}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles size={12} /> Fill from Profile Skills
                </button>
              )}
            </div>

            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {TARGET_ROLES.map(r => (
                <option key={r.id} value={r.id} className="bg-[#111118]">{r.label}</option>
              ))}
            </select>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Paste Your Resume Text or Project Bullet Points
              </label>
              <textarea
                rows={10}
                placeholder="Paste your resume content, summary, or project descriptions here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> {analyzing ? 'Analyzing Keywords & ATS Score...' : 'Run AI Resume & ATS Analysis'}
            </button>
          </div>
        </div>

        {/* ATS Score Preview / Role Keywords */}
        <div className="space-y-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Required Role Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {(TARGET_ROLES.find(r => r.id === selectedRole)?.keywords || []).map(kw => (
                <span key={kw} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-300 font-medium">
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-500">
              ATS parsers scan for these exact keywords when screening resumes for this role.
            </p>
          </div>
        </div>

      </div>

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* ATS Score Card */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${
                result.atsScore >= 80 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : result.atsScore >= 50 ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-rose-500 text-rose-400 bg-rose-500/10'
              }`}>
                <span className="text-2xl font-black">{result.atsScore}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">ATS Score</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {result.atsScore >= 80 ? '🎉 Excellent Resume Match!' : result.atsScore >= 50 ? '👍 Good Foundation — Needs Keywords' : '⚠️ Action Required — Missing Key Skills'}
                </h3>
                <p className="text-xs text-gray-400">
                  Matched <span className="text-white font-bold">{result.matchedKeywords.length}</span> of {result.matchedKeywords.length + result.missingKeywords.length} core technical keywords for this role.
                </p>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Matched */}
            <div className="bg-[#111118] border border-emerald-500/20 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={15} /> Matched Keywords ({result.matchedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.length > 0 ? (
                  result.matchedKeywords.map(kw => (
                    <span key={kw} className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No matched keywords found yet.</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="bg-[#111118] border border-amber-500/20 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={15} /> Missing Keywords to Add ({result.missingKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map(kw => (
                    <span key={kw} className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                      + Add {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">All target keywords matched!</span>
                )}
              </div>
            </div>

          </div>

          {/* AI MOCK INTERVIEW QUESTIONS */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <HelpCircle size={18} className="text-indigo-400" /> AI Mock Technical Interview Practice
              </h3>
              <p className="text-xs text-gray-400">Personalized technical and situational interview questions generated for your resume.</p>
            </div>

            <div className="space-y-4">
              {result.interviewQuestions.map((q, i) => (
                <div key={q.id} className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      Q{i + 1} • {q.category}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white leading-relaxed">{q.question}</p>

                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1 text-xs">
                    <p className="text-indigo-300 font-semibold">💡 Interviewer Hint:</p>
                    <p className="text-gray-400">{q.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
