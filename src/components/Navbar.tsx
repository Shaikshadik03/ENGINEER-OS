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
    <header className={`h-16 sticky top-0 z-40 flex items-center justify-between px-6 transition-colors ${
      isDark 
        ? 'bg-[#07070a]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl' 
        : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-sm'
    }`}>
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs, syllabus, roadmaps..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`pl-10 pr-12 py-2.5 rounded-2xl text-xs placeholder-slate-400 focus:outline-none transition-all w-72 focus:w-96 font-medium ${
              isDark 
                ? 'bg-[#12121a]/90 border border-white/10 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
                : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500 focus:bg-white'
            }`}
          />
          <span className="absolute right-3 text-[10px] font-black text-slate-400 bg-white/5 border border-slate-200/20 px-1.5 py-0.5 rounded-md uppercase backdrop-blur-sm">
            Ctrl+K
          </span>
        </form>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Theme Switcher Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Sololearn Light Mode" : "Switch to Cyberpunk Dark Mode"}
          className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
            isDark 
              ? 'bg-[#12121a] border-amber-500/40 text-amber-400 hover:bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isDark ? <Sun size={17} className="text-amber-400 fill-amber-400" /> : <Moon size={17} className="text-slate-700 fill-slate-700" />}
          <span className="hidden sm:inline">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Inbox Notifications Bell Glass */}
        <Link href="/inbox" className={`p-2.5 rounded-2xl border transition-all relative ${
          isDark 
            ? 'bg-[#12121a]/90 border-white/10 text-slate-300 hover:text-white' 
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
        }`}>
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-[#07070a]"></span>
        </Link>

        {/* User Profile Avatar Pill */}
        <Link href="/profile" className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl border transition-all group ${
          isDark 
            ? 'bg-[#12121a]/90 border-white/10 hover:border-emerald-500/40' 
            : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'
        }`}>
          <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500/60 flex items-center justify-center font-black text-emerald-400 text-xs shadow-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden sm:block text-left">
            <p className={`text-xs font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SHADIK</p>
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider leading-tight">CSE Sem 1</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
