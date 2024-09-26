"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getMindMaps, initDB } from "@/lib/indexedDB";
import type { MindMap } from "@/types/mindmap";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MindMapListPage() {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);

  useEffect(() => {
    const loadMindMaps = async () => {
      await initDB();
      const maps = await getMindMaps();
      setMindMaps(maps);
    };
    void loadMindMaps();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">My Mind Maps</h1>
      <Button asChild className="mb-4">
        <Link href="/mindmap/new">Create New Mind Map</Link>
      </Button>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mindMaps.map((map) => (
          <Card
            key={map.id}
            className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle>{map.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(map.timestamp).toLocaleString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link">
                <Link href={`/mindmap/${map.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
