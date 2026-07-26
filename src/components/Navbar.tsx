'use client';
import React, { useEffect, useState } from 'react';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search OS..." 
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-64 group-focus-within:w-80"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0f172a]"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 border-2 border-white dark:border-slate-800 ml-2 shadow-sm cursor-pointer"></div>
      </div>
    </header>
  );
};

export default Navbar;
