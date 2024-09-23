"use client";

import ChatSidebar from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChatStore } from "@/store/chatStore";
import { useMindMapStore } from "@/store/mindMapStore";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

interface MarkdownNode {
  id: string;
  type: string;
  data: {
    label: string;
  };
  position: XYPosition;
  depth: number;
}

function markdownToNodesAndEdges(markdown: string): {
  nodes: Node[];
  edges: Edge[];
} {
  const lines = markdown.split("\n");
  const nodes: MarkdownNode[] = [];
  const edges: Edge[] = [];
  let currentDepth = 0;
  let lastNodeId = "";

  lines.forEach((line, index) => {
    if (line.startsWith("#")) {
      const depth = line.match(/^#+/)![0].length;
      const id = `node-${index}`;
      const label = line.substring(depth).trim();
      const position: XYPosition = { x: index * 200, y: 100 * depth };

      nodes.push({
        id,
        data: { label },
        position,
        depth,
        type: "default",
      });

      if (lastNodeId && depth > currentDepth) {
        edges.push({
          id: `edge-${index}`,
          type: "straight",
          source: lastNodeId,
          target: id,
        });
      } else if (lastNodeId && depth < currentDepth) {
        let parentId = "";
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i] && nodes[i]!.depth === depth - 1) {
            parentId = nodes[i]!.id;
            break;
          }
        }
        if (parentId) {
          edges.push({
            id: `edge-${index}`,
            type: "straight",
            source: parentId,
            target: id,
          });
        }
      }

      currentDepth = depth;
      lastNodeId = id;
    }
  });

  return { nodes, edges };
}

const MindMap = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  const {
    nodes,
    edges,
    highlightedNodes,
    setNodes,
    setEdges,
    setHighlightedNodes,
    onNodesChange,
  } = useMindMapStore();
  const { messages } = useChatStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setColorMode(theme === "dark" ? "dark" : "light");
  }, [theme]);

  const onDragEnd = (result: any) => {
    if (!result || !result.draggableId) return;
    const message = messages.find(
      (message) => message.id === result.draggableId,
    );
    if (!message) return;

    const { nodes: newNodes, edges: newEdges } = markdownToNodesAndEdges(
      message.content,
    );
    setNodes(newNodes);
    setEdges(newEdges);
    setHighlightedNodes(newNodes.map((node) => node.id));
    setTimeout(() => setHighlightedNodes([]), 2000);
  };

  return (
    <Card className="flex h-[95%]">
      <DragDropContext onDragEnd={onDragEnd}>
        <CardContent className="relative flex-grow p-0">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style: highlightedNodes.includes(node.id)
                ? { border: "2px solid #ff0" }
                : {},
            }))}
            edges={edges}
            colorMode={colorMode}
            zoomOnScroll={true}
            zoomOnDoubleClick={false}
            fitView
            onNodesChange={onNodesChange}
          >
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 flex h-auto flex-col items-center p-1"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <ChevronRight className="mb-1" />
            ) : (
              <ChevronLeft className="mb-1" />
            )}
            <MessageSquare />
          </Button>
        </CardContent>
        {isSidebarOpen && <ChatSidebar isSidebarOpen={isSidebarOpen} />}
      </DragDropContext>
    </Card>
  );
};

export default MindMap;
