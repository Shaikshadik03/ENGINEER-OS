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
    completed: 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold',
    available: 'bg-sky-50 border-sky-400 text-slate-900 font-bold cursor-pointer hover:scale-105 shadow-sm',
    locked:    'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60',
  }

  const iconMap = {
    completed: <CheckCircle2 size={14} className="text-emerald-600" />,
    available: <Circle size={14} className="text-sky-600" />,
    locked:    <Lock size={14} className="text-slate-400" />,
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
      <span className={`text-[9px] font-extrabold ${status === 'completed' ? 'text-emerald-700' : status === 'available' ? 'text-sky-700' : 'text-slate-400'}`}>
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

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 text-slate-900 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Career Roadmaps</h1>
          <p className="text-slate-500 font-semibold text-sm">Visual skill-trees that unlock based on your actual profile skills.</p>
        </div>
        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Star className="text-emerald-600 fill-emerald-600" size={18} />
          <div>
            <p className="text-[9px] text-emerald-700 font-bold uppercase">Total XP</p>
            <p className="text-slate-900 font-black text-sm">{userXP} XP</p>
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
                className="bg-white border border-slate-200/80 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-md hover:border-sky-300 shadow-sm group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl p-2 bg-slate-50 rounded-2xl border border-slate-100">{rm.emoji}</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                    {doneNodes}/{totalNodes} nodes
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">{rm.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{rm.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Progress</span>
                    <span className="text-slate-900 font-extrabold">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:text-sky-800 transition-colors">
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
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <button
              onClick={() => setActiveRoadmap(null)}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> Back to Roadmaps
            </button>
            <h2 className="text-base font-bold text-slate-900">{activeRoadmap.emoji} {activeRoadmap.title}</h2>
          </div>

          <div className="h-[550px] bg-white border border-slate-200/80 rounded-3xl overflow-hidden relative shadow-sm">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background color="#cbd5e1" gap={20} />
              <Controls />
              <MiniMap nodeColor="#0284c7" maskColor="rgba(255, 255, 255, 0.7)" />
            </ReactFlow>

            {/* NODE DETAILS DRAWER */}
            {selectedNode && (
              <div className="absolute right-4 top-4 bottom-4 w-80 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">ROADMAP NODE</span>
                    <button onClick={() => setSelectedNode(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedNode.label}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedNode.description}</p>
                  
                  {selectedNode.resources && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Resources</span>
                      {Array.isArray(selectedNode.resources) ? selectedNode.resources.map((r: any, i: number) => (
                        <a key={i} href={r.url || '#'} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline block truncate font-medium">
                          🔗 {r.title || r}
                        </a>
                      )) : (
                        <p className="text-xs text-slate-600 font-medium">{selectedNode.resources}</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => completeNode(selectedNode)}
                  disabled={completedNodes.has(selectedNode.id)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
                    completedNodes.has(selectedNode.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
