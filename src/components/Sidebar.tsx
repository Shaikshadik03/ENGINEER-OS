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
  Sparkles,
  Terminal,
  Award,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname()
  
  const mainSystem = [
    { name: 'Dashboard', icon: <LayoutDashboard size={17} />, path: '/' },
    { name: 'Learning Engine', icon: <BookOpen size={17} />, path: '/learning' },
    { name: 'Skills Hub', icon: <Award size={17} />, path: '/skills', badge: 'Solo' },
    { name: 'Career Roadmaps', icon: <Map size={17} />, path: '/roadmaps' },
    { name: 'Opportunities', icon: <Briefcase size={17} />, path: '/opportunities' },
    { name: 'Startup Scout', icon: <Rocket size={17} />, path: '/projects' },
    { name: 'LeetCode Sync', icon: <Code size={17} />, path: '/leetcode' },
    { name: 'Resources', icon: <Folder size={17} />, path: '/resources' },
    { name: 'Tech News', icon: <Newspaper size={17} />, path: '/news' },
  ];

  const tools = [
    { name: 'Code Playground', icon: <Terminal size={17} />, path: '/playground' },
    { name: 'AI Resume Coach', icon: <FileText size={17} />, path: '/resume-analyzer' },
    { name: 'Analytics', icon: <BarChart size={17} />, path: '/analytics' },
    { name: 'Calendar', icon: <Calendar size={17} />, path: '/calendar' },
    { name: 'Tasks', icon: <CheckSquare size={17} />, path: '/tasks' },
    { name: 'Inbox', icon: <Inbox size={17} />, path: '/inbox' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={17} />, path: '/profile' },
    { name: 'Settings & Billing', icon: <Settings size={17} />, path: '/settings' },
  ];

  const isActive = (path: string) => pathname === path

  const renderLinks = (items: {name: string, icon: React.ReactNode, path: string, badge?: string}[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = isActive(item.path)
        return (
          <li key={item.name}>
            <Link href={item.path} className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-xs relative group ${
              active
                ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}>
              <span className={`transition-colors ${active ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`}>{item.icon}</span>
              <span className="truncate">{item.name}</span>

              {item.badge && (
                <span className="ml-auto text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  {item.badge}
                </span>
              )}

              {active && !item.badge && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  );

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#0b0c10] overflow-y-auto hidden md:flex flex-col z-50">
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            EOS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">Engineer OS</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold text-indigo-400 tracking-wide uppercase">B.Tech Operating System</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 pb-8">
        <div>
          <p className="px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Main System</p>
          {renderLinks(mainSystem)}
        </div>
        
        <div>
          <p className="px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Productivity & AI Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Account</p>
          {renderLinks(account)}
        </div>
      </nav>

      {/* Pro Plan Card */}
      <div className="p-4 m-4 mt-auto rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/30 text-center space-y-2">
        <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={13} /> PRO STUDENT TIER
        </div>
        <p className="text-[11px] text-gray-400 leading-tight">Unlimited Sololearn modules, AI review & live coding execution.</p>
        <div className="pt-1">
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
            Active Member
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
