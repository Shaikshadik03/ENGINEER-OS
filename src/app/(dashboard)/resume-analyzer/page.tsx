'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Sparkles, CheckCircle2, Plus, Trash2, Printer, Download,
  User, Briefcase, GraduationCap, Code2, Award, ArrowRight, ArrowLeft,
  Target, HelpCircle, AlertCircle, RefreshCw, Layers
} from 'lucide-react'

interface Project {
  id: string
  name: string
  techStack: string
  link: string
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  dates: string
  grade: string
}

interface ResumeData {
  fullName: string
  targetRole: string
  phone: string
  email: string
  linkedin: string
  github: string
  summary: string
  skills: string
  tools: string
  experienceRole: string
  experienceCompany: string
  experienceDates: string
  experienceBullets: string[]
  projects: Project[]
  education: Education[]
  certifications: string[]
}

const DEFAULT_RESUME: ResumeData = {
  fullName: 'SHADIK SHAIK',
  targetRole: 'Forward Deployed Engineer',
  phone: '+91 8309432965',
  email: 'shaikshadik003@gmail.com',
  linkedin: 'https://linkedin.com/in/shaikshadik',
  github: 'https://github.com/Shaikshadik03',
  summary: 'First-year B.Tech CSE student passionate about AI, Machine Learning, Python, and Software Development. Enthusiastic about solving real-world problems, building projects, and continuously learning new technologies while developing strong technical and teamwork skills. 💻',
  skills: 'Python, C, HTML, CSS, JavaScript, OOP, DSA, SQL, Git, GitHub, REST APIs, Prompt Engineering, Problem Solving',
  tools: 'VS Code, GitHub, Canva, Figma, MS Word, MS Excel, ChatGPT, Claude, Gemini',
  experienceRole: 'Student Developer',
  experienceCompany: 'Personal Projects',
  experienceDates: 'Jul 2026 – Present',
  experienceBullets: [
    'Building Python, web development, Git/GitHub, and AI tools.',
    'Building coding projects, solving programming problems, and continuously improving software development skills.'
  ],
  projects: [
    {
      id: 'p1',
      name: 'AIRA - Personal AI Assistant',
      techStack: 'dart, python, PLpgSQL',
      link: 'https://github.com/Shaikshadik03',
      description: 'An intelligent, responsive personal AI assistant that remembers, plans, learns, automates, creates, and helps you in every part of life.'
    },
    {
      id: 'p2',
      name: 'Engineer-OS',
      techStack: 'TypeScript, Next.js, React, Tailwind CSS, Supabase',
      link: 'https://github.com/Shaikshadik03/ENGINEER-OS',
      description: 'Engineer OS replaces all of them. It is an AI-powered, glassmorphic, premium SaaS platform where a student lives from Semester 1 to graduation — guided every step of the way by a powerful AI engine.'
    }
  ],
  education: [
    {
      id: 'e1',
      institution: 'TMREIS KHAMMAM BOYS-1',
      degree: 'SCHOOLING - SSC',
      dates: '2019–2024',
      grade: 'GPA: 9.0'
    },
    {
      id: 'e2',
      institution: 'TMR-JC RAJENDRA NAGAR BOYS-1',
      degree: 'INTERMEDIATE',
      dates: '2024–2026',
      grade: 'GPA: 93.6%'
    }
  ],
  certifications: [
    'Python - SoloLearn',
    'Prompt Engineering Masterclass'
  ]
}

