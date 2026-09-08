'use client'

import { useState } from 'react'
import {
  Code, Flame, CheckCircle, BarChart2, RefreshCw,
  Trophy, Search, ExternalLink, Award, User, Sparkles
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface LeaderboardUser {
  rank: number
  name: string
  branch: string
  leetcodeUser: string
  totalSolved: number
  easy: number
  medium: number
  hard: number
  badge: string
}

const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Siddharth Verma', branch: 'CSE Sem 6', leetcodeUser: 'sid_verma_dsa', totalSolved: 642, easy: 210, medium: 340, hard: 92, badge: '👑 Campus #1' },
  { rank: 2, name: 'Priya Nambiar', branch: 'IT Sem 4', leetcodeUser: 'priya_codes', totalSolved: 480, easy: 180, medium: 240, hard: 60, badge: '🥈 Master' },
  { rank: 3, name: 'Rahul Reddy', branch: 'CSE Sem 4', leetcodeUser: 'rahul_r', totalSolved: 395, easy: 150, medium: 215, hard: 30, badge: '🥉 Candidate' },
  { rank: 4, name: 'Ananya Roy', branch: 'AIML Sem 2', leetcodeUser: 'ananya_ai', totalSolved: 290, easy: 120, medium: 150, hard: 20, badge: '⭐ Specialist' },
  { rank: 5, name: 'Karthik S', branch: 'ECE Sem 6', leetcodeUser: 'karthik_ee', totalSolved: 210, easy: 110, medium: 90, hard: 10, badge: '⭐ Specialist' },
]

