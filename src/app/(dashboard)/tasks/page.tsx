'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckSquare, Plus, X, Trash2, ArrowRight, Circle, CheckCircle2 } from 'lucide-react'

interface Task {
  id: string
  title: string
  tag: string
  status: string
  due_date: string | null
}

const TAGS = ['Dev', 'DSA', 'Syllabus', 'Career', 'Project', 'Other']
const STATUSES = ['todo', 'inprogress', 'done']
const STATUS_LABELS: Record<string, string> = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }
const TAG_COLORS: Record<string, string> = {
  Dev: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DSA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Syllabus: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Career: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Project: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function TasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newTag, setNewTag] = useState('Dev')
  const [newStatus, setNewStatus] = useState('todo')
  const [newDue, setNewDue] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setTasks(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !newTitle) return
    setSaving(true)

    const { data, error } = await supabase.from('tasks').insert({
      user_id: userId,
      title: newTitle,
      tag: newTag,
      status: newStatus,
      due_date: newDue || null,
    }).select().single()

    if (!error && data) {
      setTasks(prev => [data, ...prev])
      setNewTitle(''); setNewTag('Dev'); setNewStatus('todo'); setNewDue('')
      setShowModal(false)
    } else {
      alert('Error: ' + error?.message)
    }
    setSaving(false)
  }

  const handleStatusChange = async (task: Task) => {
    const next = task.status === 'todo' ? 'inprogress' : task.status === 'inprogress' ? 'done' : 'todo'
    const { error } = await supabase.from('tasks').update({ status: next }).eq('id', task.id)
    if (!error) setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t))
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  const columns = STATUSES.map(status => ({
    status,
    label: STATUS_LABELS[status],
    tasks: tasks.filter(t => t.status === status),
  }))

  const COL_STYLES: Record<string, string> = {
    todo: 'border-gray-500/30',
    inprogress: 'border-amber-500/30',
    done: 'border-emerald-500/30',
  }
  const COL_HEADER: Record<string, string> = {
    todo: 'text-gray-400',
    inprogress: 'text-amber-400',
    done: 'text-emerald-400',
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><CheckSquare className="text-indigo-400" size={24} /> Task Board</h1>
          <p className="text-gray-500 text-sm mt-1">Tasks are saved permanently. They stay until you mark them done or delete them.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={15} /> New Task
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading your tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map(col => (
            <div key={col.status} className={`bg-[#111118] border rounded-2xl p-4 ${COL_STYLES[col.status]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${COL_HEADER[col.status]}`}>{col.label}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 ${COL_HEADER[col.status]}`}>{col.tasks.length}</span>
              </div>

              <div className="space-y-3">
                {col.tasks.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-4">No tasks here</p>
                )}
                {col.tasks.map(task => (
                  <div key={task.id} className="bg-white/3 border border-white/8 rounded-xl p-3 group hover:border-white/15 transition-all">
                    <div className="flex items-start gap-2">
                      <button onClick={() => handleStatusChange(task)} className="mt-0.5 shrink-0 text-gray-500 hover:text-indigo-400 transition-colors">
                        {task.status === 'done' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold text-white ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TAG_COLORS[task.tag] || TAG_COLORS.Other}`}>{task.tag}</span>
                          {task.due_date && <span className="text-[9px] text-gray-500">Due {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        {task.status !== 'done' && (
                          <button onClick={() => handleStatusChange(task)} title="Advance status" className="p-1 rounded-lg hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400 transition-colors">
                            <ArrowRight size={12} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(task.id)} title="Delete" className="p-1 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-white">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Task Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Solve 5 LeetCode Array problems" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tag</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button type="button" key={tag} onClick={() => setNewTag(tag)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newTag === tag ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{tag}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Initial Status</label>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button type="button" key={s} onClick={() => setNewStatus(s)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newStatus === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{STATUS_LABELS[s]}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date (optional)</label>
                <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold py-3 rounded-xl hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all">{saving ? 'Saving...' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
