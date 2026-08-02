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
  Award
} from 'lucide-react';


const Sidebar = () => {
  const pathname = usePathname()
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { name: 'Learning Engine', icon: <BookOpen size={18} />, path: '/learning' },
    { name: 'Skills Hub', icon: <Award size={18} />, path: '/skills' },
    { name: 'Career Roadmaps', icon: <Map size={18} />, path: '/roadmaps' },
    { name: 'Opportunities', icon: <Briefcase size={18} />, path: '/opportunities' },
    { name: 'Startup Scout', icon: <Rocket size={18} />, path: '/projects' },
    { name: 'LeetCode Sync', icon: <Code size={18} />, path: '/leetcode' },
    { name: 'Resources', icon: <Folder size={18} />, path: '/resources' },
    { name: 'Tech News', icon: <Newspaper size={18} />, path: '/news' },
  ];

  const tools = [
    { name: 'Code Playground', icon: <Terminal size={18} />, path: '/playground' },
    { name: 'AI Resume Coach', icon: <FileText size={18} />, path: '/resume-analyzer' },
    { name: 'Analytics', icon: <BarChart size={18} />, path: '/analytics' },
    { name: 'Calendar', icon: <Calendar size={18} />, path: '/calendar' },
    { name: 'Tasks', icon: <CheckSquare size={18} />, path: '/tasks' },
    { name: 'Inbox', icon: <Inbox size={18} />, path: '/inbox' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={18} />, path: '/profile' },
    { name: 'Settings & Billing', icon: <Settings size={18} />, path: '/settings' },
  ];


  const isActive = (path: string) => pathname === path

  const renderLinks = (items: {name: string, icon: React.ReactNode, path: string}[]) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          <Link href={item.path} className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors font-medium text-xs ${
            isActive(item.path)
              ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}>
            <span className={isActive(item.path) ? 'text-indigo-400' : 'text-indigo-400/60'}>{item.icon}</span>
            <span>{item.name}</span>
            {isActive(item.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </Link>
        </li>
      ))}
    </ul>
  );


  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#0d0d12] overflow-y-auto hidden md:flex flex-col">
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-indigo-500/30">
            EOS
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">Engineer OS</h1>
            <p className="text-[10px] font-semibold text-indigo-400">The B.Tech Operating System</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 pb-8">
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main System</p>
          {renderLinks(menuItems)}
        </div>
        
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Productivity & AI Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Account</p>
          {renderLinks(account)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
