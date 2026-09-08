'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { createClient } from '@/lib/supabase/client'
import { ROADMAPS, type RoadmapNode } from '@/lib/roadmaps/data'
import { Lock, CheckCircle2, Circle, Star, ChevronRight, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

// ── NODE STATUS TYPES ──
type NodeStatus = 'completed' | 'available' | 'locked'

// ── CUSTOM NODE COMPONENT ──
function RoadmapNodeComponent({ data }: NodeProps) {
  const { label, status, xp, onClick } = data as {
    label: string
    status: NodeStatus
    xp: number
    onClick: () => void
  }

  const styleMap = {
    completed: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    available: 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold cursor-pointer hover:scale-105 shadow-md',
    locked:    'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed opacity-60',
  }

  const iconMap = {
    completed: <CheckCircle2 size={14} className="text-emerald-400" />,
    available: <Circle size={14} className="text-sky-400" />,
    locked:    <Lock size={14} className="text-slate-500" />,
  }

  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={`px-4 py-3 rounded-2xl border-2 transition-all text-center min-w-[140px] select-none shadow-sm ${styleMap[status]}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {iconMap[status]}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className={`text-[9px] font-extrabold ${status === 'completed' ? 'text-emerald-400' : status === 'available' ? 'text-sky-400' : 'text-slate-500'}`}>
        +{xp} XP
      </span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { roadmapNode: RoadmapNodeComponent }

function buildFlowNodes(
  nodes: RoadmapNode[],
  masteredSkills: string[],
  completedNodeIds: Set<string>,
  onClickNode: (node: RoadmapNode) => void
): Node[] {
  const depthMap: Record<string, number> = {}
  const getDepth = (id: string, visited = new Set<string>()): number => {
    if (visited.has(id)) return 0
    visited.add(id)
    const node = nodes.find(n => n.id === id)!
    if (!node.prerequisites.length) return 0
    return 1 + Math.max(...node.prerequisites.map(p => getDepth(p, new Set(visited))))
  }

  nodes.forEach(n => { depthMap[n.id] = getDepth(n.id) })

  const layerCounts: Record<number, number> = {}
  nodes.forEach(n => { layerCounts[depthMap[n.id]] = (layerCounts[depthMap[n.id]] || 0) + 1 })

  const posTracker: Record<number, number> = {}

  return nodes.map(n => {
    const depth = depthMap[n.id]
    const count = layerCounts[depth]
    posTracker[depth] = (posTracker[depth] ?? -1) + 1
    const col = posTracker[depth]
    const x = (col - (count - 1) / 2) * 200
    const y = depth * 140

    const isCompleted = completedNodeIds.has(n.id)
    const prereqsDone = n.prerequisites.every(p => completedNodeIds.has(p))
    const hasSkill = n.skills.length === 0 || n.skills.some(s => masteredSkills.includes(s))
    const status: NodeStatus = isCompleted ? 'completed'
      : (prereqsDone && (hasSkill || n.prerequisites.length === 0)) ? 'available'
      : 'locked'

    return {
      id: n.id,
      type: 'roadmapNode',
      position: { x, y },
      data: { label: n.label, status, xp: n.xp, onClick: () => onClickNode(n) },
    }
  })
}

function buildFlowEdges(edges: Array<{ from: string; to: string }>): Edge[] {
  return edges.map(e => ({
    id: `${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    style: { stroke: '#0284c7', strokeWidth: 2, opacity: 0.7 },
    animated: false,
  }))
}

