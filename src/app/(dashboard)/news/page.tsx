'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'
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
  const { isDark } = useTheme()
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

  const cardStyle = isDark
    ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
    : 'bg-white border-zinc-200 text-zinc-900'

  return (
    <div className={`max-w-4xl mx-auto pb-16 space-y-6 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <Newspaper className="text-blue-600 dark:text-blue-500" size={22} /> Tech News & Hiring Trends
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Live tech and career signals from {source === 'hackernews' ? 'Hacker News' : 'industry sources'}.
          </p>
        </div>
        <button
          onClick={() => fetchNews(category)}
          disabled={loading}
          className={`flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          const active = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                active
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon size={13} /> {cat.label}
            </button>
          )
        })}
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${cardStyle} rounded-xl p-4 border animate-pulse`}>
              <div className={`h-4 rounded w-3/4 mb-2.5 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
              <div className={`h-3 rounded w-full mb-2 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
              <div className={`h-3 rounded w-1/3 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No articles found right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article, idx) => (
            <a
              key={article.id || idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block ${cardStyle} rounded-xl p-4 hover:border-blue-500/50 transition-colors group border`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {article.source}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{timeAgo(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </div>
                <ExternalLink size={14} className="text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
