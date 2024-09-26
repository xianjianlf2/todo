import type { Edge, Node, NodeChange } from "@xyflow/react";
import { applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

type MindMapStore = {
    nodes: Node[];
    edges: Edge[];
    highlightedNodes: string[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setHighlightedNodes: (nodeIds: string[]) => void;
    onNodesChange: (changes: NodeChange<Node>[]) => void
};
export const useMindMapStore = create<MindMapStore>((set, get) => ({
    nodes: [],
    edges: [],
    highlightedNodes: [],
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setHighlightedNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),
    onNodesChange: (updatedNodes) => {
        const { nodes } = get();
        const newNodes = applyNodeChanges(updatedNodes, nodes);
        set({ nodes: newNodes });
        return newNodes;
    },
}));
