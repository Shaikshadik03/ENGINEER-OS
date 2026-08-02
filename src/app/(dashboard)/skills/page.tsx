'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Award, Search, Sparkles, CheckCircle2, Plus, ArrowRight,
  Code2, Cpu, Database, Cloud, Brain, Layers, BookOpen, ExternalLink, X
} from 'lucide-react'

interface SkillItem {
  id: string
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'DSA' | 'DevOps' | 'AI & Data'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: string
  description: string
  topics: string[]
  cheatsheetSummary: string
  learningUrl?: string
}

const ALL_SKILLS: SkillItem[] = [
  // --- FRONTEND ENGINEERING ---
  {
    id: 'html5',
    name: 'HTML5 & Semantic Web',
    category: 'Frontend',
    level: 'Beginner',
    icon: '🌐',
    description: 'Structure web pages using semantic HTML elements, accessible forms, meta tags, and SEO standards.',
    topics: ['Semantic Elements (header, nav, article, section)', 'Accessibility (a11y & ARIA roles)', 'Forms & Validation', 'Meta Tags & OpenGraph SEO'],
    cheatsheetSummary: 'HTML5 forms the structural backbone of web applications. Semantic tags improve screen-reader accessibility and Google SEO indexing.'
  },
  {
    id: 'css3',
    name: 'CSS3 & Modern Layouts',
    category: 'Frontend',
    level: 'Beginner',
    icon: '🎨',
    description: 'Design responsive, modern UIs using Flexbox, CSS Grid, animations, variables, and media queries.',
    topics: ['Flexbox & Alignment', 'CSS Grid 2D Layouts', 'CSS Custom Properties (Variables)', 'Keyframe Animations & Transitions', 'Responsive Media Queries'],
    cheatsheetSummary: 'Flexbox handles 1D layout rows/columns while CSS Grid powers 2D page layouts. Always mobile-first using min-width media queries.'
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '🟡',
    description: 'Master core JS logic, closures, async/await, DOM manipulation, promises, and modern ES6+ features.',
    topics: ['Arrow Functions & Destructuring', 'Async/Await & Promises', 'Closures & Scope Chain', 'Event Loop & Call Stack', 'Fetch API & JSON handling'],
    cheatsheetSummary: 'JavaScript is single-threaded and non-blocking via the Event Loop. Master Promises and Async/Await for API communication.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '📘',
    description: 'Add static typing to JavaScript for bug-free, scaleable production applications.',
    topics: ['Interfaces vs Types', 'Generics & Type Constraints', 'Union & Intersection Types', 'Utility Types (Partial, Record, Pick)', 'Strict Null Checks'],
    cheatsheetSummary: 'TypeScript catches type mismatch bugs at compile-time before code ever runs in the browser.'
  },
  {
    id: 'react',
    name: 'React 18 & Hooks',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '⚛️',
    description: 'Build component-driven user interfaces using state, props, hooks, and virtual DOM rendering.',
    topics: ['useState & useEffect Hooks', 'useContext & State Lifting', 'useMemo & useCallback Performance', 'Custom Hooks Creation', 'Component Lifecycle'],
    cheatsheetSummary: 'React uses declarative component state. Keep state minimal and compute derived values inside render.'
  },
  {
    id: 'nextjs',
    name: 'Next.js 14+ (App Router)',
    category: 'Frontend',
    level: 'Advanced',
    icon: '▲',
    description: 'Production React framework with Server Components, SSR, SSG, API routes, and Turbopack.',
    topics: ['App Router Directory Structure', 'Server vs Client Components', 'API Routes & Middleware', 'Server Actions & Mutations', 'SEO & Dynamic Metadata'],
    cheatsheetSummary: 'Next.js pre-renders HTML on the server for ultra-fast page loads and top search engine rankings.'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '💨',
    description: 'Utility-first CSS framework for rapidly prototyping sleek, dark-themed responsive user interfaces.',
    topics: ['Utility Classes & Arbitrary Values', 'Hover, Focus, & Active States', 'Dark Mode Strategy', 'Responsive Prefixes (sm, md, lg)', 'Custom Config & Theme Extensions'],
    cheatsheetSummary: 'Tailwind eliminates CSS bloat by keeping styles utility-first directly in HTML/JSX markup.'
  },
  {
    id: 'redux-zustand',
    name: 'State Management (Zustand / Redux)',
    category: 'Frontend',
    level: 'Advanced',
    icon: '📦',
    description: 'Manage global application state cleanly across complex multi-page web applications.',
    topics: ['Global Store Creation', 'Actions & Mutators', 'Async State Persistence', 'Selectors & Re-render Optimization'],
    cheatsheetSummary: 'Zustand provides zero-boilerplate lightweight global state, ideal for modern Next.js applications.'
  },

  // --- BACKEND ENGINEERING ---
  {
    id: 'nodejs',
    name: 'Node.js & Runtime',
    category: 'Backend',
    level: 'Intermediate',
    icon: '🟢',
    description: 'Execute JavaScript on the server side using Node.js event-driven non-blocking I/O architecture.',
    topics: ['Event Loop & Worker Threads', 'File System (fs) & Buffer', 'HTTP Module & Server Setup', 'NPM Package Management'],
    cheatsheetSummary: 'Node.js handles high concurrent requests smoothly thanks to asynchronous non-blocking event-driven architecture.'
  },
  {
    id: 'express',
    name: 'Express.js & REST APIs',
    category: 'Backend',
    level: 'Intermediate',
    icon: '🚀',
    description: 'Build fast, unopinionated RESTful HTTP APIs, custom middleware, and request/response routing.',
    topics: ['REST API Endpoint Design', 'Custom Middleware & Logging', 'CORS & Security Headers', 'Error Handling Middleware'],
    cheatsheetSummary: 'REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE) returning JSON responses to frontends.'
  },
  {
    id: 'python-backend',
    name: 'Python (Django / FastAPI)',
    category: 'Backend',
    level: 'Intermediate',
    icon: '🐍',
    description: 'Build scalable backend services, microservices, and AI-integrated APIs using FastAPI and Django.',
    topics: ['Pydantic Data Validation', 'FastAPI Async Routes', 'Django ORM & Admin Panel', 'Swagger Auto-Generated Docs'],
    cheatsheetSummary: 'FastAPI provides automatic OpenAPI docs and type-validated JSON endpoints using Pydantic.'
  },

  // --- DATABASES & STORAGE ---
  {
    id: 'postgresql',
    name: 'PostgreSQL & Relational SQL',
    category: 'Database',
    level: 'Intermediate',
    icon: '🐘',
    description: 'Design relational database schemas, write complex JOIN queries, indexes, and transactions.',
    topics: ['SELECT, JOIN, GROUP BY Queries', 'Primary & Foreign Key Constraints', 'B-Tree Indexing & Performance', 'ACID Transactions & Row Locking'],
    cheatsheetSummary: 'PostgreSQL guarantees ACID reliability and high performance using indexes for fast lookup queries.'
  },
  {
    id: 'supabase',
    name: 'Supabase BaaS',
    category: 'Database',
    level: 'Intermediate',
    icon: '⚡',
    description: 'Open-source Firebase alternative providing instant Postgres DB, Auth, Realtime, and Row Level Security (RLS).',
    topics: ['Row Level Security (RLS Policies)', 'Supabase Auth & JWT Tokens', 'Realtime Subscriptions', 'Storage Buckets & Media Uploads'],
    cheatsheetSummary: 'RLS policies enforce user data security at database level so frontend clients can query securely.'
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    id: 'dsa-arrays',
    name: 'DSA: Arrays & Two Pointers',
    category: 'DSA',
    level: 'Intermediate',
    icon: '🔢',
    description: 'Master array manipulation, sliding window, two pointer techniques, and binary search.',
    topics: ['Two Pointers Strategy', 'Sliding Window Pattern', 'Binary Search O(log N)', 'Prefix Sum & Subarrays'],
    cheatsheetSummary: 'Two pointers and sliding window reduce O(N^2) brute force array problems down to O(N) linear time.'
  },
  {
    id: 'dsa-dp',
    name: 'DSA: Dynamic Programming',
    category: 'DSA',
    level: 'Advanced',
    icon: '🧩',
    description: 'Solve complex recursive problems by breaking them into subproblems with memoization and tabulation.',
    topics: ['Memoization (Top-Down)', 'Tabulation (Bottom-Up)', '0/1 Knapsack Pattern', 'Longest Common Subsequence'],
    cheatsheetSummary: 'DP optimizes exponential recursive algorithms down to polynomial time by storing subproblem answers.'
  },

  // --- DEVOPS & CLOUD ---
  {
    id: 'git-github',
    name: 'Git & GitHub Version Control',
    category: 'DevOps',
    level: 'Beginner',
    icon: '🐙',
    description: 'Track code history, create feature branches, solve merge conflicts, and collaborate on GitHub.',
    topics: ['Git Commit, Push, Pull & Rebase', 'Branching Strategy (main, feat)', 'Merge Conflict Resolution', 'GitHub Pull Requests & Reviews'],
    cheatsheetSummary: 'Git tracks version history. Use descriptive commit messages and feature branches for clean teamwork.'
  },
  {
    id: 'docker',
    name: 'Docker & Containerization',
    category: 'DevOps',
    level: 'Intermediate',
    icon: '🐳',
    description: 'Package applications and dependencies into lightweight portable Docker containers.',
    topics: ['Dockerfile Directives (FROM, RUN, CMD)', 'Docker Compose Multi-Container', 'Image Layer Caching', 'Port Mapping & Volumes'],
    cheatsheetSummary: 'Docker ensures your application runs identically across development, staging, and production servers.'
  }
]

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DSA', 'DevOps', 'AI & Data']

