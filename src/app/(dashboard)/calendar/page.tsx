import React from 'react';
import { ChevronLeft, ChevronRight, Video, MapPin } from 'lucide-react';

export default function CalendarPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400">Balance your classes, hackathons, and prep.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"><ChevronLeft size={20} /></button>
          <span className="font-bold w-32 text-center">October 2026</span>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass flex-1 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col bg-white/50 dark:bg-slate-900/50 shadow-sm">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Mock Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {/* We will just render 35 cells for a mock month view */}
          {Array.from({ length: 35 }).map((_, i) => {
            const date = i - 2; // Offset for starting day
            const isToday = date === 14;
            const isCurrentMonth = date > 0 && date <= 31;
            
            return (
              <div key={i} className={`min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'} transition-colors relative group cursor-pointer`}>
                
                {/* Date Number */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold mb-2
                  ${isToday ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}
                `}>
                  {isCurrentMonth ? date : ''}
                </div>

                {/* Example Events */}
                {date === 12 && (
                  <div className="px-2 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-md mb-1 truncate">
                    Hackathon Kickoff
                  </div>
                )}
                {date === 14 && (
                  <div className="px-2 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-md mb-1 truncate flex items-center gap-1">
                    <Video size={10} /> OS Lecture
                  </div>
                )}
                {date === 14 && (
                  <div className="px-2 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-md mb-1 truncate flex items-center gap-1">
                    <MapPin size={10} /> GDSC Meetup
                  </div>
                )}
                {date === 20 && (
                  <div className="px-2 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-md mb-1 truncate">
                    AWS Cert Exam
                  </div>
                )}
                
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
