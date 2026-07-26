import React from 'react';
import { Code, Flame, CheckCircle, BarChart2 } from 'lucide-react';

export default function LeetCodePage() {
  // Generate random data for heatmap (365 days)
  const heatmapData = Array.from({ length: 364 }, () => Math.floor(Math.random() * 4));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2"><Code className="text-emerald-500" size={28}/> DSA & Prep</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your consistency and crack the coding interviews.</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 border border-orange-500/30 bg-orange-500/5">
          <Flame className="text-orange-500" size={20} fill="currentColor" />
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Daily Streak</p>
            <p className="font-bold text-lg">24 Days</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <h3 className="text-emerald-600 dark:text-emerald-400 font-bold mb-1 flex items-center gap-2"><CheckCircle size={16}/> Easy</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">142</span>
            <span className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70 mb-1">/ 800</span>
          </div>
          <div className="h-1.5 w-full bg-emerald-500/20 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[18%]"></div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
          <h3 className="text-amber-600 dark:text-amber-400 font-bold mb-1 flex items-center gap-2"><CheckCircle size={16}/> Medium</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">85</span>
            <span className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">/ 1600</span>
          </div>
          <div className="h-1.5 w-full bg-amber-500/20 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 w-[5%]"></div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm">
          <h3 className="text-rose-600 dark:text-rose-400 font-bold mb-1 flex items-center gap-2"><CheckCircle size={16}/> Hard</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">12</span>
            <span className="text-sm font-medium text-rose-600/70 dark:text-rose-400/70 mb-1">/ 700</span>
          </div>
          <div className="h-1.5 w-full bg-rose-500/20 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-rose-500 w-[2%]"></div>
          </div>
        </div>
      </div>

      {/* Consistency Heatmap */}
      <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-6 min-w-[600px]">
          <h2 className="text-xl font-bold flex items-center gap-2"><BarChart2 className="text-blue-500" size={20} /> Consistency Graph</h2>
          <span className="text-sm font-medium text-slate-500">239 submissions in the past year</span>
        </div>
        
        {/* Render a grid that looks like GitHub contributions */}
        <div className="flex flex-col gap-1 min-w-[700px]">
          <div className="flex gap-1">
            {/* Split data into 52 columns of 7 days */}
            {Array.from({ length: 52 }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, rowIndex) => {
                  const dataIndex = colIndex * 7 + rowIndex;
                  const val = heatmapData[dataIndex] || 0;
                  
                  // Map values to colors
                  let colorClass = 'bg-slate-100 dark:bg-slate-800';
                  if (val === 1) colorClass = 'bg-emerald-200 dark:bg-emerald-900/40';
                  if (val === 2) colorClass = 'bg-emerald-400 dark:bg-emerald-600';
                  if (val === 3) colorClass = 'bg-emerald-500 dark:bg-emerald-500';
                  
                  return (
                    <div 
                      key={rowIndex} 
                      className={`w-[12px] h-[12px] rounded-sm ${colorClass} transition-colors hover:ring-2 hover:ring-slate-400`}
                      title={`${val} submissions`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

    </div>
  );
}
