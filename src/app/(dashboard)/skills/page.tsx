'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Award, Search, Sparkles, CheckCircle2, Plus, ArrowRight, ArrowLeft,
  Code2, Cpu, Database, Cloud, Brain, Layers, BookOpen, ExternalLink, X,
  Calendar, Terminal, Check, Play, Zap, Flame, ShieldCheck, Lock, Unlock,
  MessageSquare, Users, Trophy, ChevronRight, ChevronDown, ChevronUp, Star, Compass, UserCheck,
  BookMarked, HelpCircle, Layers3, Video, FileText, Code, CheckSquare, MoreHorizontal
} from 'lucide-react'

// --- MULTI-TIER DRILLDOWN TAXONOMY ---
// Skill (Square Card / Sololearn Card) -> Module -> Lesson -> Subtopic (Video, Notes, Code, Quiz)

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

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
  quiz?: QuizQuestion
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
  badgeColor: string
  progress: number
  completedLessons: number
  totalLessons: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  totalXp: number
  description: string
  modules: Module[]
}

const SKILL_TREE: SkillNode[] = [
  {
    id: 'cpp-programming',
    name: 'Introduction to C++',
    domain: 'Programming',
    icon: 'C++',
    badgeColor: 'bg-sky-500 text-white',
    progress: 9,
    completedLessons: 4,
    totalLessons: 45,
    tier: 'Gold',
    totalXp: 650,
    description: 'Object-oriented C++ programming, classes, objects, pointers, and Standard Template Library (STL).',
    modules: [
      {
        id: 'cpp-mod-1',
        title: 'Module 1: C++ Basics & Object Orientation',
        description: 'std::cout, cin, classes, constructors, and vectors.',
        lessons: [
          {
            id: 'cpp-l1',
            title: 'Lesson 1.1: C++ I/O & Classes',
            duration: '6 min',
            xp: 25,
            takeaway: 'std::cout prints output; std::cin reads user input.',
            subtopics: [
              {
                id: 'cpp-s1',
                title: 'Topic 1: Classes & Objects',
                explanation: 'Classes define object blueprints containing properties and methods.',
                codeSnippet: '#include <iostream>\nclass Student {\npublic:\n    std::string name;\n};\nint main() {\n    Student s;\n    s.name = "Shadik";\n    std::cout << s.name;\n}'
              }
            ]
          }
        ],
        challenge: {
          id: 'cpp-ch-1',
          title: 'Code Coach: C++ Vector Operations',
          prompt: 'Create a vector<int>, push numbers 10 and 20, and print vector size.',
          starterCode: '#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    // Code here:\n}',
          expectedKeywords: ['push_back', 'size', 'cout'],
          xpReward: 60,
          hint: 'v.push_back(10); v.push_back(20); cout << v.size();'
        }
      }
    ]
  },
  {
    id: 'python-mastery',
    name: 'Python 3 & Backend Scripting',
    domain: 'Programming',
    icon: '🐍',
    badgeColor: 'bg-emerald-500 text-white',
    progress: 23,
    completedLessons: 4,
    totalLessons: 18,
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
            title: 'Lesson 1.1: Syntax & Hello World',
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
                realWorldMatch: 'AIRA-OS environment variable fetching: os.getenv("GEMINI_API_KEY")',
                quiz: {
                  question: "What will print(type('Hello')) output in Python?",
                  options: ["<class 'int'>", "<class 'str'>", "<class 'char'>", "<class 'text'>"],
                  correctIndex: 1,
                  explanation: "In Python, single or double quotes signify string data types ('str')."
                }
              }
            ]
          },
          {
            id: 'py-l2-vars',
            title: 'Lesson 2: Variables & Data Types',
            duration: '8 min',
            xp: 30,
            takeaway: 'Python dynamically infers variable types (int, float, str, bool, list, dict). Use type() to inspect.',
            subtopics: [
              {
                id: 'py-s2-1',
                title: 'Topic 1: Declaring Variables & Primitive Types',
                explanation: 'In Python, variables are created the moment you assign a value using =. You do not specify type keywords like int or String — Python automatically infers integers, floats, strings, and booleans.',
                youtubeEmbedId: 'kqtD5dpn9C8',
                codeSnippet: 'age = 19               # int\ngpa = 3.8              # float\nname = "Shadik"        # str\nis_enrolled = True     # bool\n\nprint(type(age))        # <class \'int\'>\nprint(type(gpa))        # <class \'float\'>\nprint(type(name))       # <class \'str\'>\nprint(type(is_enrolled))# <class \'bool\'>',
                realWorldMatch: 'Configuring user metadata in Supabase profile auth state',
                quiz: {
                  question: "What will print(type(3.0)) output in Python?",
                  options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
                  correctIndex: 1,
                  explanation: "Any number containing a decimal point in Python is stored as a float, even if it ends in .0."
                }
              }
            ]
          }
        ],
        challenge: {
          id: 'py-ch-codecoach-1',
          title: 'Code Coach: Profile Data Parser',
          prompt: 'Fill in the code blanks to convert raw string input "85" to an integer, add 15 bonus XP to it, and print output formatted as "Total XP: 100".',
          starterCode: 'raw_xp = "85"\n\n# Fill in blanks:\nnum_xp = int(raw_xp)\ntotal = num_xp + 15\nprint(f"Total XP: {total}")\n',
          expectedKeywords: ['int', '15', 'total', 'print'],
          xpReward: 50,
          hint: 'Use int(raw_xp) to convert, add 15, and print using an f-string.'
        }
      }
    ]
  },
  {
    id: 'csharp-programming',
    name: 'Introduction to C#',
    domain: 'Programming',
    icon: 'C#',
    badgeColor: 'bg-purple-600 text-white',
    progress: 0,
    completedLessons: 0,
    totalLessons: 50,
    tier: 'Silver',
    totalXp: 500,
    description: 'C# programming language fundamentals, .NET environment, Object-oriented principles, and LINQ.',
    modules: [
      {
        id: 'csharp-mod-1',
        title: 'Module 1: C# & .NET Basics',
        description: 'Console.WriteLine, variables, and methods.',
        lessons: [
          {
            id: 'cs-l1',
            title: 'Lesson 1.1: Hello C#',
            duration: '5 min',
            xp: 20,
            takeaway: 'Console.WriteLine outputs text to stdout in C#.',
            subtopics: [
              {
                id: 'cs-s1',
                title: 'Topic 1: Console Input Output',
                explanation: 'System.Console handles stdout and stdin streams in .NET.',
                codeSnippet: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello C#");\n    }\n}'
              }
            ]
          }
        ],
        challenge: {
          id: 'cs-ch-1',
          title: 'Code Coach: C# Greeting',
          prompt: 'Write a C# main method that prints "Welcome to Engineer OS".',
          starterCode: 'using System;\nclass Program {\n    static void Main() {\n        // Code here:\n    }\n}',
          expectedKeywords: ['Console', 'WriteLine'],
          xpReward: 50,
          hint: 'Console.WriteLine("Welcome to Engineer OS");'
        }
      }
    ]
  },
  {
    id: 'web-dev-course',
    name: 'Web Development',
    domain: 'Web Dev',
    icon: '🌐',
    badgeColor: 'bg-orange-500 text-white',
    progress: 23,
    completedLessons: 25,
    totalLessons: 108,
    tier: 'Diamond',
    totalXp: 900,
    description: 'HTML5, CSS3, JavaScript ES6+, DOM manipulation, Responsive design, and Web APIs.',
    modules: [
      {
        id: 'web-mod-1',
        title: 'Module 1: HTML5 & Modern CSS',
        description: 'Semantic markup, Flexbox, and CSS Grid layouts.',
        lessons: [
          {
            id: 'web-l1',
            title: 'Lesson 1.1: Semantic HTML5 Elements',
            duration: '6 min',
            xp: 25,
            takeaway: 'Semantic elements like <header>, <main>, and <section> improve SEO and accessibility.',
            subtopics: [
              {
                id: 'web-s1',
                title: 'Topic 1: Modern HTML Markup',
                explanation: 'Use semantic structure tags for clean document hierarchy.',
                codeSnippet: '<header>\n  <h1>Engineer OS</h1>\n</header>\n<main>\n  <p>Learn Full-Stack Development.</p>\n</main>'
              }
            ]
          }
        ],
        challenge: {
          id: 'web-ch-1',
          title: 'Code Coach: Build HTML Header',
          prompt: 'Create a semantic <header> tag containing an <h1> title.',
          starterCode: '<header>\n  <!-- Code here -->\n</header>',
          expectedKeywords: ['header', 'h1'],
          xpReward: 40,
          hint: '<h1>My Website</h1>'
        }
      }
    ]
  },
  {
    id: 'html-intro',
    name: 'Introduction to HTML',
    domain: 'Web Dev',
    icon: 'HTML',
    badgeColor: 'bg-amber-600 text-white',
    progress: 0,
    completedLessons: 0,
    totalLessons: 39,
    tier: 'Bronze',
    totalXp: 350,
    description: 'Structure web pages with headings, paragraphs, lists, links, images, and forms.',
    modules: [
      {
        id: 'html-mod-1',
        title: 'Module 1: HTML Basics',
        description: 'Tags, attributes, elements, and page structure.',
        lessons: [
          {
            id: 'html-l1',
            title: 'Lesson 1.1: HTML Tags & Attributes',
            duration: '4 min',
            xp: 15,
            takeaway: 'HTML tags wrap text content to define page elements.',
            subtopics: [
              {
                id: 'html-s1',
                title: 'Topic 1: Headings & Paragraphs',
                explanation: '<h1> to <h6> define heading levels; <p> defines paragraphs.',
                codeSnippet: '<h1>Hello World</h1>\n<p>This is a paragraph.</p>'
              }
            ]
          }
        ],
        challenge: {
          id: 'html-ch-1',
          title: 'Code Coach: Create Link',
          prompt: 'Write an anchor tag <a> pointing to https://engineer-os.com with text "Start Learning".',
          starterCode: '<!-- Code here -->',
          expectedKeywords: ['a', 'href', 'Start Learning'],
          xpReward: 35,
          hint: '<a href="https://engineer-os.com">Start Learning</a>'
        }
      }
    ]
  }
]

