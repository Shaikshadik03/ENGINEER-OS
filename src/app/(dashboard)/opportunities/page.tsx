'use client';
import React, { useState } from 'react';
import { Briefcase, Search, MapPin, Building2, ChevronRight, Zap, Target, Star, Filter } from 'lucide-react';

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState('internships');

  const internships = [
    { role: 'Frontend Engineering Intern', company: 'Vercel', location: 'Remote', salary: '$8k/mo', match: 98, type: 'Summer 2027', logo: 'bg-black text-white' },
    { role: 'Software Engineer Intern', company: 'Stripe', location: 'San Francisco, CA', salary: '$9k/mo', match: 92, type: 'Summer 2027', logo: 'bg-indigo-600 text-white' },
    { role: 'React Developer Intern', company: 'Discord', location: 'Remote', salary: '$7.5k/mo', match: 88, type: 'Fall 2026', logo: 'bg-[#5865F2] text-white' },
  ];

  const hackathons = [
    { title: 'Global AI Hack 2026', host: 'OpenAI', location: 'Hybrid', prize: '$100k', match: 95, date: 'Oct 12-14, 2026', logo: 'bg-emerald-600 text-white' },
    { title: 'Web3 Builders Jam', host: 'Polygon', location: 'Online', prize: '$50k', match: 82, date: 'Nov 1-5, 2026', logo: 'bg-purple-600 text-white' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400">AI-curated roles and events based on your exact skillset.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit">
        {['jobs', 'internships', 'hackathons'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        
        {activeTab === 'internships' && internships.map((job, i) => (
          <div key={i} className="glass rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner ${job.logo}`}>
                {job.company[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{job.role}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{job.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <div className="flex items-center gap-1.5 justify-start md:justify-end">
                  <Zap size={14} className="text-amber-500" fill="currentColor" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{job.match}% Match</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold mt-0.5">Based on React & Next.js skills</p>
              </div>
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
                Apply <ChevronRight size={16} />
              </button>
            </div>
            
          </div>
        ))}

        {activeTab === 'hackathons' && hackathons.map((hack, i) => (
          <div key={i} className="glass rounded-2xl p-6 shadow-sm border border-purple-200 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-900/5 hover:border-purple-500/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner ${hack.logo}`}>
                {hack.host[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{hack.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {hack.host}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {hack.location}</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-md">{hack.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <div className="flex items-center gap-1.5 justify-start md:justify-end">
                  <Target size={14} className="text-purple-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Prize: {hack.prize}</span>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-2">
                Register <ChevronRight size={16} />
              </button>
            </div>
            
          </div>
        ))}

        {activeTab === 'jobs' && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">No full-time roles yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Update your profile to "Senior Year" or "Graduated" to unlock full-time job matches.</p>
          </div>
        )}

      </div>
    </div>
  );
}
