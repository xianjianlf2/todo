import { generateId } from "@/lib/utils";
import { Edge, Node } from "@xyflow/react";
import { create } from "zustand";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

type MindMapStore = {
    nodes: Node[]
    edges: Edge[]
    messages: Message[]
    isStreaming: boolean
    highlightedNode: string | null
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    addMessage: (content: string, role: "user" | "assistant") => void
    setHighlightedNode: (nodeId: string | null) => void
    setIsStreaming: (isStreaming: boolean) => void
}
export const useMindMapStore = create<MindMapStore>((set) => ({
    nodes: [],
    edges: [],
    messages: [],
    isStreaming: false,
    highlightedNode: null,
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    addMessage: (content, role) => set((state) => ({
        messages: [...state.messages, { id: generateId(), content, role }]
    })),
    setHighlightedNode: (nodeId) => set({ highlightedNode: nodeId }),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
}))