export default function GamifiedSkillsTreePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [userXp, setUserXp] = useState(150)
  const [streak, setStreak] = useState(3)
  const [activeTab, setActiveTab] = useState<'in_progress' | 'complete'>('in_progress')
  const [searchQuery, setSearchQuery] = useState('')

  // Drilldown Navigation State:
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubTopic | null>(null)
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({})

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

  // Verify Code Coach / Mini-Challenge
  const handleVerifyChallenge = async () => {
    if (!activeChallenge) return
    const { challenge } = activeChallenge

    const codeLower = challengeCode.toLowerCase()
    const missingKw = challenge.expectedKeywords.filter(kw => !codeLower.includes(kw.toLowerCase()))

    if (missingKw.length === 0) {
      setChallengeFeedback({ success: true, msg: `🎉 Task Passed! +${challenge.xpReward} XP Awarded!` })
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

  const inProgressSkills = SKILL_TREE.filter(s => s.progress < 100)
  const completedSkills = SKILL_TREE.filter(s => s.progress === 100)
  const currentSkills = activeTab === 'in_progress' ? inProgressSkills : completedSkills

  const filteredSkills = currentSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredCourse = SKILL_TREE.find(s => s.id === 'cpp-programming') || SKILL_TREE[0]
  const otherCourses = filteredSkills.filter(s => s.id !== featuredCourse.id)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500 text-slate-900">
      
      {/* ── BREADCRUMB NAVIGATION (INSIDE A COURSE) ── */}
      {selectedSkill ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
            <button
              onClick={() => { setSelectedSkill(null); setSelectedModule(null); setSelectedLesson(null); setSelectedSubtopic(null); }}
              className="text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} /> My Courses
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 flex items-center gap-1.5">
              <span className="text-base">{selectedSkill.icon}</span> {selectedSkill.name}
            </span>

            {selectedModule && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-sky-700">{selectedModule.title.split(':')[0]}</span>
              </>
            )}

            {selectedLesson && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-emerald-700">{selectedLesson.title.split(':')[0]}</span>
              </>
            )}
          </div>

          <button
            onClick={() => { setSelectedSkill(null); setSelectedModule(null); setSelectedLesson(null); setSelectedSubtopic(null); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Exit Course ✕
          </button>
        </div>
      ) : (
        /* ── EXACT SOLOLEARN WHITE THEME "MY COURSES" PAGE ── */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Courses</h1>
            
            {/* User Stats Pill */}
            <div className="flex items-center gap-4 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <Flame size={15} /> <span>{streak}d Streak</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Trophy size={15} /> <span>{userXp} XP</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('in_progress')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'in_progress'
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{inProgressSkills.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('complete')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'complete'
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Complete <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{completedSkills.length}</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search my courses..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* ── FEATURED "CONTINUE" COURSE CARD (SOLOLEARN MATCH) ── */}
          {activeTab === 'in_progress' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Round Brand Icon Badge */}
                  <div className={`w-14 h-14 rounded-full ${featuredCourse.badgeColor} flex items-center justify-center font-black text-lg shadow-md shrink-0`}>
                    {featuredCourse.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest block">CONTINUE</span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">{featuredCourse.name}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleSelectSkill(featuredCourse)}
                    className="flex-1 sm:flex-none bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                  >
                    Resume →
                  </button>
                  <button className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Stats */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2 text-xs font-bold">
                  <span className="text-2xl font-black text-slate-900">{featuredCourse.progress}%</span>
                  <span className="text-slate-500 font-semibold">{featuredCourse.completedLessons} of {featuredCourse.totalLessons} lessons</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${featuredCourse.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── COURSE LIST CARDS (SOLOLEARN MATCH) ── */}
          <div className="space-y-4">
            {otherCourses.map(skill => (
              <div
                key={skill.id}
                onClick={() => handleSelectSkill(skill)}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-5 cursor-pointer transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${skill.badgeColor} flex items-center justify-center font-black text-base shadow-sm shrink-0`}>
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {skill.completedLessons} of {skill.totalLessons} lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  {/* Progress Bar */}
                  <div className="w-36 sm:w-48 space-y-1.5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-900 min-w-[32px] text-right">
                    {skill.progress}%
                  </span>

                  <button className="p-2 rounded-xl text-slate-300 group-hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DEDICATED COURSE DRILLDOWN VIEW ── */}
      {selectedSkill && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* STEP 1: MODULE SELECTION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STEP 1: SELECT MODULE</span>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {selectedSkill.modules.map((mod, idx) => {
                const isActive = selectedModule?.id === mod.id

                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectModule(mod)}
                    className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2.5 border ${
                      isActive
                        ? 'bg-sky-600 border-sky-500 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers3 size={16} className={isActive ? 'text-white' : 'text-sky-600'} />
                    <span>Module {idx + 1}: {mod.title.split(':')[1] || mod.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: LESSONS LIST */}
          {selectedModule && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STEP 2: SELECT LESSON</span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedModule.title}</h2>
                </div>
                <button
                  onClick={() => {
                    setActiveChallenge({ challenge: selectedModule.challenge, skillId: selectedSkill.id })
                    setChallengeCode(selectedModule.challenge.starterCode)
                    setChallengeFeedback(null)
                  }}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Terminal size={14} /> Code Coach Task (+{selectedModule.challenge.xpReward} XP)
                </button>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModule.lessons.map(les => {
                  const isSelected = selectedLesson?.id === les.id

                  return (
                    <div
                      key={les.id}
                      onClick={() => handleSelectLesson(les)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center gap-3 ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-sm font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className={isSelected ? 'text-sky-600' : 'text-slate-400'} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{les.title}</h4>
                          <span className="text-[10px] text-slate-500">{les.subtopics.length} Topics • {les.duration} • +{les.xp} XP</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={isSelected ? 'text-sky-600' : 'text-slate-400'} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TOPIC & SUBTOPIC CONTENT */}
          {selectedLesson && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">STEP 3: LESSON TOPIC CONTENT</span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedLesson.title}</h2>
                <p className="text-xs text-slate-500 mt-1">💡 Key Takeaway: {selectedLesson.takeaway}</p>
              </div>

              {/* Topic Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                {selectedLesson.subtopics.map(sub => {
                  const isActive = selectedSubtopic?.id === sub.id
                  const isDone = completedSubtopicIds.has(sub.id)

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubtopic(sub)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                        isActive
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={14} className="text-emerald-600" /> : <FileText size={14} />}
                      <span>{sub.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Selected Topic Breakdown */}
              {selectedSubtopic && (
                <div className="space-y-6 pt-2">
                  {/* Video Tutorial */}
                  {selectedSubtopic.youtubeEmbedId && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Video size={16} className="text-rose-500" /> Video Tutorial
                      </h4>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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

                  {/* Study Notes (Sololearn Style) */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold text-sky-700 flex items-center gap-2 uppercase tracking-wider">
                      <FileText size={15} /> Topic Explanation
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed font-mono">
                      {selectedSubtopic.explanation}
                    </p>

                    {selectedSubtopic.realWorldMatch && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                          ⚡ Real-World Code Match: {selectedSubtopic.realWorldMatch}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Code Example */}
                  {selectedSubtopic.codeSnippet && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Code size={16} className="text-emerald-600" /> Code Example
                      </h4>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                        <pre>{selectedSubtopic.codeSnippet}</pre>
                      </div>
                    </div>
                  )}

                  {/* Sololearn Quiz Checkpoint */}
                  {selectedSubtopic.quiz && (
                    <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-sky-800 flex items-center gap-2 uppercase tracking-wider">
                        <HelpCircle size={15} /> Topic Quiz Checkpoint
                      </h4>
                      <p className="text-xs font-semibold text-slate-900">
                        {selectedSubtopic.quiz.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {selectedSubtopic.quiz.options.map((opt, idx) => {
                          const isSelected = selectedQuizAnswers[selectedSubtopic.id] === idx
                          const isCorrect = idx === selectedSubtopic.quiz!.correctIndex
                          const hasAnswered = selectedQuizAnswers[selectedSubtopic.id] !== undefined

                          let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          if (hasAnswered) {
                            if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                            else if (isSelected) btnStyle = 'bg-rose-100 border-rose-400 text-rose-900'
                          }

                          return (
                            <button
                              key={idx}
                              disabled={hasAnswered}
                              onClick={() => {
                                setSelectedQuizAnswers(prev => ({ ...prev, [selectedSubtopic.id]: idx }))
                              }}
                              className={`p-3 rounded-xl text-xs text-left border transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>

                      {selectedQuizAnswers[selectedSubtopic.id] !== undefined && (
                        <div className={`p-3 rounded-xl text-xs font-medium border ${
                          selectedQuizAnswers[selectedSubtopic.id] === selectedSubtopic.quiz.correctIndex
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : 'bg-rose-100 border-rose-300 text-rose-900'
                        }`}>
                          💡 {selectedSubtopic.quiz.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark Topic Complete */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => toggleSubtopicCompletion(selectedSubtopic.id, 20)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        completedSubtopicIds.has(selectedSubtopic.id)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
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

      {/* ── CODE COACH TASK MODAL ── */}
      {activeChallenge && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">CODE COACH PRACTICE TASK</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeChallenge.challenge.title}</h3>
              </div>
              <button
                onClick={() => setActiveChallenge(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed font-mono">
              💡 <strong className="text-slate-900">Task:</strong> {activeChallenge.challenge.prompt}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Write Code Solution:</label>
              <textarea
                rows={6}
                value={challengeCode}
                onChange={e => setChallengeCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 leading-relaxed focus:outline-none focus:border-sky-500"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              💡 <strong className="text-slate-700">Hint:</strong> {activeChallenge.challenge.hint}
            </p>

            {challengeFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold ${
                challengeFeedback.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {challengeFeedback.msg}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setActiveChallenge(null)}
                className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyChallenge}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
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
