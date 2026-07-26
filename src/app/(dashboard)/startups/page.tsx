import React from 'react';
import { Rocket, MessageCircle, Heart, Share2, Users, Lightbulb, Code2 } from 'lucide-react';

export default function StartupScoutPage() {
  const startups = [
    {
      name: 'NeuroLink for Education',
      stage: 'Idea Phase',
      founder: 'Sarah Jenkins (CS, Year 3)',
      lookingFor: ['AI/ML Engineer', 'Full Stack Developer'],
      description: 'Building a brain-computer interface application to measure student engagement during remote lectures. Need technical co-founders to help build the ML pipeline and the React frontend.',
      tags: ['AI/ML', 'EdTech', 'Hardware'],
      likes: 124,
      comments: 18,
    },
    {
      name: 'EcoChain',
      stage: 'Building MVP',
      founder: 'Alex Rivera (Business, Year 4)',
      lookingFor: ['Solidity Developer', 'UI/UX Designer'],
      description: 'A transparent supply chain tracker using Ethereum smart contracts to verify the carbon footprint of retail products. The smart contracts are 50% done, looking for someone to help finish them and design the consumer-facing app.',
      tags: ['Web3', 'Sustainability', 'Supply Chain'],
      likes: 89,
      comments: 5,
    },
    {
      name: 'AgentGrow App (Meta-Pitch)',
      stage: 'Seed/Pre-revenue',
      founder: 'AgentGrow Team',
      lookingFor: ['Next.js Expert', 'Growth Hacker'],
      description: 'An AI-powered operating system for B.Tech students to guide them through their 4-year journey. We have a working Next.js MVP and are looking for ambitious students to join the founding team.',
      tags: ['SaaS', 'EdTech', 'AI Agents'],
      likes: 342,
      comments: 45,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">Startup Scout <Rocket className="text-orange-500" size={28} /></h1>
          <p className="text-slate-500 dark:text-slate-400">Find co-founders, join early-stage projects, or pitch your own idea.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
          <Lightbulb size={18} /> Pitch Your Idea
        </button>
      </div>

      {/* Structured List View */}
      <div className="space-y-6">
        {startups.map((startup, i) => (
          <div key={i} className="glass rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-orange-500/30 transition-all">
            
            {/* Top Row: Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{startup.name}</h2>
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                    {startup.stage}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Posted by {startup.founder}</p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"><Share2 size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"><Heart size={18} /></button>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {startup.description}
            </p>

            {/* Tags & Looking For */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800 pt-5">
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Users size={14}/> Looking For:</span>
                  {startup.lookingFor.map(role => (
                    <span key={role} className="text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-md">
                      {role}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Code2 size={14}/> Tags:</span>
                  {startup.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><Heart size={16} className="text-rose-500"/> {startup.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={16}/> {startup.comments}</span>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold shadow-md hover:scale-105 transition-transform">
                  Reach Out
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}
