'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Code, 
  Map, 
  Folder, 
  Newspaper, 
  Calendar, 
  CheckSquare, 
  Inbox, 
  BarChart, 
  Settings, 
  User,
  Rocket,
  FileText,
  Terminal,
  Award,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname()
  
  const mainSystem = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { name: 'Learning Engine', icon: <BookOpen size={18} />, path: '/learning', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Skills Hub', icon: <Award size={18} />, path: '/skills', badge: 'Solo', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Career Roadmaps', icon: <Map size={18} />, path: '/roadmaps', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { name: 'Opportunities', icon: <Briefcase size={18} />, path: '/opportunities', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { name: 'Startup Scout', icon: <Rocket size={18} />, path: '/projects', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { name: 'LeetCode Sync', icon: <Code size={18} />, path: '/leetcode', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'Resources', icon: <Folder size={18} />, path: '/resources', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { name: 'Tech News', icon: <Newspaper size={18} />, path: '/news', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  ];

  const tools = [
    { name: 'Code Playground', icon: <Terminal size={18} />, path: '/playground', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { name: 'AI Resume Coach', icon: <FileText size={18} />, path: '/resume-analyzer', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'Analytics', icon: <BarChart size={18} />, path: '/analytics', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { name: 'Calendar', icon: <Calendar size={18} />, path: '/calendar', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Inbox', icon: <Inbox size={18} />, path: '/inbox', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={18} />, path: '/profile', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { name: 'Settings & Billing', icon: <Settings size={18} />, path: '/settings', color: 'text-slate-400 bg-white/5 border-white/10' },
  ];

  const isActive = (path: string) => pathname === path

  const renderLinks = (items: {name: string, icon: React.ReactNode, path: string, badge?: string, color: string}[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = isActive(item.path)
        return (
          <li key={item.name}>
            <Link href={item.path} className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all font-bold text-xs relative group ${
              active
                ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent text-emerald-400 border border-emerald-500/40 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-2xl'
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}>
              <span className={`p-1.5 rounded-xl border transition-all ${
                active 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : `${item.color} group-hover:scale-105`
              }`}>
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>

              {item.badge && (
                <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.badge}
                </span>
              )}

              {active && !item.badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  );

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#0a0a0f]/90 backdrop-blur-2xl overflow-y-auto hidden md:flex flex-col z-50 shadow-2xl">
      <div className="p-6 pb-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-black border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center font-black text-emerald-400 text-base group-hover:scale-105 transition-transform">
            EOS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-white tracking-tight leading-tight">Engineer OS</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-emerald-400 tracking-wide uppercase">B.Tech Operating System</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-3.5 pt-4 space-y-6 pb-8">
        <div>
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Main System</p>
          {renderLinks(mainSystem)}
        </div>
        
        <div>
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Productivity & AI Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account</p>
          {renderLinks(account)}
        </div>
      </nav>

      {/* Pro Plan Neon Dark Glass Card */}
      <div className="p-4 m-3 mt-auto rounded-3xl bg-[#111118]/90 border border-emerald-500/40 text-center space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} className="text-emerald-400 fill-emerald-400" /> PRO STUDENT TIER
        </div>
        <p className="text-[11px] text-slate-400 font-medium leading-tight">Unlimited Sololearn modules, AI review & live code execution.</p>
        <div className="pt-1">
          <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 rounded-full uppercase">
            Active Member
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
