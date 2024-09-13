import MindMap from "@/components/MindMap";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function MindMapFallback() {
  return <Skeleton className="h-[180px] w-full" />;
}

export default function MindMapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">MindMap</h1>
      <Suspense fallback={<MindMapFallback />}>
        <MindMap />
      </Suspense>
    </div>
  );
}
