'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Moon, Sun, Menu, User } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-slate-500 hover:text-slate-900">
          <Menu size={20} />
        </button>

        {/* Global Search */}
        <form onSubmit={handleSearch} className="relative hidden md:flex">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs, syllabus, roadmaps..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all w-64 focus:w-80"
          />
        </form>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Inbox Notifications Bell */}
        <Link href="/inbox" className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
        </Link>

        {/* User Profile Avatar Link */}
        <Link href="/profile" className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 border border-slate-200 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-sky-500/20 hover:scale-105 transition-transform">
          <User size={15} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
