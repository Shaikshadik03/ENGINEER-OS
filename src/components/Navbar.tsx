'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-slate-500 hover:text-slate-900">
          <Menu size={20} />
        </button>

        {/* Global Search Glass Input */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs, syllabus, roadmaps..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all w-72 focus:w-96 shadow-sm"
          />
          <span className="absolute right-3 text-[10px] font-black text-slate-400 bg-white/80 border border-slate-200 px-1.5 py-0.5 rounded-md uppercase backdrop-blur-sm">
            Ctrl+K
          </span>
        </form>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Inbox Notifications Bell Glass */}
        <Link href="/inbox" className="p-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white transition-all relative shadow-sm">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse border-2 border-white"></span>
        </Link>

        {/* User Profile Avatar Glass Pill */}
        <Link href="/profile" className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm hover:bg-white hover:border-sky-300 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-slate-900 leading-tight">SHADIK</p>
            <p className="text-[9px] font-black text-sky-600 uppercase tracking-wider leading-tight">CSE Sem 1</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
