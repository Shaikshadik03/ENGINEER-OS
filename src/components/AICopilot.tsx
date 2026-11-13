'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, X, Send, User, Minimize2, Loader2, Code2, BookOpen, Briefcase, Compass, MessageSquare } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
}

function renderMarkdown(text: string) {
  return text
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="bg-zinc-950 border border-zinc-800 rounded-lg p-3 my-2 text-xs overflow-x-auto font-mono text-zinc-200 whitespace-pre-wrap">$2</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-sm mt-3 mb-1">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-xs mt-2 mb-1">$1</h4>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500 pl-3 text-zinc-500 italic my-2 text-xs">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-1.5 items-start text-xs"><span class="text-blue-500 mt-0.5">•</span><span>$1</span></li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:opacity-80" target="_blank">$1</a>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, ' ')
}

const QUICK_PROMPTS = [
  { icon: Code2, text: 'Data structures review' },
  { icon: BookOpen, text: 'What should I study today?' },
  { icon: Briefcase, text: 'Resume checklist' },
  { icon: Compass, text: 'Career roadmap recommendations' },
]

export default function AICopilot() {
  const supabase = createClient()
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello. I can assist with coursework, programming concepts, resume preparation, and career roadmap guidance. What are you working on today?'
    }
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
        text: data.response || data.error || 'The service is currently unavailable. Please try again later.'
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: 'Network connection error. Please verify your connection.' }])
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
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-150"
          title="Open Assistant"
        >
          <MessageSquare size={20} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[380px] rounded-xl shadow-xl flex flex-col transition-all duration-150 border ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
            : 'bg-white border-zinc-200 text-zinc-900'
        } ${isMinimized ? 'h-13' : 'h-[500px]'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center">
                <Sparkles size={13} />
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight">Copilot Assistant</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Academic & Career Helper</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 size={14} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs ${
                      msg.sender === 'ai' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                    }`}>
                      {msg.sender === 'ai' ? <Sparkles size={12} /> : <User size={12} />}
                    </div>
                    <div className={`max-w-[82%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60'
                    }`}>
                      {msg.sender === 'ai'
                        ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                        : <p>{msg.text}</p>}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles size={12} />
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 border border-zinc-200/60 dark:border-zinc-700/60">
                      <Loader2 size={12} className="animate-spin text-blue-600" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map(qp => {
                    const Icon = qp.icon
                    return (
                      <button
                        key={qp.text}
                        onClick={() => sendMessage(qp.text)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Icon size={11} className="text-blue-500" />
                        {qp.text}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="flex gap-1.5">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about a concept or career path..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
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
