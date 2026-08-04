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
  Dev: 'bg-sky-100 text-sky-800 border-sky-200',
  DSA: 'bg-purple-100 text-purple-800 border-purple-200',
  Syllabus: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Career: 'bg-amber-100 text-amber-800 border-amber-200',
  Project: 'bg-rose-100 text-rose-800 border-rose-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
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
    todo: 'border-slate-200',
    inprogress: 'border-amber-200',
    done: 'border-emerald-200',
  }
  const COL_HEADER: Record<string, string> = {
    todo: 'text-slate-500',
    inprogress: 'text-amber-700',
    done: 'text-emerald-700',
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500 text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight"><CheckSquare className="text-sky-600" size={28} /> Task Board</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Tasks are saved permanently. They stay until you mark them done or delete them.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md">
          <Plus size={15} /> New Task
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 font-bold py-16">Loading your tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map(col => (
            <div key={col.status} className={`bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm ${COL_STYLES[col.status]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${COL_HEADER[col.status]}`}>{col.label}</h3>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 ${COL_HEADER[col.status]}`}>{col.tasks.length}</span>
              </div>

              <div className="space-y-3">
                {col.tasks.length === 0 && (
                  <p className="text-xs text-slate-400 font-medium text-center py-4">No tasks here</p>
                )}
                {col.tasks.map(task => (
                  <div key={task.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 group hover:border-sky-300 transition-all">
                    <div className="flex items-start gap-2.5">
                      <button onClick={() => handleStatusChange(task)} className="mt-0.5 shrink-0 text-slate-400 hover:text-sky-600 transition-colors">
                        {task.status === 'done' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold text-slate-900 ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${TAG_COLORS[task.tag] || TAG_COLORS.Other}`}>{task.tag}</span>
                          {task.due_date && <span className="text-[9px] text-slate-400 font-semibold">Due {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        {task.status !== 'done' && (
                          <button onClick={() => handleStatusChange(task)} title="Advance status" className="p-1 rounded-lg hover:bg-sky-100 text-slate-400 hover:text-sky-600 transition-colors">
                            <ArrowRight size={12} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(task.id)} title="Delete" className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Task Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Solve 5 LeetCode Array problems" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tag</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button type="button" key={tag} onClick={() => setNewTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${newTag === tag ? 'bg-sky-600 border-sky-500 text-white font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}>{tag}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Status</label>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button type="button" key={s} onClick={() => setNewStatus(s)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${newStatus === s ? 'bg-sky-600 border-sky-500 text-white font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}>{STATUS_LABELS[s]}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date (optional)</label>
                <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-2xl transition-all shadow-md">{saving ? 'Saving...' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
