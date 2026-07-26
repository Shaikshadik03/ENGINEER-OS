import React from 'react';
import { Folder, Zap, ExternalLink, Link, Code2, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    { title: 'Personal Finance Dashboard', description: 'A full-stack React app for tracking expenses with Chart.js visualizations.', tech: ['React', 'Node.js', 'PostgreSQL'], github: true, live: true },
    { title: 'AI Study Assistant', description: 'Discord bot that quizzes you on computer science topics using the OpenAI API.', tech: ['Python', 'Discord.py', 'OpenAI'], github: true, live: false },
  ];

  const aiSuggestions = [
    { title: 'B.Tech OS (AgentGrow)', description: 'Build an AI-powered student dashboard using Next.js and Tailwind CSS.', tech: ['Next.js', 'Tailwind', 'AI Agents'], difficulty: 'Hard', match: 98 },
    { title: 'Real-time Chat App', description: 'Learn WebSockets by building a clone of WhatsApp Web.', tech: ['React', 'Socket.io', 'Express'], difficulty: 'Medium', match: 85 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Projects Portfolio</h1>
          <p className="text-slate-500 dark:text-slate-400">Showcase your work and get AI-curated ideas for your next build.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Projects */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Folder className="text-blue-500" size={20} /> My Portfolio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <div key={i} className="glass rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-blue-500/50 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Code2 size={20} />
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    {project.github && <button className="hover:text-slate-900 dark:hover:text-white transition-colors"><Link size={18} /></button>}
                    {project.live && <button className="hover:text-emerald-500 transition-colors"><ExternalLink size={18} /></button>}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map(t => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Suggestions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-amber-500" size={20} fill="currentColor" /> AI Suggestions</h2>
          
          <div className="space-y-4">
            {aiSuggestions.map((idea, i) => (
              <div key={i} className="glass rounded-2xl p-5 shadow-sm border border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/5 hover:border-amber-500/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{idea.match}% Match</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${idea.difficulty === 'Hard' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>{idea.difficulty}</span>
                </div>
                
                <h3 className="font-bold mb-1">{idea.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{idea.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {idea.tech.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">{t}</span>
                  ))}
                </div>
                
                <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-transform hover:scale-105">
                  Generate Roadmap
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
