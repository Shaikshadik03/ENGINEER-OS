import React from 'react';
import Link from 'next/link';
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
  Rocket
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Learning', icon: <BookOpen size={20} />, path: '/learning' },
    { name: 'Roadmaps', icon: <Map size={20} />, path: '/roadmaps' },
    { name: 'Opportunities', icon: <Briefcase size={20} />, path: '/opportunities' },
    { name: 'Projects', icon: <Folder size={20} />, path: '/projects' },
    { name: 'LeetCode', icon: <Code size={20} />, path: '/leetcode' },
    { name: 'Resources', icon: <Folder size={20} />, path: '/resources' },
    { name: 'Startup Scout', icon: <Rocket size={20} />, path: '/startups' },
    { name: 'News', icon: <Newspaper size={20} />, path: '/news' },
  ];

  const tools = [
    { name: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Inbox', icon: <Inbox size={20} />, path: '/inbox' },
    { name: 'Analytics', icon: <BarChart size={20} />, path: '/analytics' },
  ];

  const account = [
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const renderLinks = (items: {name: string, icon: React.ReactNode, path: string}[]) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          <Link href={item.path} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm">
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-y-auto hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400 tracking-tight">AgentGrow.</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 pb-8">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {renderLinks(menuItems)}
        </div>
        
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tools</p>
          {renderLinks(tools)}
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Account</p>
          {renderLinks(account)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
