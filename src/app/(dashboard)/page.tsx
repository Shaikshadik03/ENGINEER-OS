import React from 'react';
import { Target, CheckCircle2, Zap, Trophy, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning, Alex! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your daily OS briefing. You have 3 tasks due today.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-2">
          <Zap size={18} /> Ask AI Agent
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-emerald-500 text-sm font-bold flex items-center"><ArrowRight size={14} className="-rotate-45 mr-1"/> 12%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">8/10</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weekly Goal</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Target size={24} />
            </div>
            <span className="text-emerald-500 text-sm font-bold flex items-center"><ArrowRight size={14} className="-rotate-45 mr-1"/> Top 5%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">94</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Productivity Score</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">12h 30m</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Learning This Week</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <Trophy size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">14</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Day Streak</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Tasks & Calendar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center"><CheckCircle2 className="mr-2 text-emerald-500" size={20}/> Today's Tasks</h2>
            <div className="space-y-3">
              {[
                { title: 'Complete Next.js Auth Module', time: '10:00 AM', tag: 'Dev' },
                { title: 'Apply to Microsoft SWE Intern', time: '2:00 PM', tag: 'Career' },
                { title: 'Solve 2 LeetCode Mediums', time: '8:00 PM', tag: 'Prep' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600"></div>
                    <span className="font-medium text-sm">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">{task.tag}</span>
                    <span className="text-xs text-slate-400">{task.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center"><Target className="mr-2 text-blue-500" size={20}/> Learning Progress</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Full Stack Web Development</span>
                  <span className="text-emerald-500 font-bold">68%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Data Structures & Algorithms</span>
                  <span className="text-blue-500 font-bold">42%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Opportunities & News */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-900/30">
            <h2 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 block">New Internship Match</span>
                <h4 className="font-bold text-sm mb-1">Frontend Engineering Intern</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Vercel • Remote • 98% Match</p>
                <button className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium w-full hover:bg-emerald-600 transition-colors">Review & Apply</button>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1 block">Upcoming Hackathon</span>
                <h4 className="font-bold text-sm mb-1">Global AI Hack 2026</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">San Francisco (Hybrid) • In 3 days</p>
                <button className="text-xs bg-purple-500 text-white px-3 py-1.5 rounded-lg font-medium w-full hover:bg-purple-600 transition-colors">Register Now</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
