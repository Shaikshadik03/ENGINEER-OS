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
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/', color: 'text-sky-500 bg-sky-50' },
    { name: 'Learning Engine', icon: <BookOpen size={18} />, path: '/learning', color: 'text-emerald-500 bg-emerald-50' },
    { name: 'Skills Hub', icon: <Award size={18} />, path: '/skills', badge: 'Solo', color: 'text-amber-500 bg-amber-50' },
    { name: 'Career Roadmaps', icon: <Map size={18} />, path: '/roadmaps', color: 'text-indigo-500 bg-indigo-50' },
    { name: 'Opportunities', icon: <Briefcase size={18} />, path: '/opportunities', color: 'text-rose-500 bg-rose-50' },
    { name: 'Startup Scout', icon: <Rocket size={18} />, path: '/projects', color: 'text-orange-500 bg-orange-50' },
    { name: 'LeetCode Sync', icon: <Code size={18} />, path: '/leetcode', color: 'text-amber-600 bg-amber-50' },
    { name: 'Resources', icon: <Folder size={18} />, path: '/resources', color: 'text-cyan-500 bg-cyan-50' },
    { name: 'Tech News', icon: <Newspaper size={18} />, path: '/news', color: 'text-teal-500 bg-teal-50' },
  ];

  const tools = [
    { name: 'Code Playground', icon: <Terminal size={18} />, path: '/playground', color: 'text-purple-500 bg-purple-50' },
    { name: 'AI Resume Coach', icon: <FileText size={18} />, path: '/resume-analyzer', color: 'text-blue-500 bg-blue-50' },
    { name: 'Analytics', icon: <BarChart size={18} />, path: '/analytics', color: 'text-violet-500 bg-violet-50' },
    { name: 'Calendar', icon: <Calendar size={18} />, path: '/calendar', color: 'text-pink-500 bg-pink-50' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Inbox', icon: <Inbox size={18} />, path: '/inbox', color: 'text-indigo-600 bg-indigo-50' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={18} />, path: '/profile', color: 'text-sky-600 bg-sky-50' },
    { name: 'Settings & Billing', icon: <Settings size={18} />, path: '/settings', color: 'text-slate-600 bg-slate-100' },
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
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-extrabold'
                : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 border border-transparent'
            }`}>
              <span className={`p-1.5 rounded-xl transition-all ${
                active 
                  ? 'bg-white/20 text-white' 
                  : `${item.color} group-hover:scale-110`
              }`}>
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>

              {item.badge && (
                <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 border border-amber-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {active && !item.badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  );

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200/80 bg-white overflow-y-auto hidden md:flex flex-col z-50 shadow-sm">
      <div className="p-6 pb-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
            EOS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight">Engineer OS</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-sky-600 tracking-wide uppercase">B.Tech Operating System</p>
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

      {/* Pro Plan Card */}
      <div className="p-4 m-3 mt-auto rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50/50 border border-sky-100 text-center space-y-2 shadow-sm">
        <div className="flex items-center justify-center gap-1 text-sky-700 text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} className="text-amber-500 fill-amber-500" /> PRO STUDENT TIER
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-tight">Unlimited Sololearn modules, AI review & live code execution.</p>
        <div className="pt-1">
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase">
            Active Member
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
