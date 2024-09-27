"use client";

import ChatSidebar from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { parseMarkdownToFlowData } from "@/lib/flowUtils";
import { useChatStore } from "@/store/chatStore";
import { useMindMapStore } from "@/store/mindMapStore";
import type { MindMap as MindMapType } from "@/types/mindmap";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Save,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const MindMapContent = ({
  mindMap,
  onSave,
  onDelete,
}: {
  mindMap: MindMapType;
  onSave: (mindMap: MindMapType) => void;
  onDelete: () => void;
}) => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [colorMode, setColorMode] = useState<"light" | "dark">(() =>
    theme === "light" ? "light" : "dark",
  );
  const {
    nodes,
    edges,
    highlightedNodes,
    setNodes,
    setEdges,
    setHighlightedNodes,
    onNodesChange,
  } = useMindMapStore();
  const { messages = [], setMessages } = useChatStore();

  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [],
  );

  useEffect(() => {
    setColorMode(theme === "dark" ? "dark" : "light");
  }, [theme]);
  const reactFlowInstance = useReactFlow();

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result?.draggableId) return;

      const message = messages.find(
        (message) => message.id === result.draggableId,
      );
      if (!message) return;

      const { nodes: newNodes, edges: newEdges } = parseMarkdownToFlowData(
        message.content,
      );

      setNodes(newNodes);
      setEdges(newEdges);

      const newNodeIds = newNodes.map((node) => node.id);
      setHighlightedNodes(newNodeIds);
      setTimeout(() => setHighlightedNodes([]), 2000);

      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
      }, 50);
    },
    [messages, setNodes, setEdges, setHighlightedNodes, reactFlowInstance],
  );

  useEffect(() => {
    if (mindMap.data) {
      const {
        nodes: newNodes,
        edges: newEdges,
        messages: newMessages,
      } = mindMap.data;
      setNodes(newNodes);
      setEdges(newEdges);
      setMessages(newMessages);
    }
  }, [mindMap, setNodes, setEdges, setMessages]);
  function saveMindMap() {
    mindMap.data = {
      nodes: nodes || [],
      edges: edges || [],
      messages: messages || [],
    };
    onSave(mindMap);
  }

  return (
    <Card className="flex h-[90%]">
      <DragDropContext onDragEnd={onDragEnd}>
        <CardContent className="relative flex-grow p-0">
          <ReactFlow
            nodes={(nodes || []).map((node) => ({
              ...node,
              style: highlightedNodes.includes(node.id)
                ? { border: "2px solid #ff0" }
                : {},
            }))}
            edges={edges || []}
            colorMode={colorMode}
            zoomOnScroll={true}
            zoomOnDoubleClick={false}
            fitView
            onNodesChange={onNodesChange}
          >
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
          <div className="absolute left-2 top-2 flex gap-1 rounded-md bg-background/10 p-1 backdrop-blur">
            <Button variant="outline" size="icon" onClick={saveMindMap}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

const MindMap = (props: {
  mindMap: MindMapType;
  onSave: (mindMap: MindMapType) => void;
  onDelete: () => void;
}) => {
  return (
    <ReactFlowProvider>
      <MindMapContent {...props} />
    </ReactFlowProvider>
  );
};

export default MindMap;
