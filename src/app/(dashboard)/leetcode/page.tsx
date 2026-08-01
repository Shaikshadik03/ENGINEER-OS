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
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Code className="text-emerald-400" size={24}/> DSA & LeetCode Campus Sync
          </h1>
          <p className="text-gray-500 text-sm">Sync your live LeetCode stats and compete on the campus leaderboard.</p>
        </div>

        {/* Sync Input Form */}
        <form onSubmit={handleSync} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter LeetCode username..."
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className="bg-[#111118] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={syncing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Handle'}
          </button>
        </form>
      </div>

      {/* User Stats Overview */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md mb-2 inline-block">
              @{stats.username}
            </span>
            <h2 className="text-xl font-bold text-white">Your Live Problem Solving Stats</h2>
          </div>
          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-2 rounded-xl"
          >
            View LeetCode Profile <ExternalLink size={13} />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Total */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Solved</h3>
            <p className="text-3xl font-bold text-white">{stats.totalSolved}</p>
            <p className="text-[10px] text-gray-500 mt-1">Global Rank: #{stats.ranking}</p>
          </div>

          {/* Easy */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Easy
            </h3>
            <p className="text-2xl font-bold text-white">{stats.easySolved}</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (stats.easySolved / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Medium */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Medium
            </h3>
            <p className="text-2xl font-bold text-white">{stats.mediumSolved}</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (stats.mediumSolved / 200) * 100)}%` }} />
            </div>
          </div>

          {/* Hard */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
            <h3 className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle size={13} /> Hard
            </h3>
            <p className="text-2xl font-bold text-white">{stats.hardSolved}</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (stats.hardSolved / 50) * 100)}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Consistency Heatmap */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 overflow-x-auto space-y-4">
        <div className="flex items-center justify-between min-w-[600px]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-indigo-400" size={18} /> Annual Coding Consistency
          </h2>
          <span className="text-xs font-semibold text-gray-500">365 Days Submission Grid</span>
        </div>

        <div className="flex flex-col gap-1 min-w-[700px]">
          <div className="flex gap-1">
            {Array.from({ length: 52 }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, rowIndex) => {
                  const dataIndex = colIndex * 7 + rowIndex
                  const val = heatmapData[dataIndex] || 0
                  let colorClass = 'bg-white/5'
                  if (val === 1) colorClass = 'bg-emerald-900/40 border border-emerald-500/30'
                  if (val === 2) colorClass = 'bg-emerald-600'
                  if (val === 3) colorClass = 'bg-emerald-400'

                  return (
                    <div
                      key={rowIndex}
                      className={`w-[12px] h-[12px] rounded-sm ${colorClass} transition-colors`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      {/* CAMPUS LEADERBOARD */}
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="text-amber-400" size={20} /> Campus Coding Leaderboard
            </h2>
            <p className="text-xs text-gray-500 mt-1">Ranks top B.Tech coders across college branches by LeetCode solved count.</p>
          </div>
        </div>

        <div className="space-y-2">
          {LEADERBOARD.map(user => (
            <div
              key={user.rank}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                user.rank === 1
                  ? 'bg-amber-500/10 border-amber-500/30 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  user.rank === 1 ? 'bg-amber-500 text-black' : user.rank === 2 ? 'bg-gray-300 text-black' : 'bg-amber-700 text-white'
                }`}>
                  #{user.rank}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{user.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-amber-400">
                      {user.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{user.branch} • @{user.leetcodeUser}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-lg font-bold text-white">{user.totalSolved}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Solved</p>
                </div>
                <div className="hidden sm:block text-xs text-gray-400 space-x-2">
                  <span className="text-emerald-400 font-bold">{user.easy}E</span>
                  <span className="text-amber-400 font-bold">{user.medium}M</span>
                  <span className="text-rose-400 font-bold">{user.hard}H</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
