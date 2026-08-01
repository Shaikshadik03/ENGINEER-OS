'use client'

import { useState } from 'react'
import {
  Newspaper, ExternalLink, Search, Filter,
  Clock, TrendingUp, Sparkles, Globe
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  source: string
  category: 'ai' | 'web' | 'career' | 'industry'
  snippet: string
  timeAgo: string
  url: string
}

const ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Google Announces Gemini 1.5 Flash updates & Developer API Pricing Drop',
    source: 'Google AI Blog',
    category: 'ai',
    snippet: 'Google has lowered API prices and expanded context windows for developers building AI-powered web applications and agentic coding workflows.',
    timeAgo: '2 hours ago',
    url: 'https://blog.google/technology/ai'
  },
  {
    id: '2',
    title: 'Next.js 16 Released: Turbopack by Default & Server Action Enhancements',
    source: 'Vercel Engineering',
    category: 'web',
    snippet: 'Next.js 16 brings lightning fast Turbopack compilation as default, refined proxy route handlers, and reduced memory overhead for SSR apps.',
    timeAgo: '5 hours ago',
    url: 'https://nextjs.org/blog'
  },
  {
    id: '3',
    title: 'Top Indian Product Companies Shift Hiring Focus to Real Projects Over GPA',
    source: 'Tech India Pulse',
    category: 'career',
    snippet: 'Recruiters at leading Indian tech firms report prioritizing live deployed web applications, open-source contributions, and practical DSA skills over college CGPA.',
    timeAgo: '1 day ago',
    url: 'https://news.ycombinator.com'
  },
  {
    id: '4',
    title: 'State of Frontend 2026: React & TypeScript Continue Dominance',
    source: 'Dev.to Insights',
    category: 'web',
    snippet: 'Survey of 20,000+ developers shows React, Next.js, and TypeScript retaining 85%+ market share for modern web engineering.',
    timeAgo: '2 days ago',
    url: 'https://dev.to'
  }
]

export default function NewsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')

  const filtered = ARTICLES.filter(a => {
    if (category !== 'all' && a.category !== category) return false
    if (search && !`${a.title} ${a.snippet} ${a.source}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Newspaper className="text-indigo-400" size={24} /> Tech & Campus Hiring Trends
        </h1>
        <p className="text-gray-500 text-sm">Curated developer news, AI announcements, and engineering hiring insights.</p>
      </div>

      {/* Filter & Search */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search tech news & announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-gray-500" />
          {(['all', 'ai', 'web', 'career', 'industry'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                category === cat ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All News' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-4">
        {filtered.map(article => (
          <div key={article.id} className="bg-[#111118] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 uppercase">
                {article.source}
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Clock size={11} /> {article.timeAgo}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">{article.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{article.snippet}</p>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Read Full Story <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
