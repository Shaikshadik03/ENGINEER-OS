'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Award, Search, Sparkles, CheckCircle2, Plus, ArrowRight, ArrowLeft,
  Code2, Cpu, Database, Cloud, Brain, Layers, BookOpen, ExternalLink, X,
  Calendar, Terminal, Check, Play, Zap, Flame, ShieldCheck, Lock, Unlock,
  MessageSquare, Users, Trophy, ChevronRight, ChevronDown, ChevronUp, Star, Compass, UserCheck,
  BookMarked, HelpCircle, Layers3, Video, FileText, Code, CheckSquare
} from 'lucide-react'

// --- MULTI-TIER DRILLDOWN TAXONOMY ---
// Skill (Square Card) -> Module -> Lesson -> Subtopic (Video, Notes, Code, Quiz)

interface MiniChallenge {
  id: string
  title: string
  prompt: string
  starterCode: string
  expectedKeywords: string[]
  xpReward: number
  hint: string
}

interface SubTopic {
  id: string
  title: string
  explanation: string
  youtubeEmbedId?: string
  codeSnippet?: string
  realWorldMatch?: string
}

interface Lesson {
  id: string
  title: string
  duration: string
  xp: number
  takeaway: string
  subtopics: SubTopic[]
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  challenge: MiniChallenge
}

interface SkillNode {
  id: string
  name: string
  domain: 'Programming' | 'Core CS' | 'Dev Tools' | 'Web Dev' | 'AI & ML' | 'Communication' | 'Career Prep'
  icon: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  totalXp: number
  description: string
  modules: Module[]
}

