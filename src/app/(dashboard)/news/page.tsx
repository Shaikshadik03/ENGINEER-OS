import React from 'react';
import { Newspaper, ChevronRight, Globe, Layers, ArrowUpRight } from 'lucide-react';

export default function NewsPage() {
  const newsItems = [
    {
      category: 'AI / LLMs',
      title: 'OpenAI announces GPT-5 release date and architectural changes',
      summary: 'The new model utilizes a sparse mixture of experts architecture, vastly improving reasoning capabilities while reducing inference costs. For students, this means new APIs and capabilities to build upon.',
      image: 'bg-gradient-to-br from-teal-400 to-blue-600',
      time: '2 hours ago',
      source: 'TechCrunch'
    },
    {
      category: 'Web Frameworks',
      title: 'React 19 officially stable: What you need to know',
      summary: 'React 19 introduces a compiler that automatically memoizes components, removing the need for useMemo and useCallback in most cases. Update your side projects to stay relevant.',
      image: 'bg-gradient-to-br from-blue-400 to-indigo-600',
      time: '5 hours ago',
      source: 'React Blog'
    },
    {
      category: 'Careers',
      title: 'Tech hiring rebounds: Software Engineering roles up 15% in Q3',
      summary: 'Companies are heavily hiring junior developers with strong AI orchestration skills. Knowing how to integrate LLMs into traditional web apps is the most sought-after skill this quarter.',
      image: 'bg-gradient-to-br from-purple-400 to-pink-600',
      time: '12 hours ago',
      source: 'Bloomberg'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2"><Newspaper className="text-blue-500" size={28}/> Daily Tech Feed</h1>
        <p className="text-slate-500 dark:text-slate-400">Curated industry updates to keep your skills sharp and relevant.</p>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {['For You', 'Artificial Intelligence', 'Web Dev', 'Careers & Hiring', 'Startups', 'Cybersecurity'].map((tag, i) => (
          <button key={tag} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
            {tag}
          </button>
        ))}
      </div>

      {/* News Feed (Perplexity Style) */}
      <div className="space-y-6">
        {newsItems.map((item, i) => (
          <div key={i} className="glass rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:shadow-md transition-shadow group">
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              
              {/* Image Placeholder */}
              <div className={`w-full md:w-64 h-48 rounded-2xl shrink-0 ${item.image} shadow-inner flex items-center justify-center relative overflow-hidden`}>
                <Layers className="text-white/30" size={48} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5"><Globe size={14}/> {item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                  <span className="ml-auto bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{item.category}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {item.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {item.summary}
                </p>

                <div className="mt-auto flex items-center gap-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                    Deep Dive <ArrowUpRight size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Save for later
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
