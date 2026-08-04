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
    <div className="max-w-4xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Newspaper className="text-sky-600" size={28} /> Tech News & Hiring Trends
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">
            Real-time news from {source === 'hackernews' ? 'Hacker News' : 'GNews API'} — refreshed every hour.
          </p>
        </div>
        <button
          onClick={() => fetchNews(category)}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                category === cat.id
                  ? 'bg-sky-600 border-sky-500 text-white shadow-sm font-extrabold'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
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
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded-lg w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-slate-400 font-bold py-16">
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
              className="block bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md transition-all group shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold text-sky-800 bg-sky-100 border border-sky-200 px-2.5 py-0.5 rounded-lg">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{timeAgo(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{article.description}</p>
                  )}
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-sky-600 transition-colors shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