const SKILL_TREE: SkillNode[] = [
  // ── 1. PROGRAMMING FUNDAMENTALS ──
  {
    id: 'python-mastery',
    name: 'Python 3 & Backend Scripting',
    domain: 'Programming',
    icon: '🐍',
    tier: 'Gold',
    totalXp: 750,
    description: 'Complete Python journey from basic syntax and data structures to async concurrency, Pydantic, and FastAPI.',
    modules: [
      {
        id: 'py-mod-1',
        title: 'Module 1: Syntax, Strings & Data Structures',
        description: 'Variables, f-strings, lists, dicts, tuples, and JSON manipulation.',
        lessons: [
          {
            id: 'py-l1',
            title: 'Lesson 1.1: Variables, Inputs & f-string Formatting',
            duration: '5 min',
            xp: 20,
            takeaway: 'f-strings allow embedding expressions directly in strings using f"Hello {name}".',
            subtopics: [
              {
                id: 'py-s1-1',
                title: 'Topic 1: Variable Declaration & Dynamic Types',
                explanation: 'Python uses dynamic typing. Variables do not require explicit type declarations when assigned.',
                youtubeEmbedId: 'kqtD5dpn9C8',
                codeSnippet: 'name = "Shadik"\nrole = "Forward Deployed Engineer"\nage = 19\nprint(type(name))  # <class \'str\'>',
                realWorldMatch: 'AIRA-OS environment variable fetching: os.getenv("GEMINI_API_KEY")'
              },
              {
                id: 'py-s1-2',
                title: 'Topic 2: String Interpolation & Modern f-strings',
                explanation: 'f-strings (introduced in Python 3.6) allow executing Python expressions directly inside curly braces {}.',
                youtubeEmbedId: 'vTX3y7p5JqU',
                codeSnippet: 'user = "Shadik"\nscore = 95\nprint(f"User {user.upper()} achieved an ATS score of {score}%.")',
                realWorldMatch: 'Formatting Gemini AI system prompt strings in /api/ai/chat'
              }
            ]
          },
          {
            id: 'py-l2',
            title: 'Lesson 1.2: Lists, Dictionaries & JSON Parsing',
            duration: '8 min',
            xp: 25,
            takeaway: 'Dictionaries store key-value pairs matching JSON API payloads.',
            subtopics: [
              {
                id: 'py-s2-1',
                title: 'Topic 1: Python Lists & Mutability',
                explanation: 'Lists are ordered, mutable sequences that store heterogeneous items.',
                youtubeEmbedId: 'tw7ror9x32s',
                codeSnippet: 'skills = ["Python", "C", "FastAPI"]\nskills.append("React")\nskills.sort()\nprint(skills)',
                realWorldMatch: 'Managing student mastered_skills arrays in Supabase profiles'
              },
              {
                id: 'py-s2-2',
                title: 'Topic 2: Dictionaries & REST API JSON Payloads',
                explanation: 'Python dictionaries map keys to values, forming the exact structure of JSON REST API responses.',
                youtubeEmbedId: 'daefaLgNkw0',
                codeSnippet: 'payload = {\n    "user_id": "123",\n    "mastered_skills": ["Python", "FastAPI"]\n}\nprint(payload.get("mastered_skills"))',
                realWorldMatch: 'Parsing Supabase database rows and Next.js backend JSON bodies'
              }
            ]
          }
        ],
        challenge: {
          id: 'py-ch-1',
          title: 'Mini-Challenge: Build an API Payload Parser',
          prompt: 'Write a Python script that takes a dictionary `user`, appends "FastAPI" to `user["skills"]`, and prints `f"User {user[\'name\']} has {len(user[\'skills\'])} skills"`.',
          starterCode: 'user = {"name": "Shadik", "skills": ["Python"]}\n\n# Your code here:\n',
          expectedKeywords: ['append', 'len', 'print'],
          xpReward: 75,
          hint: 'Use user["skills"].append("FastAPI") and format with f-string.'
        }
      },
      {
        id: 'py-mod-2',
        title: 'Module 2: Functions, Decorators & OOP',
        description: 'Functions with type hints, custom decorators, and Object-Oriented classes.',
        lessons: [
          {
            id: 'py-l4',
            title: 'Lesson 2.1: Functions, Default Args & Type Hints',
            duration: '6 min',
            xp: 25,
            takeaway: 'Type hints improve IDE autocompletion and prevent runtime bugs.',
            subtopics: [
              {
                id: 'py-s4-1',
                title: 'Topic 1: Type Hints & Function Signatures',
                explanation: 'Python type hints specify parameter and return types for clarity.',
                youtubeEmbedId: 'Q5A5l5ZubMs',
                codeSnippet: 'from typing import List\ndef calculate_gpa(grades: List[float]) -> float:\n    return sum(grades) / len(grades)',
                realWorldMatch: 'FastAPI route handler functions and parameters'
              }
            ]
          }
        ],
        challenge: {
          id: 'py-ch-2',
          title: 'Mini-Challenge: Create a Student Class',
          prompt: 'Create a Python class `Student` with `__init__(self, name)` and a method `add_skill(self, skill)` that appends to `self.skills`.',
          starterCode: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        self.skills = []\n\n    # Add method here:\n',
          expectedKeywords: ['def', 'add_skill', 'self', 'append'],
          xpReward: 100,
          hint: 'def add_skill(self, skill): self.skills.append(skill)'
        }
      }
    ]
  },
  {
    id: 'c-programming',
    name: 'C & Low-Level Memory Management',
    domain: 'Programming',
    icon: '©️',
    tier: 'Silver',
    totalXp: 500,
    description: 'From variables and arrays to pointers, dereferencing, structs, and dynamic memory allocation (malloc/free).',
    modules: [
      {
        id: 'c-mod-1',
        title: 'Module 1: Variables, Data Types & Control Flow',
        description: 'Compiling C code, printf, scanf, loops, and array manipulation.',
        lessons: [
          {
            id: 'c-l1',
            title: 'Lesson 1.1: Compiling C Code & Pointer Arithmetic',
            duration: '5 min',
            xp: 20,
            takeaway: 'C code compiles to machine bytecode via GCC. Use %d for integers.',
            subtopics: [
              {
                id: 'c-s1-1',
                title: 'Topic 1: Pointer Dereferencing & Addresses',
                explanation: '& gets memory address, * dereferences pointer value.',
                youtubeEmbedId: '2ybLD6_2gKM',
                codeSnippet: 'int x = 42;\nint *ptr = &x;\nprintf("Value: %d\\n", *ptr);',
                realWorldMatch: 'Understanding memory allocation in OS kernels'
              }
            ]
          }
        ],
        challenge: {
          id: 'c-ch-1',
          title: 'Mini-Challenge: Calculate Array Sum in C',
          prompt: 'Write a loop inside `int main()` that sums the elements of `int arr[3] = {5, 10, 15};` and prints the sum using `printf`.',
          starterCode: '#include <stdio.h>\nint main() {\n    int arr[3] = {5, 10, 15};\n    int sum = 0;\n    // Write loop here:\n}',
          expectedKeywords: ['for', 'sum', 'printf', 'return'],
          xpReward: 75,
          hint: 'for(int i=0; i<3; i++) sum += arr[i]; printf("%d", sum);'
        }
      }
    ]
  },
  {
    id: 'dsa-mastery',
    name: 'Data Structures & Algorithms (DSA)',
    domain: 'Programming',
    icon: '🧩',
    tier: 'Diamond',
    totalXp: 900,
    description: 'Arrays, Two Pointers, Linked Lists, Trees, Graphs, and Dynamic Programming algorithms.',
    modules: [
      {
        id: 'dsa-mod-1',
        title: 'Module 1: Arrays, Two Pointers & Sliding Window',
        description: 'Linear time O(N) array techniques to eliminate O(N^2) brute force loops.',
        lessons: [
          {
            id: 'dsa-l1',
            title: 'Lesson 1.1: Two Pointers & Sliding Window',
            duration: '8 min',
            xp: 25,
            takeaway: 'Two pointers move inward from opposite ends of a sorted array.',
            subtopics: [
              {
                id: 'dsa-s1-1',
                title: 'Topic 1: Two Pointers Pattern',
                explanation: 'Reduces O(N^2) search down to O(N) linear scan.',
                youtubeEmbedId: 'On03HWe2tZM',
                codeSnippet: 'def two_sum(nums, target):\n    l, r = 0, len(nums)-1\n    while l < r:\n        s = nums[l] + nums[r]\n        if s == target: return [l, r]\n        elif s < target: l += 1\n        else: r -= 1',
                realWorldMatch: 'Optimizing search algorithms in backend databases'
              }
            ]
          }
        ],
        challenge: {
          id: 'dsa-ch-1',
          title: 'Mini-Challenge: Binary Search O(log N)',
          prompt: 'Write a Python function `binary_search(nums, target)` returning target index or -1.',
          starterCode: 'def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    # Loop here:\n',
          expectedKeywords: ['while', 'mid', 'left', 'right'],
          xpReward: 100,
          hint: 'while left <= right: mid = (left + right) // 2 ...'
        }
      }
    ]
  },
  {
    id: 'tech-communication',
    name: 'Technical Communication & Code Pitching',
    domain: 'Communication',
    icon: '🗣️',
    tier: 'Gold',
    totalXp: 600,
    description: 'Master explaining project architecture, thinking out loud during DSA interviews, and technical presentations.',
    modules: [
      {
        id: 'comm-mod-1',
        title: 'Module 1: The 3-Step Technical Explanation Framework',
        description: 'Goal -> High-Level Data Flow -> Technical Trade-offs.',
        lessons: [
          {
            id: 'comm-l1',
            title: 'Lesson 1.1: The 3-Step Code Explanation Framework',
            duration: '6 min',
            xp: 25,
            takeaway: 'Step 1: Goal -> Step 2: Data Flow -> Step 3: Trade-offs.',
            subtopics: [
              {
                id: 'comm-s1-1',
                title: 'Topic 1: Explaining System Architecture Out Loud',
                explanation: 'Start with high-level user goal, then walk through data flow, finish with latency/scale trade-offs.',
                youtubeEmbedId: 'W21D4X8_mQc',
                codeSnippet: 'Framework:\n1. Goal: Parse resumes into structured ATS metrics.\n2. Tech Stack: Next.js frontend -> FastAPI backend -> PyPDF -> Gemini 1.5 API.\n3. Result: Returns full ATS matrix in under 800ms.',
                realWorldMatch: 'Explaining your Voice Agent & AIRA-OS architecture to tech recruiters'
              }
            ]
          }
        ],
        challenge: {
          id: 'comm-ch-1',
          title: 'Mini-Challenge: Craft a 3-Sentence Technical Pitch',
          prompt: 'Write a 3-sentence technical pitch explaining Engineer-OS to a tech interviewer using Goal, Tech Stack, and Impact.',
          starterCode: '// Write your 3-sentence explanation:\n',
          expectedKeywords: ['built', 'using', 'allows'],
          xpReward: 80,
          hint: 'Mention: "I built Engineer-OS using Next.js and Supabase. It allows students to track skills..."'
        }
      }
    ]
  }
]

