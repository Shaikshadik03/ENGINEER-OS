'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Moon, Sun, Menu, User } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0d0d12]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>

        {/* Global Search */}
        <form onSubmit={handleSearch} className="relative hidden md:flex">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search jobs, syllabus, roadmaps..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all w-64 focus:w-80"
          />
        </form>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Inbox Notifications Bell */}
        <Link href="/inbox" className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        </Link>

        {/* User Profile Avatar Link */}
        <Link href="/profile" className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 border border-white/20 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
          <User size={15} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
