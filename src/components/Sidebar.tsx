'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Code, 
  Compass, 
  Folder, 
  Newspaper, 
  Calendar, 
  CheckSquare, 
  Inbox, 
  BarChart2, 
  Settings, 
  User,
  Rocket,
  FileText,
  Terminal,
  Award
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Sidebar = () => {
  const pathname = usePathname()
  const { isDark } = useTheme()
  
  const mainSystem = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Learning Modules', icon: BookOpen, path: '/learning' },
    { name: 'Skills Calibration', icon: Award, path: '/skills' },
    { name: 'Career Roadmaps', icon: Compass, path: '/roadmaps' },
    { name: 'Opportunities', icon: Briefcase, path: '/opportunities' },
    { name: 'Startup Scout', icon: Rocket, path: '/projects' },
    { name: 'LeetCode Tracker', icon: Code, path: '/leetcode' },
    { name: 'Resources', icon: Folder, path: '/resources' },
    { name: 'Industry News', icon: Newspaper, path: '/news' },
  ];

  const tools = [
    { name: 'Code Playground', icon: Terminal, path: '/playground' },
    { name: 'Resume Builder', icon: FileText, path: '/resume-analyzer' },
    { name: 'Performance Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Schedule Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Task Board', icon: CheckSquare, path: '/tasks' },
    { name: 'Notifications', icon: Inbox, path: '/inbox' },
  ];

  const account = [
    { name: 'Student Profile', icon: User, path: '/profile' },
    { name: 'Settings & Plan', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => pathname === path

  const renderLinks = (items: { name: string, icon: React.ComponentType<{ size?: number; className?: string }>, path: string }[]) => (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.path)
        const Icon = item.icon
        return (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                active
                  ? isDark
                    ? 'bg-zinc-800/80 text-blue-400 font-semibold'
                    : 'bg-zinc-100 text-blue-600 font-semibold'
                  : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Icon size={16} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'} />
              <span className="truncate">{item.name}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  );

  return (
    <aside className={`w-64 h-screen fixed left-0 top-0 border-r overflow-y-auto hidden md:flex flex-col z-50 ${
      isDark 
        ? 'border-zinc-800 bg-zinc-950 text-zinc-200'
        : 'border-zinc-200 bg-white text-zinc-800'
    }`}>
      {/* Brand Header */}
      <div className={`p-5 pb-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            EOS
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-tight">Engineer OS</h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Career & Academic Platform</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        <div>
          <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Academics & Career</p>
          {renderLinks(mainSystem)}
        </div>
        
        <div>
          <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Productivity & Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Account</p>
          {renderLinks(account)}
        </div>
      </nav>

      {/* Footer Status Box */}
      <div className={`p-3.5 m-3 rounded-lg border text-xs space-y-1 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="flex items-center justify-between font-medium">
          <span className="text-zinc-500 dark:text-zinc-400">Status</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Active Student</span>
        </div>
        <p className="text-[11px] text-zinc-400">B.Tech CSE · Semester 1</p>
      </div>
    </aside>
  );
};

export default Sidebar;
