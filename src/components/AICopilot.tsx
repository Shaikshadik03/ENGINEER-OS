'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, X, Send, Bot, User, Minimize2, MessageSquare, Zap
} from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
}

export default function AICopilot() {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hey! I am your Engineer OS AI Copilot. Ask me anything about your syllabus, DSA prep, resume tips, or campus startups! 🚀'
    }
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) setProfile(p)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: Message = { id: `u_${Date.now()}`, sender: 'user', text: query.trim() }
    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userProfile: profile
        })
      })

      const data = await res.json()
      if (data.success) {
        const aiMsg: Message = { id: `ai_${Date.now()}`, sender: 'ai', text: data.reply }
        setMessages(prev => [...prev, aiMsg])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const SUGGESTIONS = [
    'How do I prepare for SDE-1 interviews?',
    'Explain Linked Lists vs Arrays',
    'Tips to improve my AI Resume Score',
    'How to pitch my startup idea?'
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-[#111118] border border-indigo-500/30 rounded-3xl shadow-2xl w-[360px] sm:w-[400px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900/60 to-[#111118] p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Engineer OS Copilot</h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online AI Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> Copilot is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(sug => (
              <button
                key={sug}
                onClick={() => sendMessage(sug)}
                className="text-[10px] bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-gray-400 hover:text-indigo-300 px-2 py-1 rounded-md transition-all text-left truncate max-w-[180px]"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={e => { e.preventDefault(); sendMessage() }}
            className="p-3 border-t border-white/10 flex gap-2 bg-[#111118]"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:scale-105 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/50 flex items-center gap-2 font-bold text-xs border border-indigo-400/30 transition-all group"
        >
          <Sparkles size={20} className="animate-spin-slow group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">Ask AI Copilot</span>
        </button>
      )}

    </div>
  )
}
