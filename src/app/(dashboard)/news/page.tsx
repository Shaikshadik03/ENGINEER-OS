'use client'

import { useState, useEffect } from 'react'
import { Newspaper, ExternalLink, RefreshCw, Flame, Code2, Cpu, Briefcase } from 'lucide-react'

interface Article {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
  image: string | null
}

const CATEGORIES = [
  { id: 'technology', label: 'Tech News', icon: Code2 },
  { id: 'hiring', label: 'Hiring Trends', icon: Briefcase },
  { id: 'ai', label: 'AI & ML', icon: Cpu },
  { id: 'opensource', label: 'Open Source', icon: Flame },
]

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('technology')
  const [source, setSource] = useState('')

  async function fetchNews(cat: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/news/fetch?category=${cat}`)
      const data = await res.json()
      if (data.success) {
        setArticles(data.articles)
        setSource(data.source)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchNews(category) }, [category])

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-indigo-400" size={24} /> Tech News & Hiring Trends
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time news from {source === 'hackernews' ? 'Hacker News' : 'GNews API'} — refreshed every hour.
          </p>
        </div>
        <button
          onClick={() => fetchNews(category)}
          disabled={loading}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/40 text-gray-400 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                category === cat.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon size={14} /> {cat.label}
            </button>
          )
        })}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#111118] border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-white/5 rounded-lg w-3/4 mb-3" />
              <div className="h-3 bg-white/5 rounded-lg w-full mb-2" />
              <div className="h-3 bg-white/5 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <Newspaper size={40} className="mx-auto mb-4 opacity-30" />
          <p>No articles found. Try refreshing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, idx) => (
            <a
              key={article.id || idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#111118] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-gray-500">{timeAgo(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{article.description}</p>
                  )}
                </div>
                <ExternalLink size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
