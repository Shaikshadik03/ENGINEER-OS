'use client'

import { useState, useMemo } from 'react'
import {
  Folder, BookOpen, ExternalLink, Search,
  Sparkles, Code2, Terminal, Trophy, Award,
  CheckSquare, ArrowUpRight, Globe
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export interface Resource {
  id: string
  title: string
  category: 'ai' | 'nocode' | 'skills' | 'problemsolving' | 'productivity' | 'opportunities' | 'perks'
  description: string
  format: string
  link: string
  tags: string[]
  badge?: string
}

export const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Folder },
  { id: 'ai', label: 'AI Tools', icon: Sparkles },
  { id: 'nocode', label: 'No-Code & AI Dev', icon: Terminal },
  { id: 'skills', label: 'Learning Platforms', icon: BookOpen },
  { id: 'problemsolving', label: 'DSA & Coding', icon: Code2 },
  { id: 'productivity', label: 'Productivity', icon: CheckSquare },
  { id: 'opportunities', label: 'Hackathons & Jobs', icon: Trophy },
  { id: 'perks', label: 'Student Perks', icon: Award },
] as const

export const RESOURCES: Resource[] = [
  // --- AI TOOLS ---
  {
    id: 'ai-chatgpt',
    title: 'ChatGPT',
    category: 'ai',
    description: "OpenAI's conversational model for complex reasoning, algorithm debugging, and coding help.",
    format: 'Web App / API',
    link: 'https://chatgpt.com',
    tags: ['LLM', 'OpenAI', 'Reasoning'],
    badge: 'Core AI'
  },
  {
    id: 'ai-claude',
    title: 'Claude AI',
    category: 'ai',
    description: "Anthropic's Claude 3.5 Sonnet — industry-leading coding capability, large context window, and artifact visualization.",
    format: 'Web App / API',
    link: 'https://claude.ai',
    tags: ['Coding', 'Anthropic', 'Artifacts'],
    badge: 'Top for Code'
  },
  {
    id: 'ai-perplexity',
    title: 'Perplexity AI',
    category: 'ai',
    description: 'AI conversational search engine that synthesizes live web sources with inline academic citations.',
    format: 'AI Search',
    link: 'https://www.perplexity.ai',
    tags: ['Search', 'Research', 'Citations'],
    badge: 'Research'
  },
  {
    id: 'ai-deepseek',
    title: 'DeepSeek',
    category: 'ai',
    description: 'High-performance open-weight reasoning and code intelligence models with exceptional math benchmarks.',
    format: 'Web / Open Source',
    link: 'https://www.deepseek.com',
    tags: ['Open Weights', 'R1 Reasoning', 'Code'],
    badge: 'Open Weight'
  },
  {
    id: 'ai-grok',
    title: 'Grok',
    category: 'ai',
    description: "xAI's conversational model with real-time knowledge ingestion and deep multimodal understanding.",
    format: 'Web App',
    link: 'https://grok.com',
    tags: ['xAI', 'Real-time', 'Multimodal']
  },
  {
    id: 'ai-huggingchat',
    title: 'HuggingChat',
    category: 'ai',
    description: 'Free open-source chat interface powered by leading community models like Llama 3, Mistral, and Qwen.',
    format: 'Open Source Web',
    link: 'https://huggingface.co/chat',
    tags: ['Open Source', 'Llama 3', 'Free Chat']
  },
  {
    id: 'ai-huggingface',
    title: 'Hugging Face Hub',
    category: 'ai',
    description: 'The global repository for open-source AI models, datasets, benchmarks, and interactive Spaces demos.',
    format: 'Platform / Hub',
    link: 'https://huggingface.co',
    tags: ['Models', 'Datasets', 'ML Deployment'],
    badge: 'Community'
  },
  {
    id: 'ai-fmhy',
    title: 'FMHY (FreeMediaHeckYeah)',
    category: 'ai',
    description: 'The largest community-maintained index of free online tools, developer software, and digital resources.',
    format: 'Wiki Directory',
    link: 'https://fmhy.net',
    tags: ['Directory', 'Free Tools', 'Open Web']
  },

  // --- NO-CODE & AI BUILDERS ---
  {
    id: 'nocode-cursor',
    title: 'Cursor AI Editor',
    category: 'nocode',
    description: 'VS Code fork supercharged with AI code agents, instant codebase indexing, and multi-file edits.',
    format: 'Desktop IDE',
    link: 'https://cursor.com',
    tags: ['AI IDE', 'Codebase Agent', 'Productivity'],
    badge: 'Top Developer Tool'
  },
  {
    id: 'nocode-lovable',
    title: 'Lovable',
    category: 'nocode',
    description: 'Full-stack AI app builder to create responsive React, Next.js, and Supabase web applications from text prompts.',
    format: 'AI Builder',
    link: 'https://lovable.dev',
    tags: ['Full Stack', 'Web Builder', 'Rapid Prototyping']
  },
  {
    id: 'nocode-google-ai-studio',
    title: 'Google AI Studio',
    category: 'nocode',
    description: 'Web IDE for rapid prototyping with Gemini 1.5 Pro and Flash with free developer API keys.',
    format: 'API Console',
    link: 'https://aistudio.google.com',
    tags: ['Gemini', 'API Key', 'Prompt Testing'],
    badge: 'Free Tier'
  },
  {
    id: 'nocode-framer',
    title: 'Framer (Strand)',
    category: 'nocode',
    description: 'Interactive website builder and animation design tool with zero-code visual responsive layout controls.',
    format: 'Design Builder',
    link: 'https://framer.com',
    tags: ['Web Design', 'Landing Pages', 'No Code']
  },

  // --- LEARNING PLATFORMS ---
  {
    id: 'skills-roadmap-sh',
    title: 'roadmap.sh',
    category: 'skills',
    description: 'Community-driven visual developer roadmaps, milestone tracking, and step-by-step career path guides.',
    format: 'Interactive Roadmaps',
    link: 'https://roadmap.sh',
    tags: ['Roadmaps', 'Architecture', 'Syllabus'],
    badge: 'Essential'
  },
  {
    id: 'skills-google',
    title: 'Google Skills',
    category: 'skills',
    description: 'Official Google learning pathways for Cloud, Machine Learning, Android development, and cybersecurity.',
    format: 'Courses & Labs',
    link: 'https://skills.google',
    tags: ['Google Cloud', 'Certifications', 'Hands-on']
  },
  {
    id: 'skills-freecodecamp',
    title: 'freeCodeCamp',
    category: 'skills',
    description: '100% free verified coding curriculum covering Web Dev, Python, DSA, Machine Learning, and APIs.',
    format: 'Interactive Curriculum',
    link: 'https://www.freecodecamp.org',
    tags: ['Free Certificates', 'Web Dev', 'Python'],
    badge: '100% Free'
  },
  {
    id: 'skills-gfg',
    title: 'GeeksforGeeks',
    category: 'skills',
    description: 'Computer science subject notes, semester syllabus explanations, interview archives, and code references.',
    format: 'Articles & Tutorials',
    link: 'https://www.geeksforgeeks.org',
    tags: ['B.Tech Syllabus', 'DSA', 'Core CS']
  },
  {
    id: 'skills-coursera',
    title: 'Coursera',
    category: 'skills',
    description: 'University courses and professional certificates from Stanford, DeepLearning.AI, Google, and IBM.',
    format: 'University Courses',
    link: 'https://www.coursera.org',
    tags: ['Certificates', 'Specializations', 'College']
  },
  {
    id: 'skills-edx',
    title: 'edX',
    category: 'skills',
    description: 'University courseware from MIT, Harvard (CS50), and Oxford with free audit tracks.',
    format: 'MOOC Platform',
    link: 'https://www.edx.org',
    tags: ['CS50', 'MIT', 'Harvard']
  },
  {
    id: 'skills-codedex',
    title: 'Codédex',
    category: 'skills',
    description: 'Gamified 8-bit quest journey for learning Python, HTML/CSS, JavaScript, and Git fundamentals.',
    format: 'Gamified Learning',
    link: 'https://www.codedex.io',
    tags: ['Beginners', 'Python', 'Gamified']
  },
  {
    id: 'skills-sololearn',
    title: 'Sololearn',
    category: 'skills',
    description: 'Bite-sized mobile and desktop interactive programming lessons and daily coding quizzes.',
    format: 'Bite-Sized Practice',
    link: 'https://www.sololearn.com',
    tags: ['Mobile Learning', 'Quizzes', 'Fundamentals']
  },
  {
    id: 'skills-w3schools',
    title: 'W3Schools Pathfinder',
    category: 'skills',
    description: 'Structured developer learning roadmap with live sandbox code runners and skill tracking.',
    format: 'Track & Sandbox',
    link: 'https://pathfinder.w3schools.com',
    tags: ['Web Fundamentals', 'SQL', 'Python']
  },
  {
    id: 'skills-kaggle',
    title: 'Kaggle',
    category: 'skills',
    description: 'World benchmark platform for AI/ML with free Jupyter GPU runtimes, datasets, and competitive hackathons.',
    format: 'Notebooks & Datasets',
    link: 'https://www.kaggle.com',
    tags: ['AI/ML', 'GPU Run', 'Datasets'],
    badge: 'Free GPUs'
  },
  {
    id: 'skills-claude-academy',
    title: 'Claude Academy',
    category: 'skills',
    description: 'Anthropic official courses on prompt engineering, Claude API integration, and tool use design.',
    format: 'Official Course',
    link: 'https://academy.claude.com',
    tags: ['Prompting', 'Anthropic', 'AI Engineering']
  },
  {
    id: 'skills-thingqbator',
    title: 'thingQbator (NASSCOM Foundation)',
    category: 'skills',
    description: 'Cisco and NASSCOM student incubator program fostering IoT, AI, and startup prototypes across Indian universities.',
    format: 'Incubator Program',
    link: 'https://thingqbator.nasscomfoundation.org',
    tags: ['Incubation', 'NASSCOM', 'Startups']
  },
  {
    id: 'skills-cybersecurity',
    title: '100 Web Vulnerabilities & Security Notes',
    category: 'skills',
    description: 'Curated technical reference on OWASP Top 10, penetration testing, Bug Bounty tips, and security posture.',
    format: 'GitHub Repository',
    link: 'https://github.com/penetestersquad/Cybersecurity-Notes',
    tags: ['Security', 'OWASP', 'Ethical Hacking']
  },
  {
    id: 'skills-codechef',
    title: 'CodeChef Python Learning',
    category: 'skills',
    description: 'Structured programming course and automated test problem sets to master Python from scratch.',
    format: 'Hands-on Coding',
    link: 'https://www.codechef.com',
    tags: ['Competitive Programming', 'Python', 'Practice']
  },
  {
    id: 'skills-devdocs',
    title: 'DevDocs API Documentation',
    category: 'skills',
    description: 'Fast, offline-capable documentation browser unifying 100+ language and framework docs in one keyboard-driven UI.',
    format: 'Offline Docs',
    link: 'https://devdocs.io',
    tags: ['Documentation', 'Offline', 'All Languages'],
    badge: 'Speed'
  },
  {
    id: 'skills-greatlearning',
    title: 'Great Learning Academy',
    category: 'skills',
    description: 'Free certificate courses in Data Science, Cloud Computing, Artificial Intelligence, and Software Engineering.',
    format: 'Free Certifications',
    link: 'https://www.mygreatlearning.com/academy',
    tags: ['Free Certificates', 'Cloud', 'Data Science']
  },

  // --- PROBLEM SOLVING & DSA ---
  {
    id: 'dsa-neetcode',
    title: 'NeetCode 150',
    category: 'problemsolving',
    description: 'The premier curated collection of 150 essential LeetCode coding patterns with free video walkthroughs.',
    format: 'Interactive Roadmap',
    link: 'https://neetcode.io/practice',
    tags: ['LeetCode', 'Interview Patterns', 'DSA'],
    badge: 'Gold Standard'
  },
  {
    id: 'dsa-takeuforward',
    title: 'takeUforward (Striver’s SDE Sheet)',
    category: 'problemsolving',
    description: 'Comprehensive A2Z DSA sheet and placement preparation roadmap by Raj Vikramaditya (Striver).',
    format: 'Curated Sheet',
    link: 'https://takeuforward.org',
    tags: ['Striver Sheet', 'SDE Prep', 'Placement'],
    badge: 'Placement Must'
  },
  {
    id: 'dsa-leetcode',
    title: 'LeetCode',
    category: 'problemsolving',
    description: 'The global benchmark coding interview platform with weekly contests, discussion forums, and mock assessments.',
    format: 'Coding Arena',
    link: 'https://leetcode.com',
    tags: ['Contests', 'FAANG Prep', 'DSA']
  },
  {
    id: 'dsa-hackerrank',
    title: 'HackerRank',
    category: 'problemsolving',
    description: 'Problem-solving practice, language skill proficiency badges, and corporate recruitment coding tests.',
    format: 'Coding Assessment',
    link: 'https://www.hackerrank.com',
    tags: ['Skill Badges', 'Assessments', 'Python/C++']
  },
  {
    id: 'dsa-apna-college',
    title: 'Apna College DSA Course',
    category: 'problemsolving',
    description: 'Complete Hindi/English video series on Data Structures and Algorithms in C++ and Java with placement roadmaps.',
    format: 'Video Curriculum',
    link: 'https://www.youtube.com/@ApnaCollegeOfficial',
    tags: ['Placement', 'Java', 'C++', 'YouTube']
  },
  {
    id: 'dsa-system-design',
    title: 'System Design Primer',
    category: 'problemsolving',
    description: 'Open-source engineering guide to designing scalable distributed systems, caching, microservices, and databases.',
    format: 'GitHub Guide',
    link: 'https://github.com/donnemartin/system-design-primer',
    tags: ['System Design', 'Scalability', 'Backend Architecture']
  },

  // --- PRODUCTIVITY & UTILITIES ---
  {
    id: 'prod-notion',
    title: 'Notion',
    category: 'productivity',
    description: 'All-in-one customizable workspace for college notes, project management, study planning, and wikis.',
    format: 'Web / Desktop / Mobile',
    link: 'https://www.notion.so',
    tags: ['Notes', 'Project Management', 'Syllabus Tracker'],
    badge: 'Student Favorite'
  },
  {
    id: 'prod-notebooklm',
    title: 'Google NotebookLM',
    category: 'productivity',
    description: 'AI research notebook that grounds answers strictly in your uploaded college PDFs, textbooks, and notes.',
    format: 'AI Research Tool',
    link: 'https://notebooklm.google.com',
    tags: ['Study Notes', 'PDF Summarizer', 'Google AI'],
    badge: 'Top Study Tool'
  },
  {
    id: 'prod-ticktick',
    title: 'TickTick',
    category: 'productivity',
    description: 'Task management app featuring Pomodoro timer, habit tracker, calendar views, and priority matrix.',
    format: 'Task Planner',
    link: 'https://ticktick.com',
    tags: ['Pomodoro', 'Habits', 'Daily Tasks']
  },
  {
    id: 'prod-napkin',
    title: 'Napkin AI',
    category: 'productivity',
    description: 'Transforms textual project documentation and algorithms into clean visual diagrams and flowcharts.',
    format: 'AI Diagramming',
    link: 'https://app.napkin.ai',
    tags: ['Diagrams', 'Flowcharts', 'Documentation']
  },
  {
    id: 'prod-otter',
    title: 'Otter.ai',
    category: 'productivity',
    description: 'Real-time automated audio transcription, meeting summaries, and slide capture for lectures and team syncs.',
    format: 'Audio Transcriber',
    link: 'https://otter.ai',
    tags: ['Transcription', 'Lecture Notes', 'Summary']
  },
  {
    id: 'prod-ss64',
    title: 'SS64 Command Line Reference',
    category: 'productivity',
    description: 'Comprehensive syntax and command reference guide for Bash, PowerShell, CMD, macOS, and SQL.',
    format: 'Reference Sheet',
    link: 'https://ss64.com',
    tags: ['Bash', 'Linux', 'PowerShell', 'Cheat Sheet']
  },
  {
    id: 'prod-pixocraft',
    title: 'Pixocraft Online Text Utilities',
    category: 'productivity',
    description: 'Free online text scratchpad, file generator, word counter, and formatting tool.',
    format: 'Utility Tool',
    link: 'https://tools.pixocraft.in',
    tags: ['Text Utilities', 'Formatters', 'Online Tool']
  },

  // --- OPPORTUNITIES & HACKATHONS ---
  {
    id: 'opp-gsoc',
    title: 'Google Summer of Code (GSoC)',
    category: 'opportunities',
    description: 'Global stipend fellowship bringing university students into real-world open-source software organizations.',
    format: 'Open Source Fellowship',
    link: 'https://summerofcode.withgoogle.com',
    tags: ['Stipend', 'Open Source', 'Mentorship'],
    badge: 'Top Tier'
  },
  {
    id: 'opp-devpost',
    title: 'Devpost Hackathons',
    category: 'opportunities',
    description: 'The world’s primary hackathon portal. Find global virtual hackathons, team teammates, and prize pools.',
    format: 'Hackathon Directory',
    link: 'https://devpost.com',
    tags: ['Hackathons', 'Prizes', 'Global Projects']
  },
  {
    id: 'opp-lablab',
    title: 'lablab.ai',
    category: 'opportunities',
    description: 'Weekly artificial intelligence hackathons building with state-of-the-art foundation models and agent frameworks.',
    format: 'AI Hackathon Hub',
    link: 'https://lablab.ai',
    tags: ['AI Hackathons', 'LLMs', 'Portfolio Projects']
  },
  {
    id: 'opp-google-careers',
    title: 'Google Careers (Students)',
    category: 'opportunities',
    description: 'Official application portal for Google Software Engineering Internships and STEP Freshman/Sophomore Internships.',
    format: 'Careers Portal',
    link: 'https://www.google.com/about/careers/applications/students/',
    tags: ['Google Internships', 'STEP', 'Software Engineering']
  },
  {
    id: 'opp-aicte-internship',
    title: 'AICTE National Internship Portal',
    category: 'opportunities',
    description: 'Official Government of India portal for verified corporate, PSU, and MSME student engineering internships.',
    format: 'Govt Internship Portal',
    link: 'https://internship.aicte-india.org',
    tags: ['AICTE', 'Govt Verified', 'Indian Freshers']
  },
  {
    id: 'opp-hackerearth',
    title: 'HackerEarth Challenges',
    category: 'opportunities',
    description: 'Corporate hiring hackathons, coding sprints, and campus engineering challenges hosted by top tech firms.',
    format: 'Competition Portal',
    link: 'https://www.hackerearth.com/challenges/',
    tags: ['Hiring Challenges', 'Contests', 'Jobs']
  },
  {
    id: 'opp-myscheme',
    title: 'myScheme Government Scholarships',
    category: 'opportunities',
    description: 'National portal to discover Central and State government engineering scholarships, grants, and student benefits.',
    format: 'Scholarships Portal',
    link: 'https://www.myscheme.gov.in',
    tags: ['Scholarships', 'Govt Schemes', 'Grants']
  },
  {
    id: 'opp-naukri',
    title: 'Naukri.com Campus & Fresher',
    category: 'opportunities',
    description: "India's largest employment marketplace with dedicated filters for IT fresher drives, walk-ins, and graduate trainees.",
    format: 'Job Marketplace',
    link: 'https://www.naukri.com',
    tags: ['Fresher Jobs', 'India', 'MNC Drives']
  },
  {
    id: 'opp-indeed',
    title: 'Indeed India',
    category: 'opportunities',
    description: 'Tech job and internship postings across Bengaluru, Hyderabad, Pune, Gurugram, and remote teams.',
    format: 'Job Search',
    link: 'https://in.indeed.com',
    tags: ['Internships', 'Entry Level', 'Tech Roles']
  },

  // --- STUDENT PERKS ---
  {
    id: 'perk-github-pack',
    title: 'GitHub Student Developer Pack',
    category: 'perks',
    description: 'Over $10,000+ worth of free tools: GitHub Copilot, JetBrains All Products, free Namecheap .me domain, and cloud credits.',
    format: 'Student Pack ($10k+)',
    link: 'https://education.github.com/pack',
    tags: ['Free Copilot', 'JetBrains', 'Free Domain'],
    badge: 'Must Claim'
  },
  {
    id: 'perk-aws-educate',
    title: 'AWS Educate & Free Tier',
    category: 'perks',
    description: 'Free cloud credits and training labs with no credit card required to deploy serverless and container apps.',
    format: 'Cloud Credits',
    link: 'https://aws.amazon.com/education/awseducate/',
    tags: ['AWS', 'Cloud Hosting', 'Credits']
  },
  {
    id: 'perk-azure-student',
    title: 'Microsoft Azure for Students',
    category: 'perks',
    description: '$100 in free Azure cloud credits renewed annually for university students, plus 55+ always-free developer services.',
    format: '$100 Free Credit',
    link: 'https://azure.microsoft.com/en-us/free/students/',
    tags: ['Azure', '$100 Credit', 'No Credit Card']
  }
]

