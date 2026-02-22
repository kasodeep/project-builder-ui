import dagre from "dagre"
import type { Node, Edge } from "reactflow"

const nodeSize = 120 // circular node diameter

export function layoutGraph(nodes: Node[], edges: Edge[]) {
    const g = new dagre.graphlib.Graph()

    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({
        rankdir: "LR",
        nodesep: 50,
        ranksep: 150,
        marginx: 40,
        marginy: 40,
    })

    nodes.forEach((node) => {
        g.setNode(node.id, { width: nodeSize, height: nodeSize })
    })

    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target)
    })

    dagre.layout(g)

    const layoutedNodes = nodes.map((node) => {
        const n = g.node(node.id)
        return {
            ...node,
            position: {
                x: n.x - nodeSize / 2,
                y: n.y - nodeSize / 2,
            },
            sourcePosition: "right" as const,
            targetPosition: "left" as const,
        }
    })

    return { nodes: layoutedNodes, edges }
}