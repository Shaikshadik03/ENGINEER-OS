import React from 'react';
import { Plus, MoreHorizontal, Clock, Tag } from 'lucide-react';

export default function TasksPage() {
  const columns = [
    {
      title: 'To Do',
      color: 'bg-slate-200 dark:bg-slate-700',
      textColor: 'text-slate-700 dark:text-slate-200',
      tasks: [
        { title: 'Watch OS Lecture 4', tag: 'University', time: 'Tomorrow' },
        { title: 'Apply to Amazon SDE Intern', tag: 'Career', time: 'In 3 days' },
      ]
    },
    {
      title: 'In Progress',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
      tasks: [
        { title: 'Solve 2 LeetCode Mediums', tag: 'Prep', time: 'Today' },
        { title: 'Build React Portfolio', tag: 'Project', time: 'This week' },
      ]
    },
    {
      title: 'Done',
      color: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      tasks: [
        { title: 'Complete Next.js Auth Module', tag: 'Dev', time: 'Done' },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Task Board</h1>
          <p className="text-slate-500 dark:text-slate-400">Organize your engineering journey.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          
          {columns.map((column, i) => (
            <div key={i} className="w-80 flex flex-col h-full bg-slate-50/50 dark:bg-[#1e293b]/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              
              <div className="flex justify-between items-center mb-4 px-1">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${column.color} ${column.textColor}`}>
                  {column.title} <span className="ml-1 opacity-70">({column.tasks.length})</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {column.tasks.map((task, j) => (
                  <div key={j} className="glass p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-grab active:cursor-grabbing transition-colors group bg-white dark:bg-slate-800">
                    <h4 className="font-semibold text-sm mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{task.title}</h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                        <Tag size={12} /> {task.tag}
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${task.time === 'Done' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        <Clock size={12} /> {task.time}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Task Quick Button */}
                <button className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500/50">
                  <Plus size={16} /> Add Task
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
      
    </div>
  );
}