export default function LeetCodePage() {
  const { isDark } = useTheme()
  const [usernameInput, setUsernameInput] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [stats, setStats] = useState({
    username: 'shadik_code',
    ranking: 52100,
    totalSolved: 245,
    easySolved: 120,
    mediumSolved: 105,
    hardSolved: 20,
  })

  const [heatmapData] = useState(() => Array.from({ length: 364 }, () => Math.floor(Math.random() * 4)))

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameInput.trim()) return
    setSyncing(true)
    try {
      const res = await fetch('/api/leetcode/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setStats({
          username: data.username,
          ranking: data.ranking,
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSyncing(false)
    }
  }

  const cardStyle = isDark 
    ? 'bg-[#111118]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white' 
    : 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm text-slate-900'

  return (
    <div className={`max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>

      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b ${
        isDark ? 'border-white/10' : 'border-slate-200/80'
      }`}>
        <div>
          <h1 className={`text-3xl font-black mb-1 flex items-center gap-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Code className={isDark ? 'text-emerald-400' : 'text-sky-600'} size={28}/> DSA & LeetCode Campus Sync
          </h1>
          <p className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sync your live LeetCode stats and compete on the campus leaderboard.</p>
        </div>

        {/* Sync Input Form */}
        <form onSubmit={handleSync} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter LeetCode username..."
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className={`rounded-2xl px-4 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all shadow-sm ${
              isDark 
                ? 'bg-[#181824]/90 border border-white/10 text-white focus:border-emerald-500' 
                : 'bg-white border border-slate-200 text-slate-900 focus:border-sky-500'
            }`}
          />
          <button
            type="submit"
            disabled={syncing}
            className={`font-black text-xs px-6 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]' 
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
            }`}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Handle'}
          </button>
        </form>
      </div>

      {/* User Stats Overview */}
      <div className={`${cardStyle} rounded-3xl p-6 sm:p-8 space-y-6`}>
        <div className="flex justify-between items-center">
          <div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl mb-2 inline-block border ${
              isDark 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'text-sky-700 bg-sky-100 border-sky-200'
            }`}>
              @{stats.username}
            </span>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Live Problem Solving Stats</h2>
          </div>
          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-extrabold flex items-center gap-1 border px-4 py-2.5 rounded-2xl transition-colors ${
              isDark 
                ? 'text-emerald-400 hover:text-emerald-300 bg-white/5 border-white/10' 
                : 'text-sky-600 hover:text-sky-800 bg-slate-50 border-slate-200'
            }`}
          >
            View LeetCode Profile <ExternalLink size={13} />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Total */}
          <div className={`border rounded-2xl p-5 ${
            isDark ? 'bg-[#181824]/90 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">Total Solved</h3>
            <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalSolved}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Global Rank: #{stats.ranking}</p>
          </div>

          {/* Easy */}
          <div className={`border rounded-2xl p-5 ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <h3 className="text-emerald-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Easy
            </h3>
            <p className={`text-2xl font-black ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{stats.easySolved}</p>
            <div className={`h-2 w-full rounded-full mt-3 overflow-hidden border ${
              isDark ? 'bg-white/5 border-emerald-500/20' : 'bg-emerald-200/50 border-emerald-300'
            }`}>
              <div className="h-full bg-emerald-500 rounded-full shadow-sm" style={{ width: `${Math.min(100, (stats.easySolved / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Medium */}
          <div className={`border rounded-2xl p-5 ${
            isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
          }`}>
            <h3 className="text-amber-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Medium
            </h3>
            <p className={`text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{stats.mediumSolved}</p>
            <div className={`h-2 w-full rounded-full mt-3 overflow-hidden border ${
              isDark ? 'bg-white/5 border-amber-500/20' : 'bg-amber-200/50 border-amber-300'
            }`}>
              <div className="h-full bg-amber-500 rounded-full shadow-sm" style={{ width: `${Math.min(100, (stats.mediumSolved / 200) * 100)}%` }} />
            </div>
          </div>

          {/* Hard */}
          <div className={`border rounded-2xl p-5 ${
            isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
          }`}>
            <h3 className="text-rose-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Hard
            </h3>
            <p className={`text-2xl font-black ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>{stats.hardSolved}</p>
            <div className={`h-2 w-full rounded-full mt-3 overflow-hidden border ${
              isDark ? 'bg-white/5 border-rose-500/20' : 'bg-rose-200/50 border-rose-300'
            }`}>
              <div className="h-full bg-rose-500 rounded-full shadow-sm" style={{ width: `${Math.min(100, (stats.hardSolved / 50) * 100)}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 365-Day Submission Grid Heatmap */}
      <div className={`${cardStyle} rounded-3xl p-6 sm:p-8 space-y-4`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <BarChart2 size={18} className={isDark ? 'text-emerald-400' : 'text-sky-600'} /> Annual Coding Consistency
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">365 Days Submission Grid</span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-between pt-2">
          {heatmapData.map((val, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${val} submissions`}
              className={`w-[12px] h-[12px] rounded-sm transition-all ${
                val === 0 
                  ? isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-100 border border-slate-200' 
                  : val === 1 
                  ? isDark ? 'bg-emerald-900/60 border border-emerald-700/50' : 'bg-emerald-200 border border-emerald-300' 
                  : val === 2 
                  ? isDark ? 'bg-emerald-600/80' : 'bg-emerald-400'
                  : isDark ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-emerald-600'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className={`${cardStyle} rounded-3xl p-6 sm:p-8 space-y-4`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Trophy size={18} className="text-amber-400" /> Campus Leaderboard (Top Coders)
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Coder</th>
                <th className="pb-3">Branch</th>
                <th className="pb-3 text-center">Total Solved</th>
                <th className="pb-3 text-center">E / M / H</th>
                <th className="pb-3 pr-2 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${
              isDark ? 'divide-white/5' : 'divide-slate-200/80'
            }`}>
              {LEADERBOARD.map((user) => (
                <tr key={user.rank} className={`transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                }`}>
                  <td className={`py-3.5 pl-2 font-mono font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>#{user.rank}</td>
                  <td className={`py-3.5 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user.name} <span className={`text-[10px] font-mono block ${isDark ? 'text-emerald-400' : 'text-sky-600'}`}>@{user.leetcodeUser}</span>
                  </td>
                  <td className={isDark ? 'text-slate-400' : 'text-slate-500'}>{user.branch}</td>
                  <td className={`py-3.5 text-center font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.totalSolved}</td>
                  <td className="py-3.5 text-center font-mono text-[11px] text-slate-400">
                    <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{user.easy}</span> / <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>{user.medium}</span> / <span className={isDark ? 'text-rose-400' : 'text-rose-600'}>{user.hard}</span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className={`border px-2.5 py-1 rounded-full text-[10px] font-black ${
                      isDark 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {user.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

