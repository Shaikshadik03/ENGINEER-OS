'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Award, Search, Sparkles, CheckCircle2, Plus, ArrowRight,
  Code2, Cpu, Database, Cloud, Brain, Layers, BookOpen, ExternalLink, X,
  Calendar, Terminal, Check, Play, Zap, Flame, ShieldCheck, Lock, Unlock,
  MessageSquare, Users, Trophy, ChevronRight, Star, Compass, UserCheck,
  BookMarked, HelpCircle, Layers3
} from 'lucide-react'

// --- 4-LEVEL TAXONOMY DEFINITIONS ---
// Domain -> Skill -> Module -> Lesson & Mini-Challenge

interface MiniChallenge {
  id: string
  title: string
  prompt: string
  starterCode: string
  expectedKeywords: string[]
  xpReward: number
  hint: string
}

interface Lesson {
  id: string
  title: string
  duration: string
  xp: number
  takeaway: string
  codeSnippet?: string
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
        title: 'Module 1 (Basics): Syntax, Strings & Data Structures',
        description: 'Variables, f-strings, lists, dicts, tuples, and JSON manipulation.',
        lessons: [
          { id: 'py-l1', title: '1.1 Variables, Inputs & f-string Formatting', duration: '5 min', xp: 20, takeaway: 'f-strings allow embedding expressions directly in strings using f"Hello {name}".', codeSnippet: 'name = "Shadik"\nrole = "Forward Deployed Engineer"\nprint(f"{name} is training as a {role}.")' },
          { id: 'py-l2', title: '1.2 Lists, Dictionaries & JSON Parsing', duration: '8 min', xp: 25, takeaway: 'Dictionaries store key-value pairs matching JSON API payloads.', codeSnippet: 'data = {"student": "Shadik", "skills": ["Python", "FastAPI"]}\ndata["skills"].append("React")\nprint(data["skills"])' },
          { id: 'py-l3', title: '1.3 List Comprehensions & Data Filtering', duration: '7 min', xp: 25, takeaway: 'List comprehensions build filtered lists in a single clean line.', codeSnippet: 'scores = [85, 42, 90, 68, 95]\nhigh_scores = [s for s in scores if s >= 80]\nprint(high_scores)  # [85, 90, 95]' }
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
        title: 'Module 2 (Intermediate): Functions, Decorators & OOP',
        description: 'Functions with type hints, custom decorators, and Object-Oriented classes.',
        lessons: [
          { id: 'py-l4', title: '2.1 Functions, Default Args & Type Hints', duration: '6 min', xp: 25, takeaway: 'Type hints improve IDE autocompletion and prevent runtime bugs.', codeSnippet: 'from typing import List\ndef calculate_gpa(grades: List[float]) -> float:\n    return sum(grades) / len(grades)' },
          { id: 'py-l5', title: '2.2 OOP Classes, Inheritance & Dunder Methods', duration: '9 min', xp: 30, takeaway: 'Classes encapsulate state and behavior into reusable objects.', codeSnippet: 'class Student:\n    def __init__(self, name: str):\n        self.name = name\n    def greet(self):\n        return f"Hi, I am {self.name}"' }
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
      },
      {
        id: 'py-mod-3',
        title: 'Module 3 (Advanced): Async Concurrency & FastAPI',
        description: 'async/await, asyncio event loops, Pydantic validation, and REST API deployment.',
        lessons: [
          { id: 'py-l6', title: '3.1 Asynchronous Python with async/await', duration: '10 min', xp: 35, takeaway: 'async def enables non-blocking asynchronous concurrency for high-throughput APIs.', codeSnippet: 'import asyncio\nasync def fetch_ai_reply(prompt: str):\n    await asyncio.sleep(0.1)\n    return f"AI Answer: {prompt}"' },
          { id: 'py-l7', title: '3.2 Pydantic Data Validation & FastAPI Routes', duration: '10 min', xp: 40, takeaway: 'FastAPI combines Pydantic models with async handlers for type-safe JSON APIs.', codeSnippet: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\napp = FastAPI()\nclass Msg(BaseModel):\n    text: str\n@app.post("/chat")\ndef chat(msg: Msg):\n    return {"reply": msg.text}' }
        ],
        challenge: {
          id: 'py-ch-3',
          title: 'Mini-Challenge: Production FastAPI Health Endpoint',
          prompt: 'Write a FastAPI app instance with a GET route `@app.get("/health")` returning `{"status": "ok", "uptime": 100}`.',
          starterCode: 'from fastapi import FastAPI\napp = FastAPI()\n\n# Define endpoint below:\n',
          expectedKeywords: ['@app.get', 'def', 'return', 'status'],
          xpReward: 120,
          hint: '@app.get("/health") def health(): return {"status": "ok", "uptime": 100}'
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
        title: 'Module 1 (Basics): Variables, Data Types & Control Flow',
        description: 'Compiling C code, printf, scanf, loops, and array manipulation.',
        lessons: [
          { id: 'c-l1', title: '1.1 Compiling C Code & Printf Formatting', duration: '5 min', xp: 20, takeaway: 'C code compiles to machine bytecode via GCC. Use %d for integers, %f for floats.', codeSnippet: '#include <stdio.h>\nint main() {\n    printf("B.Tech CSE Student\\n");\n    return 0;\n}' },
          { id: 'c-l2', title: '1.2 Arrays & Memory Offsets', duration: '7 min', xp: 25, takeaway: 'C arrays occupy contiguous memory blocks accessed via index arithmetic.', codeSnippet: 'int arr[3] = {10, 20, 30};\nprintf("First item: %d\\n", arr[0]);' }
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
      },
      {
        id: 'c-mod-2',
        title: 'Module 2 (Advanced): Pointers, Structs & Malloc',
        description: 'Pointer arithmetic, dereferencing, custom structs, and Heap memory management.',
        lessons: [
          { id: 'c-l3', title: '2.1 Pointer Basics & Dereferencing', duration: '8 min', xp: 30, takeaway: '& retrieves address, * dereferences pointer to access stored value.', codeSnippet: 'int x = 42;\nint *ptr = &x;\nprintf("Value: %d\\n", *ptr);' },
          { id: 'c-l4', title: '2.2 Dynamic Memory Allocation (malloc & free)', duration: '10 min', xp: 35, takeaway: 'malloc allocates bytes on the Heap; free releases memory to prevent memory leaks.', codeSnippet: 'int *arr = (int*) malloc(5 * sizeof(int));\narr[0] = 100;\nfree(arr);' }
        ],
        challenge: {
          id: 'c-ch-2',
          title: 'Mini-Challenge: Swap Variables with Pointers',
          prompt: 'Write a C function `void swap(int *a, int *b)` that swaps the values stored at pointers `a` and `b`.',
          starterCode: 'void swap(int *a, int *b) {\n    // Swap logic:\n}',
          expectedKeywords: ['int', 'temp', '*a', '*b'],
          xpReward: 100,
          hint: 'int temp = *a; *a = *b; *b = temp;'
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
        title: 'Module 1 (Basics): Arrays, Two Pointers & Sliding Window',
        description: 'Linear time O(N) array techniques to eliminate O(N^2) brute force loops.',
        lessons: [
          { id: 'dsa-l1', title: '1.1 Two Pointers Technique', duration: '8 min', xp: 25, takeaway: 'Two pointers move inward from opposite ends of a sorted array to find pairs in O(N).', codeSnippet: 'def two_sum_sorted(nums, target):\n    left, right = 0, len(nums)-1\n    while left < right:\n        curr = nums[left] + nums[right]\n        if curr == target: return [left, right]\n        elif curr < target: left += 1\n        else: right -= 1' },
          { id: 'dsa-l2', title: '1.2 Sliding Window Pattern', duration: '9 min', xp: 30, takeaway: 'Sliding window expands/contracts a range to compute dynamic subarray metrics in O(N).', codeSnippet: 'def max_sub_array_of_k(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(len(arr) - k):\n        window_sum = window_sum - arr[i] + arr[i+k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum' }
        ],
        challenge: {
          id: 'dsa-ch-1',
          title: 'Mini-Challenge: Implement Binary Search in O(log N)',
          prompt: 'Write a Python function `binary_search(nums, target)` that returns the index of target in sorted list `nums`, or -1 if missing.',
          starterCode: 'def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    # Write loop here:\n',
          expectedKeywords: ['while', 'mid', 'left', 'right'],
          xpReward: 100,
          hint: 'while left <= right: mid = (left + right) // 2 ...'
        }
      },
      {
        id: 'dsa-mod-2',
        title: 'Module 2 (Advanced): Dynamic Programming & Trees',
        description: 'Recursion, memoization, tabulation, and binary search trees.',
        lessons: [
          { id: 'dsa-l3', title: '2.1 Dynamic Programming: Memoization vs Tabulation', duration: '12 min', xp: 40, takeaway: 'DP stores intermediate subproblem solutions to prevent duplicate exponential work.', codeSnippet: 'def fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]' }
        ],
        challenge: {
          id: 'dsa-ch-2',
          title: 'Mini-Challenge: Memoized Fibonacci',
          prompt: 'Complete the memoized `fib(n)` function using a dictionary `memo`.',
          starterCode: 'def fib(n, memo={}):\n    if n <= 1: return n\n    # Implement memoization check & storage:\n',
          expectedKeywords: ['if', 'memo', 'return'],
          xpReward: 120,
          hint: 'if n in memo: return memo[n]; memo[n] = fib(n-1, memo) + fib(n-2, memo)'
        }
      }
    ]
  },

  // ── 2. CORE CS SUBJECTS ──
  {
    id: 'dbms-sql',
    name: 'DBMS & Relational SQL Architecture',
    domain: 'Core CS',
    icon: '🗄️',
    tier: 'Gold',
    totalXp: 650,
    description: 'Relational database schema design, SELECT/JOIN queries, indexing, and ACID transactions.',
    modules: [
      {
        id: 'db-mod-1',
        title: 'Module 1 (Basics): Queries, Filtering & Aggregations',
        description: 'SELECT, WHERE, GROUP BY, HAVING, and ORDER BY.',
        lessons: [
          { id: 'db-l1', title: '1.1 SQL SELECT & Filtering Essentials', duration: '6 min', xp: 20, takeaway: 'WHERE filters individual rows; ORDER BY sorts result sets.', codeSnippet: 'SELECT name, branch, gpa\nFROM students\nWHERE branch = \'CSE\' AND gpa >= 8.0\nORDER BY gpa DESC;' }
        ],
        challenge: {
          id: 'db-ch-1',
          title: 'Mini-Challenge: Write a High-GPA Query',
          prompt: 'Write a SQL query selecting `name` and `gpa` from `students` where `gpa >= 8.5` ordered by `gpa DESC`.',
          starterCode: '-- Write your SQL query below:\n',
          expectedKeywords: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
          xpReward: 75,
          hint: 'SELECT name, gpa FROM students WHERE gpa >= 8.5 ORDER BY gpa DESC;'
        }
      },
      {
        id: 'db-mod-2',
        title: 'Module 2 (Advanced): JOINs, Indexing & ACID Transactions',
        description: 'INNER/LEFT JOIN, B-Tree indexes, and ACID transaction safety.',
        lessons: [
          { id: 'db-l2', title: '2.1 SQL JOINs Masterclass', duration: '8 min', xp: 30, takeaway: 'INNER JOIN combines matching rows across 2 tables via foreign keys.', codeSnippet: 'SELECT u.name, p.title\nFROM users u\nJOIN projects p ON u.id = p.user_id;' }
        ],
        challenge: {
          id: 'db-ch-2',
          title: 'Mini-Challenge: INNER JOIN Query',
          prompt: 'Write a SQL query joining `users` and `tasks` on `users.id = tasks.user_id` selecting `users.name` and `tasks.title`.',
          starterCode: '-- Write your JOIN query:\n',
          expectedKeywords: ['SELECT', 'FROM', 'JOIN', 'ON'],
          xpReward: 100,
          hint: 'SELECT users.name, tasks.title FROM users JOIN tasks ON users.id = tasks.user_id;'
        }
      }
    ]
  },

  // ── 3. DEV TOOLS ──
  {
    id: 'git-github',
    name: 'Git & GitHub Version Control',
    domain: 'Dev Tools',
    icon: '🐙',
    tier: 'Silver',
    totalXp: 500,
    description: 'Git init, commits, branching, pull requests, resolving merge conflicts, and interactive rebase.',
    modules: [
      {
        id: 'git-mod-1',
        title: 'Module 1 (Basics): Commits, Branches & Remote Push',
        description: 'git init, add, commit, branch creation, and origin push.',
        lessons: [
          { id: 'git-l1', title: '1.1 Git Branching Workflow', duration: '5 min', xp: 20, takeaway: 'Always isolate new feature code on a dedicated git branch before merging.', codeSnippet: 'git checkout -b feat/skills-tree\ngit add .\ngit commit -m "feat: add gamified skill tree"\ngit push origin feat/skills-tree' }
        ],
        challenge: {
          id: 'git-ch-1',
          title: 'Mini-Challenge: Branch Creation Command',
          prompt: 'Write the 2 git terminal commands to create a branch named `feat/skills` and push it to remote `origin`.',
          starterCode: '# Terminal Commands:\n',
          expectedKeywords: ['git', 'checkout', 'push'],
          xpReward: 50,
          hint: 'git checkout -b feat/skills then git push origin feat/skills'
        }
      }
    ]
  },

  // ── 4. WEB DEV ──
  {
    id: 'react-nextjs',
    name: 'React 18 & Next.js App Router',
    domain: 'Web Dev',
    icon: '⚛️',
    tier: 'Diamond',
    totalXp: 800,
    description: 'Component architecture, useState/useEffect, server components, API routes, and glassmorphic UI design.',
    modules: [
      {
        id: 'react-mod-1',
        title: 'Module 1 (Basics): JSX, Components & useState',
        description: 'Building reactive user interfaces using declarative component state.',
        lessons: [
          { id: 'react-l1', title: '1.1 React Hooks & State Reactivity', duration: '7 min', xp: 25, takeaway: 'useState triggers component re-renders whenever state values change.', codeSnippet: 'const [xp, setXp] = useState(100)\n<button onClick={() => setXp(prev => prev + 50)}>+50 XP</button>' }
        ],
        challenge: {
          id: 'react-ch-1',
          title: 'Mini-Challenge: XP Counter Component',
          prompt: 'Write a React component snippet with state `xp` initialized to 0 and a button that adds 50 XP when clicked.',
          starterCode: 'function XpCounter() {\n  // State and button click handler:\n}',
          expectedKeywords: ['useState', 'setXp', 'button', 'onClick'],
          xpReward: 75,
          hint: 'const [xp, setXp] = useState(0); return <button onClick={() => setXp(xp + 50)}>Add XP</button>'
        }
      }
    ]
  },

  // ── 5. COMMUNICATION & SOFT SKILLS (SPECIFICALLY REQUESTED BY USER!) ──
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
        title: 'Module 1 (Basics): The 3-Step Technical Explanation Framework',
        description: 'Goal -> High-Level Data Flow -> Technical Trade-offs.',
        lessons: [
          { id: 'comm-l1', title: '1.1 The 3-Step Code Explanation Framework', duration: '6 min', xp: 25, takeaway: 'Step 1: Goal/Problem -> Step 2: Data Flow -> Step 3: Specific Trade-offs.', codeSnippet: 'Example:\n"This API route takes a student resume PDF, parses text via PyPDF, passes it to Gemini 1.5 for keyword extraction, and returns an ATS score matrix in under 800ms."' },
          { id: 'comm-l2', title: '1.2 Thinking Out Loud in Technical Interviews', duration: '8 min', xp: 30, takeaway: 'Never stay silent! Verbalize your brute-force idea first, then optimize out loud.', codeSnippet: 'Pattern:\n"First, I see a brute force O(N^2) solution using nested loops. However, we can optimize this to O(N) using a Hash Map by storing target complements."' }
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
  },
  {
    id: 'resume-branding',
    name: 'Resume, LinkedIn & Tech Branding',
    domain: 'Communication',
    icon: '📜',
    tier: 'Gold',
    totalXp: 550,
    description: 'Google XYZ resume formula, recruiter magnet LinkedIn profiles, and GitHub portfolio presentation.',
    modules: [
      {
        id: 'brand-mod-1',
        title: 'Module 1: High-Impact Resume Bullet Points',
        description: 'Action Verb + Technical Tool + Quantified Result Formula.',
        lessons: [
          { id: 'brand-l1', title: '1.1 The Google XYZ Resume Formula', duration: '6 min', xp: 25, takeaway: 'Formula: "Accomplished [X], as measured by [Y], by doing [Z]".', codeSnippet: 'Bad: "Built an AI chatbot project."\nGood: "Architected a real-time Gemini AI assistant using Next.js & Supabase, reducing response latency by 45% for 200+ active students."' }
        ],
        challenge: {
          id: 'brand-ch-1',
          title: 'Mini-Challenge: Rewrite a Weak Resume Bullet',
          prompt: 'Rewrite the weak bullet "Made a Python website for students" into a high-impact bullet using action verb, tech stack, and percentage metric.',
          starterCode: '// Bullet Point:\n',
          expectedKeywords: ['Built', 'using', '%'],
          xpReward: 75,
          hint: 'e.g. "Developed a B.Tech learning portal using Python & FastAPI, increasing student study efficiency by 35%."'
        }
      }
    ]
  },
  {
    id: 'public-speaking',
    name: 'Public Speaking & Hackathon Pitching',
    domain: 'Communication',
    icon: '🎤',
    tier: 'Silver',
    totalXp: 450,
    description: '15-second opening hooks, live demo flow, and answering tough judge Q&A.',
    modules: [
      {
        id: 'pitch-mod-1',
        title: 'Module 1: The 3-Minute Winning Hackathon Pitch',
        description: 'Hook -> Problem -> Live Demo -> Tech Architecture -> Impact.',
        lessons: [
          { id: 'pitch-l1', title: '1.1 The 15-Second Judge Hook', duration: '5 min', xp: 20, takeaway: 'Start with a relatable pain point or surprising metric before showing your slides.', codeSnippet: 'Hook Example:\n"90% of B.Tech students study blindly without knowing what skills top companies test. Today, we built Engineer-OS to solve that."' }
        ],
        challenge: {
          id: 'pitch-ch-1',
          title: 'Mini-Challenge: Write a 15-Second Hook',
          prompt: 'Write a 15-second opening hook for your Voice Agent or AIRA-OS project presentation.',
          starterCode: '// Opening Hook:\n',
          expectedKeywords: ['Imagine', 'built'],
          xpReward: 75,
          hint: 'Start with: "Imagine if..." or "Every day millions of users struggle with..."'
        }
      }
    ]
  },

  // ── 7. CAREER PREP ──
  {
    id: 'placement-interview-prep',
    name: 'Placement & Mock Technical Interview Mastery',
    domain: 'Career Prep',
    icon: '🎯',
    tier: 'Gold',
    totalXp: 600,
    description: 'STAR behavioral response framework, technical round strategy, and quantitative aptitude hacks.',
    modules: [
      {
        id: 'career-mod-1',
        title: 'Module 1: Behavioral & Technical Interview Rounds',
        description: 'STAR Method for behavioral questions and technical confidence.',
        lessons: [
          { id: 'career-l1', title: '1.1 STAR Behavioral Method', duration: '7 min', xp: 25, takeaway: 'Situation -> Task -> Action -> Result.', codeSnippet: 'Question: "Tell me about a time you faced a difficult bug."\nAnswer: Use STAR to explain how you isolated the issue and fixed it.' }
        ],
        challenge: {
          id: 'career-ch-1',
          title: 'Mini-Challenge: STAR Response Structure',
          prompt: 'List the 4 components of the STAR behavioral interview framework.',
          starterCode: '// STAR components:\n',
          expectedKeywords: ['Situation', 'Task', 'Action', 'Result'],
          xpReward: 50,
          hint: 'Situation, Task, Action, Result'
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
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [activeChallenge, setActiveChallenge] = useState<{ challenge: MiniChallenge; skillId: string } | null>(null)
  const [challengeCode, setChallengeCode] = useState('')
  const [challengeFeedback, setChallengeFeedback] = useState<{ success: boolean; msg: string } | null>(null)
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set(['py-ch-1']))
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set(['py-l1']))

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

  // Toggle Lesson Completion
  const toggleLessonCompletion = async (lessonId: string, xpAmount: number) => {
    const nextCompleted = new Set(completedLessonIds)
    let addedXp = 0

    if (nextCompleted.has(lessonId)) {
      nextCompleted.delete(lessonId)
      addedXp = -xpAmount
    } else {
      nextCompleted.add(lessonId)
      addedXp = xpAmount
    }

    setCompletedLessonIds(nextCompleted)
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
              <Sparkles size={12} /> Basics to Advanced Deep Learning
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <MessageSquare size={12} /> Soft Skills Included
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Full-Stack & Communication Gamified Skill Tree</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click any skill node to open its full Basics → Advanced lesson curriculum, real-world code matches, and interactive end-of-module challenges!
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

      {/* ── SKILL NODES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => {
          const isSelected = selectedSkill?.id === skill.id

          return (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className={`bg-[#111118] border rounded-2xl p-5 cursor-pointer transition-all group flex flex-col justify-between hover:border-indigo-500/50 ${
                isSelected ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30' : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-white/5 rounded-xl border border-white/8">{skill.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                        {skill.domain}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                    skill.tier === 'Diamond' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                    skill.tier === 'Gold' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                    skill.tier === 'Silver' ? 'bg-slate-300/10 text-slate-200 border-slate-300/30' :
                    'bg-amber-700/10 text-amber-500 border-amber-700/30'
                  }`}>
                    {skill.tier} Tier
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {skill.description}
                </p>

                {/* Modules & Lessons Count */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Skill Modules & Curriculum:</span>
                  {skill.modules.map(mod => {
                    const isChallengeDone = completedChallengeIds.has(mod.challenge.id)

                    return (
                      <div
                        key={mod.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isChallengeDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                            : 'bg-white/3 border-white/5 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isChallengeDone ? (
                            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                          ) : (
                            <BookMarked size={15} className="text-indigo-400 shrink-0" />
                          )}
                          <span className="truncate">{mod.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 shrink-0">{mod.lessons.length} Lessons</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Open Basics → Advanced Lessons</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── EXPANDED BASICS TO ADVANCED LESSONS PANEL ── */}
      {selectedSkill && (
        <div className="bg-[#111118] border border-indigo-500/40 rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedSkill.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedSkill.name} Full Curriculum</h2>
                <p className="text-xs text-indigo-400 font-semibold">{selectedSkill.domain} • {selectedSkill.tier} Tier • {selectedSkill.modules.length} Detailed Modules</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10"
            >
              Close Panel ✕
            </button>
          </div>

          {/* Detailed Modules Grid */}
          <div className="space-y-6">
            {selectedSkill.modules.map(mod => (
              <div key={mod.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <Layers3 size={18} className="text-indigo-400" /> {mod.title}
                  </h3>
                  <p className="text-xs text-gray-400">{mod.description}</p>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.lessons.map(les => {
                    const isDone = completedLessonIds.has(les.id)

                    return (
                      <div
                        key={les.id}
                        className={`bg-black/40 border rounded-xl p-4 space-y-3 flex flex-col justify-between transition-all ${
                          isDone ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/8'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                              {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> : <BookOpen size={14} className="text-indigo-400" />}
                              {les.title}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                              +{les.xp} XP
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-300 leading-relaxed font-mono">
                            💡 {les.takeaway}
                          </p>

                          {les.codeSnippet && (
                            <div className="bg-[#0a0a0f] p-3 rounded-xl border border-white/5 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                              <pre>{les.codeSnippet}</pre>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleLessonCompletion(les.id, les.xp)}
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {isDone ? <><Check size={14} /> Lesson Completed</> : <><Plus size={14} /> Mark Lesson Complete (+{les.xp} XP)</>}
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Real Mini-Challenge Launcher */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">END-OF-MODULE MINI-CHALLENGE</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{mod.challenge.title}</h4>
                  </div>

                  <button
                    onClick={() => {
                      setActiveChallenge({ challenge: mod.challenge, skillId: selectedSkill.id })
                      setChallengeCode(mod.challenge.starterCode)
                      setChallengeFeedback(null)
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 shrink-0"
                  >
                    <Terminal size={14} /> Start Challenge (+{mod.challenge.xpReward} XP)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INTERACTIVE 10-LINE MINI-CHALLENGE MODAL ── */}
      {activeChallenge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
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
