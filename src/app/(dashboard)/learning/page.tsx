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

const CURRICULUM_DATA: Record<number, Subject[]> = {
  1: [
    { id: 'c-prog', code: 'CS101', name: 'Programming in C', branch: 'CSE', semester: 1, description: 'Variables, loops, pointers, memory & structs', icon: 'Code2', is_pro: false },
    { id: 'math-1', code: 'MA101', name: 'Engineering Mathematics I', branch: 'CSE', semester: 1, description: 'Calculus, matrices, linear algebra & differential equations', icon: 'BookOpen', is_pro: false },
    { id: 'phys-1', code: 'PH101', name: 'Engineering Physics', branch: 'CSE', semester: 1, description: 'Quantum mechanics, semiconductor physics & optics', icon: 'Zap', is_pro: false }
  ],
  2: [
    { id: 'dsa-2', code: 'CS201', name: 'Data Structures & Algorithms', branch: 'CSE', semester: 2, description: 'Arrays, stacks, queues, linked lists, trees & graphs', icon: 'Code2', is_pro: false },
    { id: 'oop-2', code: 'CS202', name: 'Object-Oriented Programming', branch: 'CSE', semester: 2, description: 'Classes, inheritance, polymorphism & STL in C++/Java', icon: 'Cpu', is_pro: false },
    { id: 'ee-2', code: 'EC201', name: 'Basic Electrical & Electronics', branch: 'CSE', semester: 2, description: 'Circuit theory, logic gates & semiconductor devices', icon: 'Zap', is_pro: false }
  ],
  3: [
    { id: 'dbms-3', code: 'CS301', name: 'Database Management Systems', branch: 'CSE', semester: 3, description: 'Relational model, SQL, normalization & indexing', icon: 'Code2', is_pro: false },
    { id: 'dm-3', code: 'CS302', name: 'Discrete Mathematics', branch: 'CSE', semester: 3, description: 'Set theory, graph theory, combinatorics & logic', icon: 'BookOpen', is_pro: false },
    { id: 'dl-3', code: 'CS303', name: 'Digital Logic & Computer Design', branch: 'CSE', semester: 3, description: 'K-maps, flip-flops, registers, ALU & CPU architecture', icon: 'Cpu', is_pro: false }
  ],
  4: [
    { id: 'os-4', code: 'CS401', name: 'Operating Systems', branch: 'CSE', semester: 4, description: 'Processes, threads, CPU scheduling, memory & deadlocks', icon: 'Cpu', is_pro: false },
    { id: 'cn-4', code: 'CS402', name: 'Computer Networks', branch: 'CSE', semester: 4, description: 'OSI model, TCP/IP, routing, HTTP, DNS & sockets', icon: 'Zap', is_pro: false },
    { id: 'toc-4', code: 'CS403', name: 'Theory of Computation', branch: 'CSE', semester: 4, description: 'Finite automata, DFA/NFA, Turing machines & grammars', icon: 'BookOpen', is_pro: false }
  ],
  5: [
    { id: 'sys-5', code: 'CS501', name: 'System Design & Architecture', branch: 'CSE', semester: 5, description: 'Scalability, microservices, load balancing & caching', icon: 'Cpu', is_pro: false },
    { id: 'se-5', code: 'CS502', name: 'Software Engineering & Agile', branch: 'CSE', semester: 5, description: 'SDLC, Agile/Scrum, Git, CI/CD & software testing', icon: 'Code2', is_pro: false },
    { id: 'cd-5', code: 'CS503', name: 'Compiler Design', branch: 'CSE', semester: 5, description: 'Lexical analysis, parsing, AST & code optimization', icon: 'BookOpen', is_pro: false }
  ],
  6: [
    { id: 'ml-6', code: 'CS601', name: 'Machine Learning & Data Mining', branch: 'CSE', semester: 6, description: 'Supervised/unsupervised learning, regression & neural nets', icon: 'Cpu', is_pro: false },
    { id: 'cloud-6', code: 'CS602', name: 'Cloud Computing & DevOps', branch: 'CSE', semester: 6, description: 'AWS, GCP, Docker, Kubernetes, Terraform & serverless', icon: 'Zap', is_pro: false },
    { id: 'web-6', code: 'CS603', name: 'Full-Stack Web Technologies', branch: 'CSE', semester: 6, description: 'React, Node.js, REST APIs, GraphQL & web security', icon: 'Code2', is_pro: false }
  ],
  7: [
    { id: 'ai-7', code: 'CS701', name: 'Artificial Intelligence & Deep Learning', branch: 'CSE', semester: 7, description: 'PyTorch, CNNs, Transformers, LLMs & AI ethics', icon: 'Cpu', is_pro: false },
    { id: 'sec-7', code: 'CS702', name: 'Cyber Security & Cryptography', branch: 'CSE', semester: 7, description: 'AES, RSA, PKI, hashing, penetration testing & web sec', icon: 'Zap', is_pro: false },
    { id: 'bigdata-7', code: 'CS703', name: 'Big Data Analytics & Spark', branch: 'CSE', semester: 7, description: 'Hadoop, Apache Spark, Kafka & distributed processing', icon: 'BookOpen', is_pro: false }
  ],
  8: [
    { id: 'proj-8', code: 'CS801', name: 'Capstone Major Project Masterclass', branch: 'CSE', semester: 8, description: 'Architecture design, production deployment & documentation', icon: 'Code2', is_pro: false },
    { id: 'hpc-8', code: 'CS802', name: 'High Performance Computing', branch: 'CSE', semester: 8, description: 'CUDA, MPI, GPU acceleration & multi-threading', icon: 'Cpu', is_pro: false },
    { id: 'gate-8', code: 'CS803', name: 'Placement & GATE Masterclass', branch: 'CSE', semester: 8, description: 'Product company technical rounds, GATE PYQs & mock tests', icon: 'Zap', is_pro: false }
  ]
}

