'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={`h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b transition-colors ${
      isDark 
        ? 'bg-zinc-950/80 backdrop-blur border-zinc-800 text-zinc-100' 
        : 'bg-white/80 backdrop-blur border-zinc-200 text-zinc-900'
    }`}>
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-zinc-400 hover:text-zinc-100">
          <Menu size={20} />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input 
            type="text" 
            placeholder="Search roadmaps, opportunities, skills..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`pl-10 pr-12 py-2 rounded-lg text-xs placeholder-zinc-400 focus:outline-none transition-all w-72 focus:w-80 font-medium ${
              isDark 
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-blue-600 focus:ring-1 focus:ring-blue-600' 
                : 'bg-zinc-50 border border-zinc-200 text-zinc-900 focus:border-blue-600 focus:bg-white'
            }`}
          />
          <span className="absolute right-3 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">
            Ctrl+K
          </span>
        </form>
      </div>
      
      <div className="flex items-center space-x-2.5">
        {/* Theme Switcher Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-xs font-medium ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          {isDark ? <Sun size={15} className="text-zinc-300" /> : <Moon size={15} className="text-zinc-600" />}
          <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
        </button>

        {/* Inbox Notifications Bell */}
        <Link href="/inbox" className={`p-2 rounded-lg border transition-colors relative ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
        }`}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </Link>

        {/* User Profile Avatar Pill */}
        <Link href="/profile" className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-lg border transition-colors group ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
            : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
        }`}>
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center font-semibold text-white text-xs">
            S
          </div>
          <div className="hidden sm:block text-left">
            <p className={`text-xs font-semibold leading-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>SHADIK</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">CSE · Sem 1</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