export default function SkillsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [userMastered, setUserMastered] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalSkill, setActiveModalSkill] = useState<SkillItem | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setUserMastered(Array.isArray(data.mastered_skills) ? data.mastered_skills : [])
      }
    }
    load()
  }, [])

  const toggleSkillMastery = async (skillName: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to sync skills with your profile!')
      return
    }

    setUpdatingId(skillName)
    let updated: string[] = []
    if (userMastered.includes(skillName)) {
      updated = userMastered.filter(s => s !== skillName)
    } else {
      updated = [...userMastered, skillName]
    }

    setUserMastered(updated)

    // Sync with Supabase profiles table
    const { error } = await supabase.from('profiles').update({
      mastered_skills: updated
    }).eq('id', user.id)

    if (error) {
      console.error('Error updating skills:', error)
    }
    setUpdatingId(null)
  }

  // Filter skills
  const filteredSkills = ALL_SKILLS.filter(skill => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="text-indigo-400" size={24} /> B.Tech Skills Matrix & Mastery Hub
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Explore industry skills, study core concepts, and mark mastered skills directly to your Engineer OS profile.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111118] border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400">
          <Sparkles size={16} /> {userMastered.length} Skills Mastered
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111118] border border-white/10 rounded-2xl p-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative shrink-0 md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills or concepts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map(skill => {
          const isMastered = userMastered.includes(skill.name)
          const isUpdating = updatingId === skill.name

          return (
            <div
              key={skill.id}
              className={`bg-[#111118] border rounded-2xl p-5 flex flex-col justify-between transition-all group hover:border-indigo-500/40 ${
                isMastered ? 'border-emerald-500/30 bg-emerald-500/2' : 'border-white/10'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border shrink-0 ${
                    skill.level === 'Beginner' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    skill.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {skill.level}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {skill.description}
                </p>

                {/* Topics Pills */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Key Concepts:</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] bg-white/5 border border-white/8 text-gray-300 px-2 py-0.5 rounded">
                        {topic}
                      </span>
                    ))}
                    {skill.topics.length > 3 && (
                      <span className="text-[10px] text-gray-500">+{skill.topics.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalSkill(skill)}
                  className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <BookOpen size={13} /> Cheatsheet
                </button>

                <button
                  onClick={() => toggleSkillMastery(skill.name)}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    isMastered
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {isMastered ? (
                    <>
                      <CheckCircle2 size={13} /> Mastered
                    </>
                  ) : (
                    <>
                      <Plus size={13} /> Add to Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cheatsheet Modal */}
      {activeModalSkill && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalSkill.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{activeModalSkill.name}</h3>
                  <span className="text-xs text-indigo-400 font-semibold">{activeModalSkill.category} • {activeModalSkill.level}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalSkill(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Core Cheatsheet Summary
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                {activeModalSkill.cheatsheetSummary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Topics to Master:</h4>
              <div className="space-y-1.5">
                {activeModalSkill.topics.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300 bg-white/3 border border-white/5 rounded-lg px-3 py-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setActiveModalSkill(null)}
                className="flex-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold py-2.5 rounded-xl hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toggleSkillMastery(activeModalSkill.name)
                  setActiveModalSkill(null)
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                {userMastered.includes(activeModalSkill.name) ? 'Remove from Profile' : 'Mark as Mastered (+XP)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
