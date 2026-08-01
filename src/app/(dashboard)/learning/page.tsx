'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  BookOpen, PlayCircle, Star, Flame, Award,
  Lock, CheckCircle2, ChevronRight, HelpCircle,
  ArrowLeft, Sparkles, Code2, Zap, Cpu
} from 'lucide-react'

// --- TYPE DEFINITIONS ---
interface Subject {
  id: string; code: string; name: string; branch: string
  semester: number; description: string; icon: string; is_pro: boolean
}
interface Chapter {
  id: string; subject_id: string; title: string
  order_index: number; is_pro: boolean; subtopics?: Subtopic[]
}
interface Subtopic {
  id: string; chapter_id: string; title: string; order_index: number
  video_url: string; notes_markdown: string; xp_reward: number; is_pro: boolean
}
interface Quiz {
  id: string; subtopic_id: string; question: string
  options: string[]; correct_index: number; xp_reward: number
}
interface Profile {
  branch: string; semester: number; subscription_tier: string
  xp: number; streak: number
}

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Zap, Cpu, BookOpen
}

const BRANCHES = ['CSE', 'IT', 'ECE', 'AIML']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function LearningDashboard() {
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [selectedBranch, setSelectedBranch] = useState('CSE')
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Load profile on mount
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('branch,semester,subscription_tier,xp,streak').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setSelectedBranch(data.branch || 'CSE')
        setSelectedSemester(data.semester || 1)
      }
    }
    load()
  }, [])

  // Fetch subjects when branch/semester changes
  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true)
      const { data } = await supabase.from('subjects').select('*').eq('branch', selectedBranch).eq('semester', selectedSemester)
      setSubjects(data || [])
      setLoading(false)
    }
    fetchSubjects()
  }, [selectedBranch, selectedSemester])

  // Open a subject - load chapters + subtopics + user progress
  const openSubject = async (subject: Subject) => {
    setActiveSubject(subject)
    setActiveSubtopic(null)
    setLoading(true)

    const { data: chapData } = await supabase
      .from('chapters').select('*').eq('subject_id', subject.id).order('order_index')

    if (chapData) {
      const ids = chapData.map(c => c.id)
      const { data: subData } = await supabase
        .from('subtopics').select('*').in('chapter_id', ids).order('order_index')

      setChapters(chapData.map(c => ({
        ...c, subtopics: subData?.filter(s => s.chapter_id === c.id) || []
      })))
    }

    if (userId) {
      const { data: progress } = await supabase
        .from('user_progress').select('subtopic_id').eq('user_id', userId)
      if (progress) setCompletedIds(new Set(progress.map(p => p.subtopic_id)))
    }
    setLoading(false)
  }

  // Open a subtopic - load quizzes
  const openSubtopic = async (sub: Subtopic) => {
    setActiveSubtopic(sub)
    setQuizSubmitted(false)
    setSelectedAnswers({})
    setQuizScore(0)
    const { data } = await supabase.from('quizzes').select('*').eq('subtopic_id', sub.id)
    setQuizzes(data || [])
  }

  // Mark subtopic as complete and award XP
  const completeSubtopic = async () => {
    if (!activeSubtopic || !userId) return
    const { error } = await supabase.from('user_progress').upsert({
      user_id: userId, subtopic_id: activeSubtopic.id, completed: true
    })
    if (!error) {
      setCompletedIds(prev => new Set([...prev, activeSubtopic.id]))
      const newXp = (profile?.xp || 0) + activeSubtopic.xp_reward
      await supabase.from('profiles').update({ xp: newXp }).eq('id', userId)
      setProfile(prev => prev ? { ...prev, xp: newXp } : null)
    }
  }

  // Submit quiz and award XP
  const submitQuiz = async () => {
    let score = 0
    quizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_index) score += q.xp_reward
    })
    setQuizScore(score)
    setQuizSubmitted(true)
    if (score > 0 && userId) {
      const newXp = (profile?.xp || 0) + score
      await supabase.from('profiles').update({ xp: newXp }).eq('id', userId)
      setProfile(prev => prev ? { ...prev, xp: newXp } : null)
    }
  }

  const isPro = profile?.subscription_tier === 'pro'

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">

      {/* ── HEADER & STATS BAR ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Learning Hub</h1>
          <p className="text-gray-500 text-sm">Select your branch & semester to start the real syllabus.</p>
        </div>
        <div className="flex gap-3">
          {[
            { icon: Flame, label: 'Streak', value: `${profile?.streak || 0}d`, color: 'orange' },
            { icon: Star, label: 'XP', value: `${profile?.xp || 0}`, color: 'emerald' },
            { icon: Award, label: 'Tier', value: (profile?.subscription_tier || 'FREE').toUpperCase(), color: 'indigo' }
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`bg-[#111118] border border-${color}-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2.5`}>
              <Icon className={`text-${color}-400`} size={18} />
              <div>
                <p className={`text-[9px] font-bold text-${color}-400 uppercase tracking-wider`}>{label}</p>
                <p className="text-white font-bold text-sm leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VIEW 1: BRANCH / SEMESTER SELECTOR + SUBJECT GRID ── */}
      {!activeSubject && (
        <>
          {/* Selectors */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Branch</span>
              <div className="flex gap-2">
                {BRANCHES.map(b => (
                  <button key={b} onClick={() => setSelectedBranch(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedBranch === b ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Semester</span>
              <div className="flex gap-1.5">
                {SEMESTERS.map(s => (
                  <button key={s} onClick={() => setSelectedSemester(s)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${selectedSemester === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Cards */}
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              {selectedBranch} — Semester {selectedSemester} Subjects
            </h2>
            {loading ? (
              <div className="text-center text-gray-500 py-16">Loading syllabus...</div>
            ) : subjects.length === 0 ? (
              <div className="bg-[#111118] border border-white/10 rounded-2xl p-10 text-center">
                <p className="text-gray-400 mb-2">No content yet for {selectedBranch} Sem {selectedSemester}.</p>
                <p className="text-xs text-gray-600">Pilot is live on <span className="text-indigo-400 font-bold">CSE Semester 1</span>. Select that to begin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {subjects.map(sub => {
                  const locked = sub.is_pro && !isPro
                  const SubIcon = ICON_MAP[sub.icon] || BookOpen
                  return (
                    <div key={sub.id} onClick={() => !locked && openSubject(sub)}
                      className={`bg-[#111118] border border-white/10 rounded-2xl p-6 transition-all relative ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500/60 hover:scale-[1.02]'}`}>
                      <div className="flex justify-between mb-4">
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">{sub.code}</span>
                        {locked
                          ? <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold"><Lock size={11} /> PRO</span>
                          : <SubIcon size={18} className="text-gray-600" />
                        }
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{sub.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{sub.description}</p>
                      <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                        <PlayCircle size={14} /> Open Course
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── VIEW 2: CHAPTERS & SUBTOPICS ── */}
      {activeSubject && !activeSubtopic && (
        <div className="space-y-5">
          <button onClick={() => setActiveSubject(null)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white">
            <ArrowLeft size={15} /> Back to Subjects
          </button>

          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md mb-3 inline-block">{activeSubject.code}</span>
            <h2 className="text-xl font-bold text-white mb-1">{activeSubject.name}</h2>
            <p className="text-sm text-gray-500">{activeSubject.description}</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading chapters...</div>
          ) : (
            chapters.map(chap => {
              const chapLocked = chap.is_pro && !isPro
              return (
                <div key={chap.id} className="bg-[#111118] border border-white/10 rounded-2xl p-5">
                  <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                    {chap.title}
                    {chapLocked && (
                      <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={11} /> PRO</span>
                    )}
                  </h4>

                  <div className="space-y-2">
                    {chap.subtopics?.map(sub => {
                      const isCompleted = completedIds.has(sub.id)
                      const locked = (sub.is_pro || chapLocked) && !isPro
                      return (
                        <button key={sub.id} onClick={() => !locked && openSubtopic(sub)} disabled={locked}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left
                            ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400'
                              : locked ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed text-gray-500'
                              : 'bg-white/5 border-white/10 hover:border-indigo-500/40 text-gray-300 hover:text-white'}`}>
                          <span className="flex items-center gap-3 text-sm font-medium">
                            {isCompleted ? <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
                              : locked ? <Lock size={17} className="text-amber-500 shrink-0" />
                              : <PlayCircle size={17} className="text-indigo-400 shrink-0" />}
                            {sub.title}
                          </span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">+{sub.xp_reward} XP</span>
                            <ChevronRight size={15} className="text-gray-600" />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── VIEW 3: VIDEO + NOTES + QUIZ ── */}
      {activeSubtopic && (
        <div className="space-y-5">
          <button onClick={() => setActiveSubtopic(null)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white">
            <ArrowLeft size={15} /> Back to Chapters
          </button>

          {/* Subtopic Header */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{activeSubtopic.title}</h2>
              <p className="text-xs text-indigo-400 font-semibold">Earn +{activeSubtopic.xp_reward} XP on completion</p>
            </div>
            {completedIds.has(activeSubtopic.id)
              ? <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle2 size={15} /> Completed</span>
              : <button onClick={completeSubtopic} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
                  <Sparkles size={15} /> Mark Complete & Claim XP
                </button>
            }
          </div>

          {/* Video */}
          {activeSubtopic.video_url && (
            <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                <PlayCircle size={15} className="text-indigo-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Video Lecture</span>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe src={activeSubtopic.video_url} title={activeSubtopic.title}
                  className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            </div>
          )}

          {/* Notes */}
          {activeSubtopic.notes_markdown && (
            <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                <BookOpen size={15} className="text-indigo-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Study Notes</span>
              </div>
              <div className="p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-black/30">
                {activeSubtopic.notes_markdown}
              </div>
            </div>
          )}

          {/* Quiz */}
          {quizzes.length > 0 && (
            <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                <HelpCircle size={15} className="text-emerald-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Practice Quiz</span>
              </div>
              <div className="p-5 space-y-5">
                {quizzes.map((q, idx) => (
                  <div key={q.id} className="bg-white/5 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-white">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = selectedAnswers[q.id] === oi
                        const isCorrect = q.correct_index === oi
                        let cls = 'bg-white/5 border-white/10 text-gray-300 hover:border-indigo-400'
                        if (quizSubmitted) {
                          cls = isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : isSelected ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-white/5 border-white/10 text-gray-500'
                        } else if (isSelected) {
                          cls = 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                        }
                        return (
                          <button key={oi} disabled={quizSubmitted} onClick={() => setSelectedAnswers(p => ({ ...p, [q.id]: oi }))}
                            className={`p-3 rounded-lg border text-xs text-left transition-all ${cls}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {!quizSubmitted
                  ? <button onClick={submitQuiz} disabled={Object.keys(selectedAnswers).length < quizzes.length}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all">
                      Submit Quiz & Claim XP
                    </button>
                  : <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-5 py-3 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Quiz Done! +{quizScore} XP added to your profile.
                    </div>
                }
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
