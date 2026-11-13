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
import {
  Lock, CheckCircle2, Circle, Award, ChevronRight, ArrowLeft,
  Code2, Cpu, Cloud, Shield, Smartphone, Compass, ExternalLink
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

type NodeStatus = 'completed' | 'available' | 'locked'

const ROADMAP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fullstack: Code2,
  datascience: Cpu,
  devops: Cloud,
  aiml: Cpu,
  cybersecurity: Shield,
  mobile: Smartphone,
}

function RoadmapNodeComponent({ data }: NodeProps) {
  const { label, status, xp, onClick } = data as {
    label: string
    status: NodeStatus
    xp: number
    onClick: () => void
  }

  const styleMap = {
    completed: 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-700 dark:text-blue-300 font-medium',
    available: 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium cursor-pointer hover:border-blue-500',
    locked:    'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 cursor-not-allowed',
  }

  const iconMap = {
    completed: <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />,
    available: <Circle size={14} className="text-zinc-400" />,
    locked:    <Lock size={14} className="text-zinc-400" />,
  }

  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={`px-3.5 py-2.5 rounded-lg border transition-colors duration-150 text-center min-w-[140px] select-none ${styleMap[status]}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        {iconMap[status]}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
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
    style: { stroke: '#3b82f6', strokeWidth: 1.5 },
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

  const card = isDark 
    ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl' 
    : 'bg-white border border-zinc-200 text-zinc-900 rounded-xl shadow-sm'

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Career Roadmaps</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Structured learning paths for software roles. Track your progress across key milestones.</p>
        </div>
        <div className={`border rounded-lg px-3.5 py-2 flex items-center gap-2 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800 shadow-sm'
        }`}>
          <Award className="text-blue-600 dark:text-blue-400" size={16} />
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-medium block">Total Points</span>
            <span className="font-semibold text-xs">{userXP} XP</span>
          </div>
        </div>
      </div>

      {/* ROADMAP GRID */}
      {!activeRoadmap && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROADMAPS.map(rm => {
            const Icon = ROADMAP_ICONS[rm.id] || Compass
            const totalNodes = rm.nodes.length
            const doneNodes = rm.nodes.filter(n => completedNodes.has(n.id)).length
            const pct = Math.round((doneNodes / totalNodes) * 100)
            return (
              <div
                key={rm.id}
                onClick={() => openRoadmap(rm)}
                className={`${card} p-5 cursor-pointer transition-colors duration-150 hover:border-zinc-400 dark:hover:border-zinc-700 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-blue-400' : 'bg-zinc-100 border-zinc-200 text-blue-600'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {doneNodes}/{totalNodes} nodes
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{rm.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{rm.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <span>Open roadmap</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ACTIVE ROADMAP INTERACTIVE CANVAS */}
      {activeRoadmap && (
        <div className="space-y-4">
          <div className={`${card} p-3.5 flex items-center justify-between`}>
            <button
              onClick={() => setActiveRoadmap(null)}
              className="text-xs font-medium flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft size={15} /> All Roadmaps
            </button>
            <h2 className="text-sm font-semibold">{activeRoadmap.title}</h2>
          </div>

          <div className={`h-[540px] rounded-xl overflow-hidden relative border ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background color={isDark ? '#27272a' : '#e4e4e7'} gap={20} />
              <Controls />
              <MiniMap nodeColor={isDark ? '#3b82f6' : '#2563eb'} maskColor={isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'} />
            </ReactFlow>

            {/* NODE DETAILS DRAWER */}
            {selectedNode && (
              <div className={`absolute right-4 top-4 bottom-4 w-80 rounded-xl p-5 shadow-lg flex flex-col justify-between z-10 border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
              }`}>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium tracking-wide uppercase text-zinc-400">Node Details</span>
                    <button onClick={() => setSelectedNode(null)} className="text-xs text-zinc-400 hover:text-zinc-200">Close</button>
                  </div>
                  <h3 className="text-base font-semibold">{selectedNode.label}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{selectedNode.description}</p>
                  
                  {selectedNode.resources && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide block">Resources</span>
                      {Array.isArray(selectedNode.resources) ? selectedNode.resources.map((r: any, i: number) => (
                        <a key={i} href={r.url || '#'} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                          <ExternalLink size={12} /> {r.title || r}
                        </a>
                      )) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedNode.resources}</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => completeNode(selectedNode)}
                  disabled={completedNodes.has(selectedNode.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    completedNodes.has(selectedNode.id)
                      ? isDark ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {completedNodes.has(selectedNode.id) ? 'Completed' : `Mark Completed (+${selectedNode.xp} XP)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