export default function ResourcesPage() {
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: RESOURCES.length }
    RESOURCES.forEach(r => {
      map[r.category] = (map[r.category] || 0) + 1
    })
    return map
  }, [])

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.format.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [categoryFilter, search])

  const cardStyle = isDark
    ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
    : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'

  return (
    <div className={`max-w-6xl mx-auto pb-16 space-y-6 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>

      {/* Header */}
      <div className={`pb-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2.5 tracking-tight">
            <Folder className="text-blue-600 dark:text-blue-500" size={24} /> B.Tech Resources & Tools Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Curated catalog of {RESOURCES.length}+ engineering platforms, AI coding tools, DSA sheets, and verified student perks.
          </p>
        </div>
        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filtered.length}</span> of {RESOURCES.length} items
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`${cardStyle} rounded-xl p-4 space-y-3.5 border`}>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search across 49+ tools, platforms, cheat sheets, or skills (e.g. 'Cursor', 'NeetCode', 'GSoC')..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full rounded-lg pl-10 pr-4 py-2 text-xs font-medium placeholder-zinc-400 focus:outline-none transition-colors border ${
              isDark 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-600' 
                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-600 focus:bg-white'
            }`}
          />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-1.5 items-center pt-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const active = categoryFilter === cat.id
            const count = counts[cat.id] || 0
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  active
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Folder size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No resources found matching your search.</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter('all') }}
            className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(res => (
            <div
              key={res.id}
              className={`${cardStyle} rounded-xl p-4.5 border transition-all duration-150 hover:border-zinc-400 dark:hover:border-zinc-700 flex flex-col justify-between`}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase">
                    {res.format}
                  </span>
                  {res.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {res.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1 line-clamp-3">
                    {res.description}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 min-w-0">
                  {res.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  Visit <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
