import { useMemo } from "react"
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    type Node,
    type Edge,
    MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { layoutGraph } from "@/util/layout"
import TaskNode from "./TaskNode"
import type { Task } from "@/types/task"

type Props = {
    tasks: Task[]
    onSelect: (taskId: string) => void
}

const nodeTypes = {
    taskNode: TaskNode,
}

const edgeDefaults = {
    animated: true,
    style: {
        stroke: "#94a3b8",
        strokeWidth: 1.5,
        strokeDasharray: "6 3",
    },
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#94a3b8",
        width: 16,
        height: 16,
    },
}

export default function TaskGraph({ tasks, onSelect }: Props) {

    // converting the tasks to nodes and edges.
    const { nodes, edges } = useMemo(() => {
        const nodes: Node[] = tasks.map((task) => ({
            id: task.id,
            type: "taskNode",
            data: {
                label: task.name,
                status: task.status,
            },
            position: { x: 0, y: 0 },
        }))

        const edges: Edge[] = tasks.flatMap((task) =>
            task.dependencies.map((depId) => ({
                id: `${depId}-${task.id}`,
                source: depId,
                target: task.id,
                ...edgeDefaults,
            }))
        )

        return layoutGraph(nodes, edges)
    }, [tasks])

    return (
        <div
            className="w-full h-full rounded-2xl overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
                boxShadow: "0 4px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                onNodeClick={(_, node) => {
                    onSelect(node.id)
                }}
                proOptions={{ hideAttribution: true }}
                style={{ background: "transparent" }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1.5}
                    color="#cbd5e1"
                />
                <Controls
                    style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        border: "1px solid #e2e8f0",
                    }}
                />
            </ReactFlow>
        </div>
    )
}