const DOMAINS = ['All', 'Programming', 'Core CS', 'Dev Tools', 'Web Dev', 'Communication', 'Career Prep']

export default function GamifiedSkillsTreePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [userXp, setUserXp] = useState(150)
  const [streak, setStreak] = useState(3)
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Drilldown Navigation State:
  // selectedSkill -> selectedModule -> selectedLesson -> selectedSubtopic
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null)

  const [activeChallenge, setActiveChallenge] = useState<{ challenge: MiniChallenge; skillId: string } | null>(null)
  const [challengeCode, setChallengeCode] = useState('')
  const [challengeFeedback, setChallengeFeedback] = useState<{ success: boolean; msg: string } | null>(null)
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set(['py-ch-1']))
  const [completedSubtopicIds, setCompletedSubtopicIds] = useState<Set<string>>(new Set(['py-s1-1']))

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setUserXp(data.xp || 150)
        setStreak(data.streak || 3)
      }
    }
    load()
  }, [])

  // Navigation Helpers
  const handleSelectSkill = (skill: SkillNode) => {
    setSelectedSkill(skill)
    setSelectedModule(skill.modules[0] || null)
    setSelectedLesson(null)
    setSelectedSubtopic(null)
  }

  const handleSelectModule = (mod: Module) => {
    setSelectedModule(mod)
    setSelectedLesson(null)
    setSelectedSubtopic(null)
  }

  const handleSelectLesson = (les: Lesson) => {
    setSelectedLesson(les)
    setSelectedSubtopic(les.subtopics[0] || null)
  }

  // Toggle Subtopic Completion
  const toggleSubtopicCompletion = async (subId: string, xpAmount: number) => {
    const nextCompleted = new Set(completedSubtopicIds)
    let addedXp = 0

    if (nextCompleted.has(subId)) {
      nextCompleted.delete(subId)
      addedXp = -xpAmount
    } else {
      nextCompleted.add(subId)
      addedXp = xpAmount
    }

    setCompletedSubtopicIds(nextCompleted)
    const newXp = Math.max(0, userXp + addedXp)
    setUserXp(newXp)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id)
    }
  }

  // Verify Mini-Challenge
  const handleVerifyChallenge = async () => {
    if (!activeChallenge) return
    const { challenge } = activeChallenge

    const codeLower = challengeCode.toLowerCase()
    const missingKw = challenge.expectedKeywords.filter(kw => !codeLower.includes(kw.toLowerCase()))

    if (missingKw.length === 0) {
      setChallengeFeedback({ success: true, msg: `🎉 Challenge Passed! +${challenge.xpReward} XP Awarded!` })
      setCompletedChallengeIds(prev => new Set([...prev, challenge.id]))

      const newXp = userXp + challenge.xpReward
      setUserXp(newXp)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id)
      }
    } else {
      setChallengeFeedback({
        success: false,
        msg: `⚠️ Missing required pattern/keyword: "${missingKw.join(', ')}". Check the hint and try again!`
      })
    }
  }

  const filteredSkills = SKILL_TREE.filter(skill => {
    const matchesDomain = selectedDomain === 'All' || skill.domain === selectedDomain
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDomain && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Top Banner: Gamified XP & Level Header */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Deep Drilldown Architecture
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <MessageSquare size={12} /> Soft Skills Included
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Full-Stack & Communication Skill Hub</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click any skill card to drill down step-by-step: Modules → Lessons → Topics & Subtopics → Video Lectures & Code Examples!
          </p>
        </div>

        {/* User Stats Card */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl shrink-0">
          <div className="text-center pr-3 border-r border-white/10">
            <span className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1 uppercase">
              <Flame size={13} /> STREAK
            </span>
            <span className="text-2xl font-extrabold text-white">{streak}d</span>
          </div>
          <div className="text-center pl-1">
            <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 uppercase">
              <Trophy size={13} /> TOTAL XP
            </span>
            <span className="text-2xl font-extrabold text-emerald-400">{userXp} XP</span>
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB NAVIGATION (When inside a skill) ── */}
      {selectedSkill && (
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
            <button
              onClick={() => { setSelectedSkill(null); setSelectedModule(null); setSelectedLesson(null); setSelectedSubtopic(null); }}
              className="text-indigo-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Skills Grid
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-white flex items-center gap-1">
              {selectedSkill.icon} {selectedSkill.name}
            </span>

            {selectedModule && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-indigo-300">{selectedModule.title.split(':')[0]}</span>
              </>
            )}

            {selectedLesson && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-emerald-300">{selectedLesson.title.split(':')[0]}</span>
              </>
            )}
          </div>

          <button
            onClick={() => { setSelectedSkill(null); setSelectedModule(null); setSelectedLesson(null); setSelectedSubtopic(null); }}
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10"
          >
            Exit Skill ✕
          </button>
        </div>
      )}

      {/* ── VIEW 1: INITIAL CLEAN SQUARE SKILLS GRID ── */}
      {!selectedSkill && (
        <div className="space-y-6">
          {/* Domain Navigation Filter & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111118] border border-white/10 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {DOMAINS.map(dom => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDomain === dom
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            <div className="relative shrink-0 md:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search skill nodes..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Square Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map(skill => {
              const totalLessonsCount = skill.modules.reduce((acc, m) => acc + m.lessons.length, 0)

              return (
                <div
                  key={skill.id}
                  onClick={() => handleSelectSkill(skill)}
                  className="bg-[#111118] border border-white/10 rounded-2xl p-6 cursor-pointer transition-all group hover:border-indigo-500/50 hover:bg-indigo-500/2 flex flex-col justify-between h-56"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-4xl p-2 bg-white/5 rounded-2xl border border-white/8 shrink-0">{skill.icon}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        skill.tier === 'Diamond' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                        skill.tier === 'Gold' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        'bg-slate-300/10 text-slate-200 border-slate-300/30'
                      }`}>
                        {skill.tier}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span className="text-[11px] font-semibold text-gray-400">{skill.modules.length} Modules • {totalLessonsCount} Lessons</span>
                    <span className="flex items-center gap-1">Open <ChevronRight size={15} /></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── VIEW 2: DEDICATED DEEP DRILLDOWN VIEW (Skill -> Module -> Lesson -> Topic) ── */}
      {selectedSkill && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* STEP 1: MODULE SELECTION BUTTONS IN A ROW */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">STEP 1: SELECT MODULE HEADING</span>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {selectedSkill.modules.map((mod, idx) => {
                const isActive = selectedModule?.id === mod.id

                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectModule(mod)}
                    className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2.5 border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Layers3 size={16} className={isActive ? 'text-white' : 'text-indigo-400'} />
                    <span>Module {idx + 1}: {mod.title.split(':')[1] || mod.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: LESSONS LIST UNDER SELECTED MODULE */}
          {selectedModule && (
            <div className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/8 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">STEP 2: SELECT LESSON TO DRILL DOWN</span>
                  <h2 className="text-base font-bold text-white mt-0.5">{selectedModule.title}</h2>
                </div>
                <button
                  onClick={() => {
                    setActiveChallenge({ challenge: selectedModule.challenge, skillId: selectedSkill.id })
                    setChallengeCode(selectedModule.challenge.starterCode)
                    setChallengeFeedback(null)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  <Terminal size={14} /> Start Module Challenge (+{selectedModule.challenge.xpReward} XP)
                </button>
              </div>

              {/* Lessons Row / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModule.lessons.map(les => {
                  const isSelected = selectedLesson?.id === les.id

                  return (
                    <div
                      key={les.id}
                      onClick={() => handleSelectLesson(les)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                          : 'bg-white/3 border-white/8 text-gray-300 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className={isSelected ? 'text-indigo-400' : 'text-gray-400'} />
                        <div>
                          <h4 className="text-xs font-bold text-white">{les.title}</h4>
                          <span className="text-[10px] text-gray-400">{les.subtopics.length} Topics • {les.duration}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={isSelected ? 'text-indigo-400' : 'text-gray-500'} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TOPIC & SUBTOPIC DEEP DIVE (VIDEO, NOTES, CODE & QUIZ!) */}
          {selectedLesson && (
            <div className="bg-[#111118] border border-indigo-500/40 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">STEP 3: TOPIC & LESSON DEEP DIVE</span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedLesson.title}</h2>
                <p className="text-xs text-gray-400 mt-1">💡 Key Takeaway: {selectedLesson.takeaway}</p>
              </div>

              {/* Topic Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
                {selectedLesson.subtopics.map(sub => {
                  const isActive = selectedSubtopic?.id === sub.id
                  const isDone = completedSubtopicIds.has(sub.id)

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubtopic(sub)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                        isActive
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> : <FileText size={14} />}
                      <span>{sub.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Selected Topic Content Breakdown */}
              {selectedSubtopic && (
                <div className="space-y-6 pt-2">
                  {/* 1. Video Lecture Embed */}
                  {selectedSubtopic.youtubeEmbedId && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Video size={16} className="text-rose-400" /> Video Lecture & Tutorial
                      </h4>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${selectedSubtopic.youtubeEmbedId}`}
                          title={selectedSubtopic.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. Detailed Study Notes */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-wider">
                      <FileText size={15} /> Topic Concept & Study Notes
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-mono">
                      {selectedSubtopic.explanation}
                    </p>

                    {selectedSubtopic.realWorldMatch && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-block">
                          ⚡ Real-World Code Match: {selectedSubtopic.realWorldMatch}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. Code Example / Code Snippet */}
                  {selectedSubtopic.codeSnippet && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Code size={16} className="text-emerald-400" /> Executable Code Example
                      </h4>
                      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
                        <pre>{selectedSubtopic.codeSnippet}</pre>
                      </div>
                    </div>
                  )}

                  {/* Mark Topic Complete */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => toggleSubtopicCompletion(selectedSubtopic.id, 20)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        completedSubtopicIds.has(selectedSubtopic.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {completedSubtopicIds.has(selectedSubtopic.id) ? (
                        <><Check size={16} /> Topic Completed</>
                      ) : (
                        <><CheckCircle2 size={16} /> Mark Topic Completed (+20 XP)</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── INTERACTIVE 10-LINE MINI-CHALLENGE MODAL ── */}
      {activeChallenge && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">INTERACTIVE MINI-CHALLENGE</span>
                <h3 className="text-base font-bold text-white mt-1">{activeChallenge.challenge.title}</h3>
              </div>
              <button
                onClick={() => setActiveChallenge(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed font-mono">
              💡 <strong className="text-white">Task:</strong> {activeChallenge.challenge.prompt}
            </div>

            {/* Code Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Write Code / Answer Solution:</label>
              <textarea
                rows={6}
                value={challengeCode}
                onChange={e => setChallengeCode(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-300 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Hint */}
            <p className="text-[11px] text-gray-500">
              💡 <strong className="text-gray-400">Hint:</strong> {activeChallenge.challenge.hint}
            </p>

            {/* Feedback */}
            {challengeFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                challengeFeedback.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {challengeFeedback.msg}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setActiveChallenge(null)}
                className="bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyChallenge}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Submit & Claim +{activeChallenge.challenge.xpReward} XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
