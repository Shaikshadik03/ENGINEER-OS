import React from 'react';
import { User, Mail, Shield, Bell, Lock, Smartphone, Link, Camera, Globe } from 'lucide-react';

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your OS identity and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { name: 'Public Profile', icon: <User size={18} />, active: true },
            { name: 'Account Info', icon: <Mail size={18} />, active: false },
            { name: 'Security', icon: <Lock size={18} />, active: false },
            { name: 'Notifications', icon: <Bell size={18} />, active: false },
            { name: 'Integrations', icon: <Shield size={18} />, active: false },
          ].map((tab, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${tab.active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Form Area */}
        <div className="md:col-span-3 space-y-6">
          
          <div className="glass rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Public Profile</h2>
            
            {/* Avatar Upload */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400">
                  A
                </div>
                <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white dark:border-slate-900">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Profile Picture</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Upload New</button>
                  <button className="px-4 py-2 text-rose-500 text-sm font-semibold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">Remove</button>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-8" />

            {/* Form Fields */}
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input type="text" defaultValue="Student" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">University Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" defaultValue="Stanford University" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none">
                    <option>Junior (Year 3)</option>
                    <option>Senior (Year 4)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio</label>
                <textarea rows={4} defaultValue="Computer Science student passionate about AI and full-stack web development." className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
                <p className="text-xs text-slate-500">Brief description for your profile. URLs are hyperlinked.</p>
              </div>

              <hr className="border-slate-200 dark:border-slate-800 my-8" />

              <h3 className="font-bold text-lg mb-4">Social Links</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="https://github.com/username" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="https://linkedin.com/in/username" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="https://yourportfolio.com" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-all">Save Changes</button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
