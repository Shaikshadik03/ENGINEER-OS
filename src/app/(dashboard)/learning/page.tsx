import React from 'react';
import { BookOpen, PlayCircle, Star, Flame, Award, Clock } from 'lucide-react';

export default function LearningDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Gamification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Hub</h1>
          <p className="text-slate-500 dark:text-slate-400">Master new skills and track your growth.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 border border-orange-500/30 bg-orange-500/5">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Streak</p>
              <p className="font-bold">14 Days</p>
            </div>
          </div>
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5">
            <Star className="text-emerald-500" size={20} fill="currentColor" />
            <div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Level 12</p>
              <p className="font-bold">2,450 XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning - Hero Card */}
      <div className="glass rounded-3xl p-1 shadow-lg shadow-emerald-500/10 border border-white/50 dark:border-slate-800 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden group cursor-pointer">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="bg-slate-900/40 backdrop-blur-md m-1 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-white border border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Up Next</span>
              <span className="text-sm text-slate-300 flex items-center gap-1"><Clock size={14} /> 45 mins</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">React Server Components Deep Dive</h2>
            <p className="text-slate-300 max-w-xl">Learn how to fetch data directly on the server to make your Next.js applications lightning fast.</p>
          </div>
          
          <button className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 transition-transform hover:scale-105">
            <PlayCircle size={20} /> Resume Course
          </button>
        </div>
      </div>

      {/* Active Courses Grid */}
      <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2"><BookOpen className="text-emerald-500" size={20} /> Active Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {[
          { title: 'Full Stack Web Development', progress: 68, lessons: '24/35', image: 'bg-blue-500' },
          { title: 'Data Structures & Algorithms', progress: 42, lessons: '45/108', image: 'bg-purple-500' },
          { title: 'System Design Interview Prep', progress: 15, lessons: '3/20', image: 'bg-rose-500' },
        ].map((course, i) => (
          <div key={i} className="glass rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer group">
            <div className={`h-32 rounded-xl ${course.image} mb-4 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">Course</div>
            </div>
            <h3 className="font-bold text-lg mb-1">{course.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{course.lessons} lessons completed</p>
            
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Progress</span>
              <span className="font-bold text-emerald-500">{course.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
