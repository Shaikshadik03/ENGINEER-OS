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
    completed: 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
    available: 'bg-indigo-500/20 border-indigo-500 text-white cursor-pointer hover:scale-105',
    locked:    'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed opacity-60',
  }

  const iconMap = {
    completed: <CheckCircle2 size={14} className="text-emerald-400" />,
    available: <Circle size={14} className="text-indigo-400" />,
    locked:    <Lock size={14} className="text-gray-600" />,
  }

  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={`px-4 py-3 rounded-xl border-2 transition-all text-center min-w-[140px] select-none shadow-lg ${styleMap[status]}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {iconMap[status]}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className={`text-[9px] font-semibold ${status === 'completed' ? 'text-emerald-400' : status === 'available' ? 'text-indigo-400' : 'text-gray-600'}`}>
        +{xp} XP
      </span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { roadmapNode: RoadmapNodeComponent }

// ── LAYOUT: arrange nodes in a simple vertical-layered grid ──
function buildFlowNodes(
  nodes: RoadmapNode[],
  masteredSkills: string[],
  completedNodeIds: Set<string>,
  onClickNode: (node: RoadmapNode) => void
): Node[] {
  // Assign layers based on prerequisites depth
  const depthMap: Record<string, number> = {}
  const getDepth = (id: string, visited = new Set<string>()): number => {
    if (visited.has(id)) return 0
    visited.add(id)
    const node = nodes.find(n => n.id === id)!
    if (!node.prerequisites.length) return 0
    return 1 + Math.max(...node.prerequisites.map(p => getDepth(p, new Set(visited))))
  }

  nodes.forEach(n => { depthMap[n.id] = getDepth(n.id) })

  const maxDepth = Math.max(...Object.values(depthMap))
  const layerCounts: Record<number, number> = {}
  const layerIndex: Record<number, number> = {}
  nodes.forEach(n => { layerCounts[depthMap[n.id]] = (layerCounts[depthMap[n.id]] || 0) + 1 })
  nodes.forEach(n => {
    const d = depthMap[n.id]
    layerIndex[d] = (layerIndex[d] || 0)
    layerIndex[d]++
  })

  const posTracker: Record<number, number> = {}

  return nodes.map(n => {
    const depth = depthMap[n.id]
    const count = layerCounts[depth]
    posTracker[depth] = (posTracker[depth] ?? -1) + 1
    const col = posTracker[depth]
    const x = (col - (count - 1) / 2) * 200
    const y = depth * 140

    // Determine status
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
    style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.5 },
    animated: false,
  }))
}

// ── MAIN PAGE ──
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

  // Load user profile
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
      // Load completed roadmap nodes
      const { data: prog } = await supabase.from('roadmap_progress').select('node_id').eq('user_id', user.id)
      if (prog) setCompletedNodes(new Set(prog.map(p => p.node_id)))
    }
    load()
  }, [])

  // Open a roadmap
  const openRoadmap = useCallback((roadmap: typeof ROADMAPS[0]) => {
    setActiveRoadmap(roadmap)
    setSelectedNode(null)
    const flowNodes = buildFlowNodes(roadmap.nodes, masteredSkills, completedNodes, setSelectedNode)
    const flowEdges = buildFlowEdges(roadmap.edges)
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [masteredSkills, completedNodes])

  // Mark a node complete
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
      // Rebuild flow with updated status
      if (activeRoadmap) {
        setNodes(buildFlowNodes(activeRoadmap.nodes, masteredSkills, newCompleted, setSelectedNode))
      }
      setSelectedNode(null)
    }
  }, [userId, completedNodes, userXP, activeRoadmap, masteredSkills])

  const colorMap: Record<string, string> = {
    indigo: 'border-indigo-500/30 hover:border-indigo-500',
    purple: 'border-purple-500/30 hover:border-purple-500',
    orange: 'border-orange-500/30 hover:border-orange-500',
    green: 'border-green-500/30 hover:border-green-500',
    pink: 'border-pink-500/30 hover:border-pink-500',
    red: 'border-red-500/30 hover:border-red-500',
  }

  const badgeColorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400',
    green: 'bg-green-500/10 text-green-400',
    pink: 'bg-pink-500/10 text-pink-400',
    red: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Career Roadmaps</h1>
          <p className="text-gray-500 text-sm">Visual skill-trees that unlock based on your actual profile skills.</p>
        </div>
        <div className="bg-[#111118] border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Star className="text-emerald-400 fill-emerald-400" size={18} />
          <div>
            <p className="text-[9px] text-emerald-400 font-bold uppercase">Total XP</p>
            <p className="text-white font-bold text-sm">{userXP}</p>
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
                className={`bg-[#111118] border rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${colorMap[rm.color]}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{rm.emoji}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColorMap[rm.color]}`}>
                    {doneNodes}/{totalNodes} nodes
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{rm.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{rm.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span className="text-white font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                  Open Roadmap <ChevronRight size={14} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* REACT FLOW CANVAS */}
      {activeRoadmap && (
        <div className="space-y-4">
          <button onClick={() => { setActiveRoadmap(null); setSelectedNode(null) }}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={15} /> Back to Roadmaps
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{activeRoadmap.emoji} {activeRoadmap.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Click an available node to view details. Green = your mastered skills unlock it.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 size={13} /> Completed</span>
              <span className="flex items-center gap-1.5 text-indigo-400"><Circle size={13} /> Available</span>
              <span className="flex items-center gap-1.5 text-gray-600"><Lock size={13} /> Locked</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: 500 }}>
            <ReactFlow
              nodes={nodes} edges={edges}
              onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#ffffff08" gap={24} />
              <Controls style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <MiniMap style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} nodeColor="#6366f1" />
            </ReactFlow>
          </div>

          {/* NODE DETAIL PANEL */}
          {selectedNode && (
            <div className="bg-[#111118] border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-gray-400 mb-3">{selectedNode.description}</p>
                {selectedNode.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedNode.skills.map(s => (
                      <span key={s} className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${masteredSkills.includes(s) ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-gray-500'}`}>
                        {masteredSkills.includes(s) ? '✓' : '○'} {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-indigo-400 font-semibold">+{selectedNode.xp} XP on completion</p>
              </div>
              <div className="shrink-0">
                {completedNodes.has(selectedNode.id)
                  ? <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-5 py-2.5 rounded-xl text-xs font-bold">
                      <CheckCircle2 size={15} /> Completed
                    </span>
                  : <button onClick={() => completeNode(selectedNode)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
                      <Star size={15} /> Mark Complete & Claim {selectedNode.xp} XP
                    </button>
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
