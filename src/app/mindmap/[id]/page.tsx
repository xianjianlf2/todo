"use client";

import MindMapComponent from "@/components/MindMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  deleteMindMap,
  getMindMapById,
  isDBReady,
  saveMindMap,
} from "@/lib/indexedDB";
import { generateId } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useMindMapStore } from "@/store/mindMapStore";
import type { MindMap } from "@/types/mindmap";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
export default function MindMapPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mindMap, setMindMap] = useState<MindMap | null>(null);
  const { toast } = useToast();
  const { setMessages, createMessage } = useChatStore();
  const { setNodes, setEdges } = useMindMapStore();

  const initialMindMap = useMemo(
    () => ({
      id: generateId(),
      name: "New Mind Map",
      data: {
        nodes: [],
        edges: [],
        messages: [createMessage("Hello,how can I help you?", "assistant")],
      },
      timestamp: Date.now(),
    }),
    [createMessage],
  );

  const loadMindMap = useCallback(async () => {
    const isReady = await isDBReady();
    if (!isReady) return;

    if (params.id === "new") {
      setMindMap(initialMindMap);
      return;
    }

    try {
      const loadedMap = await getMindMapById(params.id);
      if (!loadedMap) {
        router.push("/mindmap");
        toast({
          title: "Mind map not found",
          description: "The mind map you are looking for does not exist.",
          variant: "destructive",
        });
      } else {
        setMindMap(loadedMap);
      }
    } catch (error) {
      console.error("Error loading mind map:", error);
      router.push("/mindmap");
      toast({
        title: "Error loading mind map",
        description:
          "There was an error loading the mind map. Please try again later.",
        variant: "destructive",
      });
    }
  }, [params.id, router, toast, initialMindMap]);

  useEffect(() => {
    void loadMindMap();
  }, [loadMindMap]);

  useEffect(() => {
    if (mindMap) {
      setNodes(mindMap.data.nodes);
      setEdges(mindMap.data.edges);
      setMessages(mindMap.data.messages);
    }
  }, [mindMap, setNodes, setEdges, setMessages]);

  const handleSave = useCallback(
    async (updatedMap: MindMap) => {
      try {
        if (params.id === "new") {
          const newId = await saveMindMap(generateId(), updatedMap);
          router.push(`/mindmap/${newId}`);
          toast({
            title: "Mind map created",
            description: "Your new mind map has been successfully created.",
          });
        } else {
          await saveMindMap(params.id, updatedMap);
          toast({
            title: "Mind map saved",
            description: "Your mind map has been successfully saved.",
          });
        }
      } catch (error) {
        console.error("Error saving mind map:", error);
        toast({
          title: "Error",
          description: "Failed to save the mind map. Please try again.",
          variant: "destructive",
        });
      }
    },
    [params.id, router, toast],
  );

  const handleDelete = useCallback(async () => {
    if (params.id === "new") {
      toast({
        title: "Error",
        description: "Cannot delete an unsaved mind map.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteMindMap(params.id);
      router.push("/mindmap");
      toast({
        title: "Mind map deleted",
        description: "The mind map has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting mind map:", error);
      toast({
        title: "Error",
        description: "Failed to delete the mind map. Please try again.",
        variant: "destructive",
      });
    }
  }, [params.id, router, toast]);

  const handleNameChange = useCallback((newName: string) => {
    setMindMap((prevMap) => (prevMap ? { ...prevMap, name: newName } : null));
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  const startEditing = () => {
    setTempName(mindMap!.name);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    handleNameChange(tempName);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    router.push("/mindmap");
  };

  if (!mindMap) return <Skeleton className="h-full w-full" />;

  return (
    <div className="mx-auto box-border h-full w-full p-4">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {isEditing ? (
          <>
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="bg-transparent text-2xl font-bold"
            />
            <Button variant="ghost" size="icon" onClick={confirmEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="mr-2 text-2xl font-bold">{mindMap.name}</h1>
            <Button variant="ghost" size="icon" onClick={startEditing}>
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <MindMapComponent
        mindMap={mindMap}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
