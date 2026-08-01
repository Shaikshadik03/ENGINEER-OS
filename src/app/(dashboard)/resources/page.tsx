'use client'

import { useState } from 'react'
import {
  Folder, BookOpen, Download, ExternalLink, Search,
  Filter, Sparkles, Code2, Shield, Cpu, Terminal
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  category: 'books' | 'dsa' | 'system_design' | 'interview' | 'perks'
  description: string
  format: string
  link: string
  tags: string[]
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'NeetCode 150 DSA Pattern Guide',
    category: 'dsa',
    description: 'Comprehensive 150 curated LeetCode questions covering all major patterns: Sliding Window, Two Pointers, Graphs, and DP.',
    format: 'PDF / Interactive',
    link: 'https://neetcode.io/practice',
    tags: ['DSA', 'LeetCode', 'Interview']
  },
  {
    id: '2',
    title: 'System Design Primer',
    category: 'system_design',
    description: 'Open-source guide to designing large-scale systems. Covers load balancing, caching, databases, CDN, and microservices.',
    format: 'GitHub Repo',
    link: 'https://github.com/donnemartin/system-design-primer',
    tags: ['System Design', 'Backend', 'Architecture']
  },
  {
    id: '3',
    title: 'GitHub Student Developer Pack',
    category: 'perks',
    description: 'Free access to GitHub Copilot, Namecheap domain, DigitalOcean cloud credits, JetBrains IDEs, and Canva Pro for students.',
    format: 'Student Perk',
    link: 'https://education.github.com/pack',
    tags: ['Free Credits', 'IDEs', 'GitHub']
  },
  {
    id: '4',
    title: 'Designing Data-Intensive Applications Summary',
    category: 'books',
    description: "Cheatsheet and summary notes for Martin Kleppmann's classic book on reliable, scalable, and maintainable systems.",
    format: 'Markdown Notes',
    link: 'https://github.com/ept/ddia-references',
    tags: ['Databases', 'Distributed Systems']
  },
  {
    id: '5',
    title: 'Tech Interview Handbook',
    category: 'interview',
    description: 'Complete guide for technical interviews including behavioral answers, resume writing, algorithm cheat sheets, and negotiation tips.',
    format: 'Guide',
    link: 'https://www.techinterviewhandbook.org',
    tags: ['Interview Prep', 'Resume', 'Behavioral']
  },
  {
    id: '6',
    title: 'AWS Free Tier Student Credits',
    category: 'perks',
    description: 'Get free AWS cloud credits for deployment, S3 storage, Lambda serverless functions, and EC2 instances.',
    format: 'Cloud Credits',
    link: 'https://aws.amazon.com/free',
    tags: ['AWS', 'Cloud', 'Hosting']
  }
]

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filtered = RESOURCES.filter(r => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false
    if (search && !`${r.title} ${r.description} ${r.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Folder className="text-indigo-400" size={24} /> B.Tech Resources & Free Perks Hub
        </h1>
        <p className="text-gray-500 text-sm">Curated engineering books, DSA cheat sheets, system design primers & student developer perks.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search books, cheat sheets, perks, or topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-gray-500" />
          {(['all', 'dsa', 'system_design', 'books', 'interview', 'perks'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Resources' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(res => (
          <div key={res.id} className="bg-[#111118] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 uppercase">
                  {res.format}
                </span>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  Access <ExternalLink size={12} />
                </a>
              </div>

              <h3 className="text-base font-bold text-white">{res.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5 mt-4">
              {res.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