const CHAPTERS_DATA: Record<string, Chapter[]> = {
  default: [
    {
      id: 'chap-1', subject_id: 'default', title: 'Module 1: Foundations & Core Concepts', order_index: 1, is_pro: false,
      subtopics: [
        { id: 'sub-1', chapter_id: 'chap-1', title: '1.1 Introduction & Fundamental Principles', order_index: 1, video_url: 'https://www.youtube.com/embed/zOjov-2OZ0E', notes_markdown: '# Fundamentals\n- Core concepts & theoretical foundation\n- Key formulas & implementation guidelines\n- Standard industry practices', xp_reward: 50, is_pro: false },
        { id: 'sub-2', chapter_id: 'chap-1', title: '1.2 Practical Implementation & Examples', order_index: 2, video_url: 'https://www.youtube.com/embed/rfscVS0vtbw', notes_markdown: '# Implementation Guide\n- Step-by-step problem walkthrough\n- Time & space complexity analysis\n- Edge cases & optimization tips', xp_reward: 50, is_pro: false }
      ]
    },
    {
      id: 'chap-2', subject_id: 'default', title: 'Module 2: Advanced Topics & Exam/Interview Prep', order_index: 2, is_pro: false,
      subtopics: [
        { id: 'sub-3', chapter_id: 'chap-2', title: '2.1 Advanced Patterns & Optimization', order_index: 1, video_url: 'https://www.youtube.com/embed/8hly31xKLI0', notes_markdown: '# Advanced Techniques\n- High-frequency exam & interview questions\n- Real-world production trade-offs', xp_reward: 75, is_pro: false }
      ]
    }
  ]
}