export default function RoadmapsPage() {
  const supabase = createClient()
  const { isDark } = useTheme()
  const [masteredSkills, setMasteredSkills] = useState<string[]>([])
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set())
  const [userXP, setUserXP] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  const [activeRoadmap, setActiveRoadmap] = useState<typeof ROADMAPS[0] | null>(null)
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('mastered_skills,xp').eq('id', user.id).single()
      if (data) {
        setMasteredSkills(data.mastered_skills || [])
        setUserXP(data.xp || 0)
      }
      const { data: prog } = await supabase.from('roadmap_progress').select('node_id').eq('user_id', user.id)
      if (prog) setCompletedNodes(new Set(prog.map(p => p.node_id)))
    }
    load()
  }, [])

  const openRoadmap = useCallback((roadmap: typeof ROADMAPS[0]) => {
    setActiveRoadmap(roadmap)
    setSelectedNode(null)
    const flowNodes = buildFlowNodes(roadmap.nodes, masteredSkills, completedNodes, setSelectedNode)
    const flowEdges = buildFlowEdges(roadmap.edges)
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [masteredSkills, completedNodes])

  const completeNode = useCallback(async (node: RoadmapNode) => {
    if (!userId || completedNodes.has(node.id)) return
    const { error } = await supabase.from('roadmap_progress').upsert({
      user_id: userId, node_id: node.id, roadmap_id: activeRoadmap?.id
    })
    if (!error) {
      const newCompleted = new Set([...completedNodes, node.id])
      setCompletedNodes(newCompleted)
      const newXP = userXP + node.xp
      setUserXP(newXP)
      await supabase.from('profiles').update({ xp: newXP }).eq('id', userId)
      if (activeRoadmap) {
        setNodes(buildFlowNodes(activeRoadmap.nodes, masteredSkills, newCompleted, setSelectedNode))
      }
      setSelectedNode(null)
    }
  }, [userId, completedNodes, userXP, activeRoadmap, masteredSkills])

  const cardStyle = isDark 
    ? 'bg-[#111118]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white' 
    : 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm text-slate-900'

  return (
    <div className={`max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
        <div>
          <h1 className={`text-3xl font-black mb-1 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Career Roadmaps</h1>
          <p className={`font-semibold text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Visual skill-trees that unlock based on your actual profile skills.</p>
        </div>
        <div className={`border rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm ${
          isDark ? 'bg-[#12121a]/90 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <Star className="text-emerald-500 fill-emerald-500" size={18} />
          <div>
            <p className="text-[9px] font-bold uppercase">Total XP</p>
            <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{userXP} XP</p>
          </div>
        </div>
      </div>

      {/* ROADMAP GRID */}
      {!activeRoadmap && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROADMAPS.map(rm => {
            const totalNodes = rm.nodes.length
            const doneNodes = rm.nodes.filter(n => completedNodes.has(n.id)).length
            const pct = Math.round((doneNodes / totalNodes) * 100)
            return (
              <div key={rm.id} onClick={() => openRoadmap(rm)}
                className={`${cardStyle} rounded-3xl p-6 cursor-pointer transition-all hover:border-emerald-500/40 group`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-4xl p-2 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>{rm.emoji}</span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-sky-100 text-sky-700 border-sky-200'
                  }`}>
                    {doneNodes}/{totalNodes} nodes
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-sky-600'}`}>{rm.title}</h3>
                <p className={`text-xs font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{rm.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{pct}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                    <div className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-sky-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className={`mt-4 flex items-center gap-1 text-xs font-bold transition-colors ${isDark ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-sky-600 group-hover:text-sky-800'}`}>
                  Open Roadmap <ChevronRight size={14} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ACTIVE ROADMAP INTERACTIVE CANVAS */}
      {activeRoadmap && (
        <div className="space-y-4">
          <div className={`${cardStyle} rounded-2xl p-4 flex items-center justify-between`}>
            <button
              onClick={() => setActiveRoadmap(null)}
              className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-sky-600 hover:text-sky-800'}`}
            >
              <ArrowLeft size={16} /> Back to Roadmaps
            </button>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeRoadmap.emoji} {activeRoadmap.title}</h2>
          </div>

          <div className={`h-[550px] rounded-3xl overflow-hidden relative border ${
            isDark ? 'bg-[#0c0c12] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background color={isDark ? '#334155' : '#cbd5e1'} gap={20} />
              <Controls />
              <MiniMap nodeColor={isDark ? '#10b981' : '#0284c7'} maskColor={isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'} />
            </ReactFlow>

            {/* NODE DETAILS DRAWER */}
            {selectedNode && (
              <div className={`absolute right-4 top-4 bottom-4 w-80 rounded-3xl p-5 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border ${
                isDark ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-sky-600'}`}>ROADMAP NODE</span>
                    <button onClick={() => setSelectedNode(null)} className="text-xs font-bold text-slate-400 hover:text-slate-200">✕</button>
                  </div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedNode.label}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedNode.description}</p>
                  
                  {selectedNode.resources && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Resources</span>
                      {Array.isArray(selectedNode.resources) ? selectedNode.resources.map((r: any, i: number) => (
                        <a key={i} href={r.url || '#'} target="_blank" rel="noreferrer" className={`text-xs block truncate font-medium ${isDark ? 'text-emerald-400 hover:underline' : 'text-sky-600 hover:underline'}`}>
                          🔗 {r.title || r}
                        </a>
                      )) : (
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedNode.resources}</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => completeNode(selectedNode)}
                  disabled={completedNodes.has(selectedNode.id)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
                    completedNodes.has(selectedNode.id)
                      ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {completedNodes.has(selectedNode.id) ? '✓ Completed (+XP Claimed)' : `Complete Node (+${selectedNode.xp} XP)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

