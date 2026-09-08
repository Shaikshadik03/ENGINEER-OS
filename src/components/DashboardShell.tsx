'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import AICopilot from '@/components/AICopilot'
import { useTheme } from '@/components/ThemeProvider'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()

  return (
    <div className={`flex h-screen overflow-hidden font-sans relative selection:bg-emerald-500 selection:text-black transition-colors duration-300 ${
      isDark ? 'bg-[#07070a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Dynamic Cosmic Ambient Glow Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-500 opacity-80"
        style={{
          backgroundImage: isDark
            ? `
                radial-gradient(circle at 85% 15%, rgba(147, 51, 234, 0.22), transparent 50%),
                radial-gradient(circle at 45% 10%, rgba(16, 185, 129, 0.18), transparent 45%),
                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15), transparent 50%)
              `
            : `
                radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.15), transparent 50%),
                radial-gradient(circle at 45% 10%, rgba(99, 102, 241, 0.12), transparent 45%),
                radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.10), transparent 50%)
              `
        }}
      />

      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
        <AICopilot />
      </div>
    </div>
  )
}