const QUIZZES_DATA: Record<string, Quiz[]> = {
  default: [
    { id: 'q-1', subtopic_id: 'default', question: 'Which of the following best describes the primary time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct_index: 1, xp_reward: 20 },
    { id: 'q-2', subtopic_id: 'default', question: 'In computer memory management, what is the main purpose of virtual memory?', options: ['Speed up CPU cache', 'Extend physical RAM using secondary disk storage', 'Directly execute machine code', 'Manage GPU rendering'], correct_index: 1, xp_reward: 20 }
  ]
}

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

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('branch,semester,subscription_tier,xp,streak').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        if (data.branch) setSelectedBranch(data.branch)
        if (data.semester) setSelectedSemester(data.semester)
      }
    }
    load()
  }, [])

  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true)
      const { data } = await supabase.from('subjects').select('*').eq('branch', selectedBranch).eq('semester', selectedSemester)
      if (data && data.length > 0) {
        setSubjects(data)
      } else {
        setSubjects(CURRICULUM_DATA[selectedSemester] || CURRICULUM_DATA[1])
      }
      setLoading(false)
    }
    fetchSubjects()
  }, [selectedBranch, selectedSemester])

  const openSubject = async (subject: Subject) => {
    setActiveSubject(subject)
    setActiveSubtopic(null)
    setLoading(true)

    const { data: chapData } = await supabase
      .from('chapters').select('*').eq('subject_id', subject.id).order('order_index')

    if (chapData && chapData.length > 0) {
      const ids = chapData.map(c => c.id)
      const { data: subData } = await supabase
        .from('subtopics').select('*').in('chapter_id', ids).order('order_index')

      setChapters(chapData.map(c => ({
        ...c, subtopics: subData?.filter(s => s.chapter_id === c.id) || []
      })))
    } else {
      setChapters(CHAPTERS_DATA.default)
    }

    if (userId) {
      const { data: progress } = await supabase
        .from('user_progress').select('subtopic_id').eq('user_id', userId)
      if (progress) setCompletedIds(new Set(progress.map(p => p.subtopic_id)))
    }
    setLoading(false)
  }

  const openSubtopic = async (sub: Subtopic) => {
    setActiveSubtopic(sub)
    setQuizSubmitted(false)
    setSelectedAnswers({})
    setQuizScore(0)

    const { data } = await supabase.from('quizzes').select('*').eq('subtopic_id', sub.id)
    if (data && data.length > 0) {
      setQuizzes(data)
    } else {
      setQuizzes(QUIZZES_DATA.default)
    }
  }

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <BookOpen className="text-sky-600" size={26} /> Learning Engine
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">
            Full 8-Semester syllabus across CSE, IT, ECE, & AIML with video lectures and quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl text-xs font-extrabold text-amber-600 shadow-sm">
            <Flame size={15} /> {profile?.streak || 0}d Streak
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl text-xs font-extrabold text-emerald-600 shadow-sm">
            <Star size={15} /> {profile?.xp || 0} XP
          </div>
        </div>
      </div>

      {/* Branch & Semester Selector */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Branches */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">BRANCH:</span>
          {BRANCHES.map(b => (
            <button
              key={b}
              onClick={() => { setSelectedBranch(b); setActiveSubject(null) }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBranch === b
                  ? 'bg-sky-600 text-white shadow-md font-extrabold'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Semesters 1 to 8 */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">SEMESTER:</span>
          {SEMESTERS.map(s => (
            <button
              key={s}
              onClick={() => { setSelectedSemester(s); setActiveSubject(null) }}
              className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                selectedSemester === s
                  ? 'bg-sky-600 text-white shadow-md font-extrabold'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── VIEW 1: SUBJECT CARDS ── */}
      {!activeSubject && (
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
            {selectedBranch} — SEMESTER {selectedSemester} SUBJECTS
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse h-40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map(subject => {
                const IconComp = ICON_MAP[subject.icon] || BookOpen
                return (
                  <div
                    key={subject.id}
                    onClick={() => openSubject(subject)}
                    className="bg-white border border-slate-200/80 hover:border-sky-300 rounded-3xl p-6 cursor-pointer transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                          <IconComp size={20} />
                        </div>
                        <span className="text-[10px] font-extrabold text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg font-mono">
                          {subject.code}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {subject.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-sky-600 group-hover:text-sky-800">
                      <span>Start Module</span>
                      <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── VIEW 2: CHAPTERS & SUBTOPICS ── */}
      {activeSubject && !activeSubtopic && (
        <div className="space-y-5">
          <button onClick={() => setActiveSubject(null)} className="flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-800">
            <ArrowLeft size={15} /> Back to Subjects
          </button>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg">
              {activeSubject.code}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2 mb-1">{activeSubject.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{activeSubject.description}</p>
          </div>

          <div className="space-y-4">
            {chapters.map(chap => (
              <div key={chap.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={15} className="text-sky-600" /> {chap.title}
                </h3>

                <div className="space-y-2">
                  {chap.subtopics?.map(sub => {
                    const isDone = completedIds.has(sub.id)
                    return (
                      <div
                        key={sub.id}
                        onClick={() => openSubtopic(sub)}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {isDone
                            ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                            : <PlayCircle size={18} className="text-slate-400 group-hover:text-sky-600 shrink-0 transition-colors" />}
                          <span className={`text-xs font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{sub.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">+ {sub.xp_reward} XP</span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-700" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 3: VIDEO + NOTES + QUIZ ── */}
      {activeSubtopic && (
        <div className="space-y-5">
          <button onClick={() => setActiveSubtopic(null)} className="flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-800">
            <ArrowLeft size={15} /> Back to Chapters
          </button>

          {/* Subtopic Header */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{activeSubtopic.title}</h2>
              <p className="text-xs text-sky-700 font-bold">Earn +{activeSubtopic.xp_reward} XP on completion</p>
            </div>
            {completedIds.has(activeSubtopic.id)
              ? <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2"><CheckCircle2 size={15} /> Completed</span>
              : <button onClick={completeSubtopic} className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md">
                  <Sparkles size={15} /> Mark Complete & Claim XP
                </button>
            }
          </div>

          {/* Video */}
          {activeSubtopic.video_url && (
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <PlayCircle size={15} className="text-sky-600" />
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Video Lecture</span>
              </div>
              <div className="aspect-video w-full bg-slate-900">
                <iframe src={activeSubtopic.video_url} title={activeSubtopic.title}
                  className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            </div>
          )}

          {/* Notes */}
          {activeSubtopic.notes_markdown && (
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <BookOpen size={15} className="text-sky-600" />
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Study Notes</span>
              </div>
              <div className="p-6 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-mono bg-slate-50">
                {activeSubtopic.notes_markdown}
              </div>
            </div>
          )}

          {/* Quiz */}
          {quizzes.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <HelpCircle size={15} className="text-emerald-600" />
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Practice Quiz</span>
              </div>
              <div className="p-6 space-y-5">
                {quizzes.map((q, idx) => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-bold text-slate-900">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = selectedAnswers[q.id] === oi
                        const isCorrect = q.correct_index === oi
                        let cls = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        if (quizSubmitted) {
                          cls = isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                            : isSelected ? 'bg-rose-100 border-rose-400 text-rose-900' : 'bg-white border-slate-200 text-slate-400'
                        } else if (isSelected) {
                          cls = 'bg-sky-100 border-sky-400 text-sky-900 font-bold'
                        }
                        return (
                          <button key={oi} disabled={quizSubmitted} onClick={() => setSelectedAnswers(p => ({ ...p, [q.id]: oi }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all ${cls}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {!quizSubmitted
                  ? <button onClick={submitQuiz} disabled={Object.keys(selectedAnswers).length < quizzes.length}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all shadow-md">
                      Submit Quiz & Claim XP
                    </button>
                  : <div className="bg-emerald-100 border border-emerald-300 rounded-2xl px-5 py-3 text-emerald-900 text-xs font-bold flex items-center gap-2">
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
