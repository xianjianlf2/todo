import type { Message } from "@/store/chatStore";
import type { Edge, Node } from "@xyflow/react";

export interface MindMap {
    id: string;
    name: string;
    data: {
        nodes: Node[];
        edges: Edge[];
        messages: Message[];
    };
    timestamp: number;
}