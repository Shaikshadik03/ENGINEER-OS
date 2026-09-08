'use client'

import { useState } from 'react'
import {
  Code, Flame, CheckCircle, BarChart2, RefreshCw,
  Trophy, Search, ExternalLink, Award, User, Sparkles
} from 'lucide-react'

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

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in duration-500 text-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-2 tracking-tight">
            <Code className="text-emerald-400" size={28}/> DSA & LeetCode Campus Sync
          </h1>
          <p className="text-slate-400 font-medium text-sm">Sync your live LeetCode stats and compete on the campus leaderboard.</p>
        </div>

        {/* Sync Input Form */}
        <form onSubmit={handleSync} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter LeetCode username..."
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className="bg-[#181824]/90 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-sm font-semibold"
          />
          <button
            type="submit"
            disabled={syncing}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs px-6 py-2.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Handle'}
          </button>
        </form>
      </div>

      {/* User Stats Overview */}
      <div className="bg-[#111118]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl mb-2 inline-block shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              @{stats.username}
            </span>
            <h2 className="text-xl font-black text-white">Your Live Problem Solving Stats</h2>
          </div>
          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-extrabold flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl transition-colors"
          >
            View LeetCode Profile <ExternalLink size={13} />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Total */}
          <div className="bg-[#181824]/90 border border-white/10 rounded-2xl p-5">
            <h3 className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-2">Total Solved</h3>
            <p className="text-3xl font-black text-white">{stats.totalSolved}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Global Rank: #{stats.ranking}</p>
          </div>

          {/* Easy */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
            <h3 className="text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Easy
            </h3>
            <p className="text-2xl font-black text-emerald-300">{stats.easySolved}</p>
            <div className="h-2 w-full bg-white/5 border border-emerald-500/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" style={{ width: `${Math.min(100, (stats.easySolved / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Medium */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
            <h3 className="text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Medium
            </h3>
            <p className="text-2xl font-black text-amber-300">{stats.mediumSolved}</p>
            <div className="h-2 w-full bg-white/5 border border-amber-500/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" style={{ width: `${Math.min(100, (stats.mediumSolved / 200) * 100)}%` }} />
            </div>
          </div>

          {/* Hard */}
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5">
            <h3 className="text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Hard
            </h3>
            <p className="text-2xl font-black text-rose-300">{stats.hardSolved}</p>
            <div className="h-2 w-full bg-white/5 border border-rose-500/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" style={{ width: `${Math.min(100, (stats.hardSolved / 50) * 100)}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 365-Day Submission Grid Heatmap */}
      <div className="bg-[#111118]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-400" /> Annual Coding Consistency
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">365 Days Submission Grid</span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-between pt-2">
          {heatmapData.map((val, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${val} submissions`}
              className={`w-[12px] h-[12px] rounded-sm transition-all ${
                val === 0 ? 'bg-white/5 border border-white/5' : val === 1 ? 'bg-emerald-900/60 border border-emerald-700/50' : val === 2 ? 'bg-emerald-600/80' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#111118]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" /> Campus Leaderboard (Top Coders)
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Coder</th>
                <th className="pb-3">Branch</th>
                <th className="pb-3 text-center">Total Solved</th>
                <th className="pb-3 text-center">E / M / H</th>
                <th className="pb-3 pr-2 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold">
              {LEADERBOARD.map((user) => (
                <tr key={user.rank} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pl-2 font-mono font-black text-slate-300">#{user.rank}</td>
                  <td className="py-3.5 font-bold text-white">
                    {user.name} <span className="text-[10px] text-emerald-400 font-mono block">@{user.leetcodeUser}</span>
                  </td>
                  <td className="py-3.5 text-slate-400">{user.branch}</td>
                  <td className="py-3.5 text-center font-black text-white">{user.totalSolved}</td>
                  <td className="py-3.5 text-center font-mono text-[11px] text-slate-400">
                    <span className="text-emerald-400">{user.easy}</span> / <span className="text-amber-400">{user.medium}</span> / <span className="text-rose-400">{user.hard}</span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-black">
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