const TARGET_ROLES = [
  { id: 'fullstack', label: 'Full Stack Developer', keywords: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs', 'Git', 'Next.js', 'Tailwind CSS'] },
  { id: 'sde1', label: 'SDE-1 (Product Company)', keywords: ['DSA', 'Java', 'Python', 'System Design', 'OOP', 'SQL', 'Algorithms', 'Data Structures'] },
  { id: 'datascience', label: 'Data Scientist', keywords: ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'Scikit-Learn', 'Statistics', 'Matplotlib'] },
  { id: 'devops', label: 'DevOps Engineer', keywords: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git', 'Bash', 'Terraform'] },
]

export default function ResumePage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'builder' | 'analyzer'>('builder')
  const [step, setStep] = useState(1)
  const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME)
  const [newCert, setNewCert] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  // ATS Analyzer state
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0].id)
  const [resumeText, setResumeText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [atsResult, setAtsResult] = useState<any | null>(null)

  // Load user profile to pre-fill
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) {
          setResume(prev => ({
            ...prev,
            fullName: p.full_name || prev.fullName,
            email: user.email || prev.email,
            skills: Array.isArray(p.mastered_skills) && p.mastered_skills.length > 0 ? p.mastered_skills.join(', ') : prev.skills,
            summary: p.bio || prev.summary,
            targetRole: p.career_goal || prev.targetRole,
          }))
        }
      }
    }
    load()
  }, [])

  // Auto-fill from profile
  const handlePreFillProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please log in to import profile data.'); return }
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (p) {
      setResume(prev => ({
        ...prev,
        fullName: p.full_name || prev.fullName,
        skills: Array.isArray(p.mastered_skills) ? p.mastered_skills.join(', ') : prev.skills,
        summary: p.bio || prev.summary,
        targetRole: p.career_goal || prev.targetRole,
        github: p.github_url || prev.github,
        linkedin: p.linkedin_url || prev.linkedin,
      }))
      alert('✓ Profile data imported successfully!')
    }
  }

  // AI Summary Generator
  const handleAiSummary = async () => {
    setAiGenerating(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a compelling 2-sentence professional resume summary for a ${resume.targetRole} student named ${resume.fullName} with skills: ${resume.skills}. Keep it highly professional for tech recruiters.`,
        }),
      })
      const data = await res.json()
      if (data.response) {
        setResume(prev => ({ ...prev, summary: data.response.replace(/^[#*>-]+/g, '').trim() }))
      }
    } catch (e) {
      console.error(e)
    }
    setAiGenerating(false)
  }

  // Add / Delete Projects
  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), name: 'New Project', techStack: 'React, Node.js', link: 'https://github.com/', description: 'Describe your project accomplishments and technology features...' }
      ]
    }))
  }

  const updateProject = (id: string, field: keyof Project, val: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: val } : p)
    }))
  }

  const deleteProject = (id: string) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  // Certifications
  const addCert = () => {
    if (!newCert.trim()) return
    setResume(prev => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }))
    setNewCert('')
  }
  const deleteCert = (idx: number) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))
  }

  // Print Handler
  const handlePrint = () => {
    window.print()
  }

  // ATS Analysis Handler
  const handleAnalyze = () => {
    const textToAnalyze = resumeText || `${resume.fullName} ${resume.summary} ${resume.skills} ${resume.projects.map(p => p.name + ' ' + p.description).join(' ')}`
    if (!textToAnalyze.trim()) return
    setAnalyzing(true)

    const target = TARGET_ROLES.find(r => r.id === selectedRole) || TARGET_ROLES[0]
    const textLower = textToAnalyze.toLowerCase()

    const matched: string[] = []
    const missing: string[] = []

    target.keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) matched.push(kw)
      else missing.push(kw)
    })

    const keywordPct = Math.round((matched.length / target.keywords.length) * 70)
    const atsScore = Math.min(100, keywordPct + 25)

    setAtsResult({
      score: atsScore,
      matched,
      missing,
      strengths: [`Good technical coverage for ${target.label}.`, 'Structured layout with project links.'],
      improvements: missing.length > 0 ? [`Add keywords: ${missing.join(', ')}`] : ['Add numerical metrics to your project bullet points.']
    })
    setAnalyzing(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-indigo-400" size={24} /> AI Resume Builder & Coach
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build executive A4 resumes step-by-step with real-time live preview & ATS role optimization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111118] border border-white/10 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'builder'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Resume Builder & Live Preview
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Target size={14} /> ATS Resume Scanner
          </button>
        </div>
      </div>

      {/* ── TAB 1: RESUME BUILDER & LIVE PREVIEW ── */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: MULTI-STEP FORM WIZARD (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-6 print:hidden">
            {/* Steps Progress Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                      step === s
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : step > s
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePreFillProfile}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
              >
                <Sparkles size={12} /> Sync Profile
              </button>
            </div>

            {/* STEP 1: PERSONAL INFO */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-indigo-400" /> Step 1: Personal Details
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Full Name *</label>
                  <input
                    value={resume.fullName}
                    onChange={e => setResume({ ...resume, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Target Job Title *</label>
                  <input
                    value={resume.targetRole}
                    onChange={e => setResume({ ...resume, targetRole: e.target.value })}
                    placeholder="e.g. Forward Deployed Engineer / Full Stack Developer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Phone</label>
                    <input
                      value={resume.phone}
                      onChange={e => setResume({ ...resume, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Email</label>
                    <input
                      value={resume.email}
                      onChange={e => setResume({ ...resume, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">LinkedIn URL</label>
                    <input
                      value={resume.linkedin}
                      onChange={e => setResume({ ...resume, linkedin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">GitHub URL</label>
                    <input
                      value={resume.github}
                      onChange={e => setResume({ ...resume, github: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SUMMARY */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-indigo-400" /> Step 2: Professional Summary
                  </h3>
                  <button
                    onClick={handleAiSummary}
                    disabled={aiGenerating}
                    className="text-[10px] font-bold text-indigo-400 hover:text-white bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Sparkles size={12} className={aiGenerating ? 'animate-spin' : ''} /> {aiGenerating ? 'Writing...' : 'AI Auto-Write'}
                  </button>
                </div>

                <div>
                  <textarea
                    rows={6}
                    value={resume.summary}
                    onChange={e => setResume({ ...resume, summary: e.target.value })}
                    placeholder="Write 2-3 sentences about your B.Tech specialization, key technical strengths, and career ambitions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SKILLS */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Code2 size={16} className="text-indigo-400" /> Step 3: Skills & Developer Tools
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Languages & Core Tools (Comma Separated)</label>
                  <textarea
                    rows={3}
                    value={resume.skills}
                    onChange={e => setResume({ ...resume, skills: e.target.value })}
                    placeholder="Python, C, Java, HTML, CSS, JavaScript, React, SQL, Git..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Developer Software & Tools</label>
                  <input
                    value={resume.tools}
                    onChange={e => setResume({ ...resume, tools: e.target.value })}
                    placeholder="VS Code, GitHub, Figma, MS Excel, ChatGPT..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: EXPERIENCE */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-400" /> Step 4: Experience / Role
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Role Title</label>
                    <input
                      value={resume.experienceRole}
                      onChange={e => setResume({ ...resume, experienceRole: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Company / Organization</label>
                    <input
                      value={resume.experienceCompany}
                      onChange={e => setResume({ ...resume, experienceCompany: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Dates</label>
                  <input
                    value={resume.experienceDates}
                    onChange={e => setResume({ ...resume, experienceDates: e.target.value })}
                    placeholder="Jul 2026 – Present"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Bullet Points (One per line)</label>
                  <textarea
                    rows={4}
                    value={resume.experienceBullets.join('\n')}
                    onChange={e => setResume({ ...resume, experienceBullets: e.target.value.split('\n') })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: PROJECTS */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" /> Step 5: Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-white/3 border border-white/8 rounded-xl p-3.5 space-y-2.5 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">PROJECT #{idx + 1}</span>
                      {resume.projects.length > 1 && (
                        <button onClick={() => deleteProject(proj.id)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">Project Name *</label>
                        <input
                          value={proj.name}
                          onChange={e => updateProject(proj.id, 'name', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">Tech Stack *</label>
                        <input
                          value={proj.techStack}
                          onChange={e => updateProject(proj.id, 'techStack', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Project Link (Optional)</label>
                      <input
                        value={proj.link}
                        onChange={e => updateProject(proj.id, 'link', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Description *</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={e => updateProject(proj.id, 'description', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 6: EDUCATION & CERTS */}
            {step === 6 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={16} className="text-indigo-400" /> Step 6: Education & Certifications
                </h3>

                {resume.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-white/3 border border-white/8 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase">EDUCATION #{idx + 1}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={edu.degree}
                        onChange={e => {
                          const updated = [...resume.education]
                          updated[idx].degree = e.target.value
                          setResume({ ...resume, education: updated })
                        }}
                        placeholder="Degree / Stream"
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <input
                        value={edu.institution}
                        onChange={e => {
                          const updated = [...resume.education]
                          updated[idx].institution = e.target.value
                          setResume({ ...resume, education: updated })
                        }}
                        placeholder="School / College Name"
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={edu.dates}
                        onChange={e => {
                          const updated = [...resume.education]
                          updated[idx].dates = e.target.value
                          setResume({ ...resume, education: updated })
                        }}
                        placeholder="Years (e.g. 2024-2028)"
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <input
                        value={edu.grade}
                        onChange={e => {
                          const updated = [...resume.education]
                          updated[idx].grade = e.target.value
                          setResume({ ...resume, education: updated })
                        }}
                        placeholder="GPA / Grade"
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {/* Certifications */}
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Certifications</label>
                  <div className="flex gap-2">
                    <input
                      value={newCert}
                      onChange={e => setNewCert(e.target.value)}
                      placeholder="Add certification (e.g. AWS Certified Developer)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={addCert}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 rounded-xl"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {resume.certifications.map((c, i) => (
                      <span key={i} className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        {c}
                        <button onClick={() => deleteCert(i)} className="text-gray-400 hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                disabled={step === 1}
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>

                {step < 6 && (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REAL-TIME EXECUTIVE A4 RESUME PREVIEW (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white text-black p-8 rounded-xl shadow-2xl min-h-[842px] font-serif text-[11px] leading-relaxed select-text transition-all border border-gray-300 print:w-full print:m-0 print:p-0 print:border-none print:shadow-none">
            {/* Header */}
            <div className="text-center pb-3 mb-4 border-b border-gray-800">
              <h1 className="text-2xl font-bold font-serif uppercase tracking-widest text-black mb-1">
                {resume.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-xs font-sans font-semibold text-gray-700 uppercase tracking-wider mb-2">
                {resume.targetRole}
              </p>
              <p className="text-[10px] font-sans text-gray-600 flex flex-wrap justify-center items-center gap-2">
                {resume.phone && <span>{resume.phone}</span>}
                {resume.phone && resume.email && <span>|</span>}
                {resume.email && <span className="text-blue-700">{resume.email}</span>}
                {resume.linkedin && (
                  <>
                    <span>|</span>
                    <a href={resume.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 underline">LinkedIn</a>
                  </>
                )}
                {resume.github && (
                  <>
                    <span>|</span>
                    <a href={resume.github} target="_blank" rel="noreferrer" className="text-blue-700 underline">GitHub</a>
                  </>
                )}
              </p>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="mb-4">
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Summary
                </h2>
                <p className="text-[10px] font-serif leading-relaxed text-gray-900 text-justify">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {(resume.skills || resume.tools) && (
              <div className="mb-4">
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Skills
                </h2>
                {resume.skills && (
                  <p className="text-[10px] font-serif text-gray-900 mb-1">
                    <strong className="font-sans font-bold">Languages & Tools :</strong> {resume.skills}
                  </p>
                )}
                {resume.tools && (
                  <p className="text-[10px] font-serif text-gray-900">
                    <strong className="font-sans font-bold">Developer Tools :</strong> {resume.tools}
                  </p>
                )}
              </div>
            )}

            {/* Experience */}
            {resume.experienceRole && (
              <div className="mb-4">
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Experience
                </h2>
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-[10.5px] font-bold font-serif text-black">
                    {resume.experienceRole} — <span className="font-italic text-gray-700">{resume.experienceCompany}</span>
                  </p>
                  <p className="text-[9.5px] font-sans text-gray-600">{resume.experienceDates}</p>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-gray-900 font-serif">
                  {resume.experienceBullets.filter(b => b.trim() !== '').map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Projects
                </h2>
                <div className="space-y-2.5">
                  {resume.projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <p className="text-[10.5px] font-bold font-serif text-black">{proj.name}</p>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-[9px] font-sans text-blue-700 underline">
                            Live Link
                          </a>
                        )}
                      </div>
                      <ul className="list-disc pl-4 text-[10px] text-gray-900 font-serif">
                        <li>{proj.description}</li>
                      </ul>
                      {proj.techStack && (
                        <p className="text-[9px] font-sans text-gray-700 pl-4 mt-0.5">
                          <strong className="font-bold">Technologies:</strong> {proj.techStack}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Education
                </h2>
                <div className="space-y-1">
                  {resume.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <p className="text-[10px] font-bold font-serif text-black">{edu.degree}</p>
                        <p className="text-[9.5px] font-sans text-gray-700">{edu.institution}, {edu.grade}</p>
                      </div>
                      <p className="text-[9.5px] font-sans text-gray-600">{edu.dates}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold font-serif uppercase border-b border-gray-400 pb-0.5 mb-1.5 text-black">
                  Certifications
                </h2>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-gray-900 font-serif">
                  {resume.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: ATS RESUME SCANNER ── */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Input */}
          <div className="lg:col-span-2 bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Target Job Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TARGET_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                      selectedRole === role.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Paste Resume Content or Bullet Points</label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your full resume text or project bullet points here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {analyzing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {analyzing ? 'Scanning Resume ATS Score...' : 'Run AI Resume & ATS Analysis'}
            </button>
          </div>

          {/* Right Results */}
          <div className="space-y-4">
            {atsResult ? (
              <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="text-center pb-4 border-b border-white/10">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ATS MATCH SCORE</span>
                  <div className="text-4xl font-extrabold text-emerald-400 mt-1">{atsResult.score}%</div>
                  <span className="text-xs text-gray-400 font-semibold mt-1 block">
                    {atsResult.score >= 85 ? '🌟 Excellent ATS Compatibility' : atsResult.score >= 65 ? '👍 Good — Minor keywords missing' : '⚠️ Needs Optimization'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Matched Role Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matched.map((kw: string) => (
                      <span key={kw} className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {atsResult.missing.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Missing Role Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missing.map((kw: string) => (
                        <span key={kw} className="text-[10px] font-bold bg-rose-500/10 border border-rose-500/25 text-rose-300 px-2 py-0.5 rounded">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 text-center text-gray-500 py-16 space-y-3">
                <Target size={36} className="mx-auto opacity-30 text-indigo-400" />
                <p className="text-xs">Select a target job role & click <strong className="text-white">Run AI Analysis</strong> to view your ATS score!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
