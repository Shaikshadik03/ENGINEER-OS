'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, MoreHorizontal, Clock, Tag, CheckCircle2,
  X, Sparkles, AlertCircle
} from 'lucide-react'

interface Task {
  id: string
  title: string
  tag: string
  status: 'todo' | 'in_progress' | 'done'
  due_date: string
}

export default function TasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskTag, setTaskTag] = useState('Dev')
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in_progress' | 'done'>('todo')
  const [taskDueDate, setTaskDueDate] = useState('Today')
  const [submitting, setSubmitting] = useState(false)

  // Load tasks from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setTasks(data)
        } else {
          // Default seed tasks if empty
          const starters: Task[] = [
            { id: '1', title: 'Complete Programming in C Module 1', tag: 'Syllabus', status: 'in_progress', due_date: 'Today' },
            { id: '2', title: 'Practice 2 LeetCode Array Problems', tag: 'DSA', status: 'todo', due_date: 'Today' },
            { id: '3', title: 'Analyze Resume with AI Resume Coach', tag: 'Career', status: 'todo', due_date: 'Tomorrow' },
            { id: '4', title: 'Setup Supabase Database Schema', tag: 'Dev', status: 'done', due_date: 'Done' },
          ]
          setTasks(starters)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim() || !userId) return
    setSubmitting(true)

    const newTaskData = {
      user_id: userId,
      title: taskTitle.trim(),
      tag: taskTag,
      status: taskStatus,
      due_date: taskDueDate,
    }

    const { data: created, error } = await supabase.from('tasks').insert(newTaskData).select().single()

    if (!error && created) {
      setTasks(prev => [created, ...prev])
      setShowModal(false)
      setTaskTitle('')
    } else {
      // Local fallback ID if table isn't migrated yet
      const fallback: Task = {
        id: `local_${Date.now()}`,
        title: taskTitle.trim(),
        tag: taskTag,
        status: taskStatus,
        due_date: taskDueDate,
      }
      setTasks(prev => [fallback, ...prev])
      setShowModal(false)
      setTaskTitle('')
    }
    setSubmitting(false)
  }

  // Update Task Status
  const moveTask = async (task: Task, nextStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t))
    if (userId) {
      await supabase.from('tasks').upsert({
        id: task.id,
        user_id: userId,
        title: task.title,
        tag: task.tag,
        status: nextStatus,
        due_date: nextStatus === 'done' ? 'Done' : task.due_date
      })
    }
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-white/5 text-gray-400 border-white/10' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
  ]

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Kanban Task Board</h1>
          <p className="text-gray-500 text-sm">Organize your engineering journey, university assignments, and interview prep.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          return (
            <div key={col.id} className="bg-[#111118] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${col.color}`}>
                  {col.title} ({colTasks.length})
                </span>
                <button onClick={() => { setTaskStatus(col.id as any); setShowModal(true) }} className="text-gray-500 hover:text-white">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 hover:border-indigo-500/40 transition-all"
                  >
                    <h4 className="font-bold text-sm text-white">{task.title}</h4>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-indigo-300">
                        <Tag size={10} className="inline mr-1" />{task.tag}
                      </span>

                      {/* Move Actions */}
                      <div className="flex gap-1">
                        {col.id !== 'todo' && (
                          <button onClick={() => moveTask(task, 'todo')} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded">
                            ← Todo
                          </button>
                        )}
                        {col.id !== 'in_progress' && (
                          <button onClick={() => moveTask(task, 'in_progress')} className="text-[10px] bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 px-2 py-0.5 rounded">
                            Progress
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button onClick={() => moveTask(task, 'done')} className="text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-0.5 rounded font-bold">
                            ✓ Done
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center text-xs text-gray-600 py-12 border border-dashed border-white/5 rounded-xl">
                    No tasks in {col.title}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* NEW TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" /> Create New Task
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 2 LeetCode Mediums on Graphs"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tag / Category</label>
                  <select
                    value={taskTag}
                    onChange={e => setTaskTag(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Syllabus" className="bg-[#111118]">Syllabus</option>
                    <option value="Dev" className="bg-[#111118]">Dev</option>
                    <option value="DSA" className="bg-[#111118]">DSA / Prep</option>
                    <option value="Career" className="bg-[#111118]">Career</option>
                    <option value="University" className="bg-[#111118]">University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Column Status</label>
                  <select
                    value={taskStatus}
                    onChange={e => setTaskStatus(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="todo" className="bg-[#111118]">To Do</option>
                    <option value="in_progress" className="bg-[#111118]">In Progress</option>
                    <option value="done" className="bg-[#111118]">Done</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  {submitting ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
