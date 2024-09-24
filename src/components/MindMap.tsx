"use client";

import ChatSidebar from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { parseMarkdownToFlowData } from "@/lib/flowUtils";
import { useChatStore } from "@/store/chatStore";
import { useMindMapStore } from "@/store/mindMapStore";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";



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

    const { nodes: newNodes, edges: newEdges } = parseMarkdownToFlowData(
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
