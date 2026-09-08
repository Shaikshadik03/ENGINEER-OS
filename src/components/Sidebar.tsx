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
import { useTheme } from './ThemeProvider';

const Sidebar = () => {
  const pathname = usePathname()
  const { isDark } = useTheme()
  
  const mainSystem = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/', color: isDark ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : 'text-sky-600 bg-sky-100 border-sky-200' },
    { name: 'Learning Engine', icon: <BookOpen size={18} />, path: '/learning', color: isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-100 border-emerald-200' },
    { name: 'Skills Hub', icon: <Award size={18} />, path: '/skills', badge: 'Solo', color: isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-600 bg-amber-100 border-amber-200' },
    { name: 'Career Roadmaps', icon: <Map size={18} />, path: '/roadmaps', color: isDark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-100 border-purple-200' },
    { name: 'Opportunities', icon: <Briefcase size={18} />, path: '/opportunities', color: isDark ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-rose-600 bg-rose-100 border-rose-200' },
    { name: 'Startup Scout', icon: <Rocket size={18} />, path: '/projects', color: isDark ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-orange-600 bg-orange-100 border-orange-200' },
    { name: 'LeetCode Sync', icon: <Code size={18} />, path: '/leetcode', color: isDark ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-amber-600 bg-amber-100 border-amber-200' },
    { name: 'Resources', icon: <Folder size={18} />, path: '/resources', color: isDark ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-cyan-600 bg-cyan-100 border-cyan-200' },
    { name: 'Tech News', icon: <Newspaper size={18} />, path: '/news', color: isDark ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-teal-600 bg-teal-100 border-teal-200' },
  ];

  const tools = [
    { name: 'Code Playground', icon: <Terminal size={18} />, path: '/playground', color: isDark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-100 border-purple-200' },
    { name: 'AI Resume Coach', icon: <FileText size={18} />, path: '/resume-analyzer', color: isDark ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600 bg-blue-100 border-blue-200' },
    { name: 'Analytics', icon: <BarChart size={18} />, path: '/analytics', color: isDark ? 'text-violet-400 bg-violet-500/10 border-violet-500/20' : 'text-violet-600 bg-violet-100 border-violet-200' },
    { name: 'Calendar', icon: <Calendar size={18} />, path: '/calendar', color: isDark ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-pink-600 bg-pink-100 border-pink-200' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks', color: isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-100 border-emerald-200' },
    { name: 'Inbox', icon: <Inbox size={18} />, path: '/inbox', color: isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-indigo-600 bg-indigo-100 border-indigo-200' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={18} />, path: '/profile', color: isDark ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : 'text-sky-600 bg-sky-100 border-sky-200' },
    { name: 'Settings & Billing', icon: <Settings size={18} />, path: '/settings', color: isDark ? 'text-slate-400 bg-white/5 border-white/10' : 'text-slate-600 bg-slate-100 border-slate-200' },
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
                ? isDark
                  ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent text-emerald-400 border border-emerald-500/40 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-2xl'
                  : 'bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent text-sky-600 border border-sky-500/30 font-extrabold shadow-sm rounded-2xl'
                : isDark
                  ? 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}>
              <span className={`p-1.5 rounded-xl border transition-all ${
                active 
                  ? isDark 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-sky-500/20 text-sky-600 border-sky-500/40 shadow-sm'
                  : `${item.color} group-hover:scale-105`
              }`}>
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>

              {item.badge && (
                <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  active 
                    ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-sky-500/20 text-sky-700 border border-sky-500/40'
                    : isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {item.badge}
                </span>
              )}

              {active && !item.badge && (
                <span className={`ml-auto w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-sky-500 shadow-sm'} animate-pulse`} />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  );

  return (
    <aside className={`w-64 h-screen fixed left-0 top-0 border-r overflow-y-auto hidden md:flex flex-col z-50 transition-all duration-300 ${
      isDark 
        ? 'border-white/10 bg-[#0a0a0f]/90 backdrop-blur-2xl text-white shadow-2xl'
        : 'border-slate-200/80 bg-white/90 backdrop-blur-2xl text-slate-800 shadow-sm'
    }`}>
      <div className={`p-6 pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-base group-hover:scale-105 transition-transform ${
            isDark
              ? 'bg-black border-emerald-500/60 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
              : 'bg-sky-600 border-sky-400 text-white shadow-md'
          }`}>
            EOS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`text-base font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Engineer OS</h1>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-sky-500'} animate-pulse`} />
            </div>
            <p className={`text-[10px] font-black tracking-wide uppercase ${isDark ? 'text-emerald-400' : 'text-sky-600'}`}>B.Tech Operating System</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-3.5 pt-4 space-y-6 pb-8">
        <div>
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main System</p>
          {renderLinks(mainSystem)}
        </div>
        
        <div>
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Productivity & AI Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account</p>
          {renderLinks(account)}
        </div>
      </nav>

      {/* Pro Plan Glass Card */}
      <div className={`p-4 m-3 mt-auto rounded-3xl border text-center space-y-2 transition-all ${
        isDark 
          ? 'bg-[#111118]/90 border-emerald-500/40 text-slate-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
          : 'bg-sky-50/90 border-sky-200 text-slate-800 shadow-sm'
      }`}>
        <div className={`flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-sky-700'}`}>
          <Sparkles size={14} className={isDark ? 'text-emerald-400 fill-emerald-400' : 'text-sky-600 fill-sky-600'} /> PRO STUDENT TIER
        </div>
        <p className={`text-[11px] font-medium leading-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Unlimited Sololearn modules, AI review & live code execution.</p>
        <div className="pt-1">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
            isDark 
              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/40' 
              : 'text-sky-700 bg-sky-100 border-sky-300'
          }`}>
            Active Member
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

