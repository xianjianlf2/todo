"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { Input } from "./ui/input";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const MindMap: React.FC = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Card className="flex h-screen">
      <CardContent className="relative flex-grow p-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
         
          colorMode={theme === "dark" ? "dark" : "light"}
          zoomOnScroll={true}
          zoomOnDoubleClick={false}
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-2"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </CardContent>

      {isSidebarOpen && (
        <div className="flex w-[300px] flex-col border-l p-4">
          <h2 className="mb-4 text-lg font-semibold">Chat & Edit</h2>
          <div className="mb-4 flex-grow overflow-y-auto">
            {/* Chat messages */}
          </div>
          <Input placeholder="Type your message..." className="mb-4" />
          <div className="space-y-4">
            <h3 className="font-medium">Edit Node</h3>
            {/* Add node editing controls here */}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MindMap;
