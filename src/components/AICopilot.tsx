'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, X, Send, Bot, User, Minimize2, Loader2, Code2, BookOpen, Briefcase, Map } from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
}

function renderMarkdown(text: string) {
  return text
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="bg-black/40 border border-white/10 rounded-lg p-3 my-2 text-xs overflow-x-auto font-mono text-emerald-300 whitespace-pre-wrap">$2</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/^## (.+)$/gm, '<h3 class="text-indigo-400 font-bold text-sm mt-3 mb-1">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="text-gray-300 font-bold text-xs mt-2 mb-1">$1</h4>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-indigo-500 pl-3 text-gray-400 italic my-2 text-xs">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-1.5 items-start text-xs"><span class="text-indigo-400 mt-0.5">•</span><span>$1</span></li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-400 underline hover:text-indigo-300" target="_blank">$1</a>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, ' ')
}

const QUICK_PROMPTS = [
  { icon: Code2, text: 'Help me with DSA' },
  { icon: BookOpen, text: 'What should I study today?' },
  { icon: Briefcase, text: 'Internship tips' },
  { icon: Map, text: 'Career roadmap for me' },
]

export default function AICopilot() {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: '👋 Hey! I\'m your **Engineer OS Copilot** — your personal AI study buddy.\n\nI can help with:\n- 📖 **Academics** — DSA, OS, DBMS, Networks\n- 💻 **Code** — write, debug, explain\n- 🎯 **Career** — resume, internships, placements\n- 🗺️ **Roadmaps** — what to learn next\n\nWhat do you need today?' }
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
    if (isOpen && !isMinimized) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, userProfile: profile }),
      })
      const data = await res.json()
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || data.error || 'Sorry, I ran into an error. Please try again.'
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: 'Network error. Please check your connection.' }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false) }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          title="Open AI Copilot"
        >
          <Sparkles size={22} className="text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0c0c14] animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[360px] bg-[#111118] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[520px]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/10 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#111118]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Engineer OS Copilot</p>
                <p className="text-[10px] text-emerald-400">● Online · AI-powered</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${msg.sender === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-white/10'}`}>
                      {msg.sender === 'ai' ? <Sparkles size={12} className="text-white" /> : <User size={12} className="text-gray-300" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/8 text-gray-300 rounded-tl-sm'}`}>
                      {msg.sender === 'ai'
                        ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                        : <p>{msg.text}</p>}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-indigo-400" />
                      <span className="text-xs text-gray-400">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map(qp => {
                    const Icon = qp.icon
                    return (
                      <button
                        key={qp.text}
                        onClick={() => sendMessage(qp.text)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-white transition-all"
                      >
                        <Icon size={11} className="text-indigo-400" />
                        {qp.text}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Input */}
              <div className="px-3 pb-3 shrink-0">
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 px-2 focus:outline-none"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2 rounded-lg transition-all"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
