import React from 'react';
import { Map, Lock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function RoadmapsPage() {
  const roadmapNodes = [
    { id: 1, title: 'Internet Fundamentals', status: 'completed', type: 'core' },
    { id: 2, title: 'HTML5 & Semantic Web', status: 'completed', type: 'core' },
    { id: 3, title: 'CSS3 & Flexbox/Grid', status: 'completed', type: 'core' },
    { id: 4, title: 'Tailwind CSS', status: 'completed', type: 'elective' },
    { id: 5, title: 'JavaScript Basics', status: 'active', type: 'core' },
    { id: 6, title: 'DOM Manipulation', status: 'locked', type: 'core' },
    { id: 7, title: 'React.js Fundamentals', status: 'locked', type: 'core' },
    { id: 8, title: 'Next.js App Router', status: 'locked', type: 'elective' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
          <Map size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Frontend Engineering Path</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Follow this skill tree to master frontend development. Earn XP and unlock new modules as you progress.</p>
      </div>

      {/* The Roadmap Tree */}
      <div className="relative py-10">
        {/* Vertical Line Connector */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 z-0"></div>
        <div className="absolute left-1/2 top-0 h-1/2 w-1 bg-gradient-to-b from-emerald-500 to-emerald-400 -translate-x-1/2 z-0"></div>

        <div className="space-y-12 relative z-10">
          {roadmapNodes.map((node, index) => {
            const isEven = index % 2 === 0;
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLocked = node.status === 'locked';

            return (
              <div key={node.id} className={`flex items-center justify-between w-full group ${isEven ? 'flex-row-reverse' : ''}`}>
                {/* Empty side for layout balancing */}
                <div className="w-[45%] hidden md:block"></div>

                {/* Center Node Icon */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-[#0f172a] shadow-sm z-10 
                  ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                  ${isActive ? 'bg-white dark:bg-slate-800 border-emerald-500 text-emerald-500 animate-pulse' : ''}
                  ${isLocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : ''}
                ">
                  {isCompleted && <CheckCircle2 size={20} />}
                  {isActive && <Circle size={16} fill="currentColor" />}
                  {isLocked && <Lock size={16} />}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ${isEven ? 'text-right' : 'text-left'}`}>
                  <div className={`glass p-5 rounded-2xl border transition-all duration-300
                    ${isActive ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
                    ${isLocked ? 'opacity-60' : ''}
                  `}>
                    <div className={`flex flex-col ${isEven ? 'items-end' : 'items-start'} mb-2`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2
                        ${node.type === 'core' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}
                      `}>
                        {node.type}
                      </span>
                      <h3 className={`font-bold text-lg ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{node.title}</h3>
                    </div>
                    
                    {isActive && (
                      <button className="mt-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                        Start Module <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
