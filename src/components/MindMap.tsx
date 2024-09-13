import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const MindMap: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MindMap</CardTitle>
      </CardHeader>
      <CardContent>
        <span>123</span>
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </CardContent>
    </Card>
  );
};
export default MindMap;
