import { useEffect, useState } from "react";
import type { DroppableProps, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable {...props}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => children(provided, snapshot)}
    </Droppable>
  );
};
