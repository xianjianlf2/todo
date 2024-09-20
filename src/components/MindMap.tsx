"use client";

import ChatSidebar from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateId } from "@/lib/utils";
import { useMindMapStore } from "@/store/mindMapStore";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
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
    highlightedNode,
    setNodes,
    setEdges,
    setHighlightedNode,
    messages,
  } = useMindMapStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setColorMode(theme === "dark" ? "dark" : "light");
  }, [theme]);

  const onDragEnd = (result: any) => {
    if (!result) return;
    const message = messages.find(
      (message) => message.id === result.draggableId,
    );
    if (message) {
      const newNode = {
        id: generateId(),
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: { label: message.content },
      };
      setNodes([...nodes, newNode]);
      setHighlightedNode(newNode.id);

      setTimeout(() => setHighlightedNode(null), 2000);
    }
  };

  return (
    <Card className="flex h-[95%]">
      <DragDropContext onDragEnd={onDragEnd}>
        <CardContent className="relative flex-grow p-0">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style:
                node.id === highlightedNode
                  ? { border: "2px solid #ff0" }
                  : {},
            }))}
            edges={edges}
            colorMode={colorMode}
            zoomOnScroll={true}
            zoomOnDoubleClick={false}
            fitView
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
