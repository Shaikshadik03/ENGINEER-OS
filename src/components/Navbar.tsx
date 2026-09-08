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
    <header className="h-16 border-b border-white/10 bg-[#07070a]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 shadow-2xl">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>

        {/* Global Search Dark Glass Input */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs, syllabus, roadmaps..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-2.5 bg-[#12121a]/90 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-72 focus:w-96 shadow-inner font-medium"
          />
          <span className="absolute right-3 text-[10px] font-black text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md uppercase backdrop-blur-sm">
            Ctrl+K
          </span>
        </form>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Inbox Notifications Bell Glass */}
        <Link href="/inbox" className="p-2.5 rounded-2xl bg-[#12121a]/90 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all relative shadow-sm">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-[#07070a] shadow-[0_0_6px_#10b981]"></span>
        </Link>

        {/* User Profile Avatar Pill */}
        <Link href="/profile" className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-[#12121a]/90 border border-white/10 hover:border-emerald-500/40 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500/60 flex items-center justify-center font-black text-emerald-400 text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-white leading-tight">SHADIK</p>
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider leading-tight">CSE Sem 1</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
