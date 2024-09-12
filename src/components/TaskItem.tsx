"use client";

import { cn } from "@/lib/utils";
import { Task } from "@prisma/client";
import dayjs from "dayjs";
import { Checkbox } from "./ui/checkbox";

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={task.id.toString()}
        className="h-5 w-5 bg-white"
        checked={task.done}
        onCheckedChange={async (value) => {
          console.log(value);
        }}
      ></Checkbox>
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "flex flex-row items-center gap-2",
          task.done && "line-through",
        )}
      ></label>
      {task.content}
      {task.expiredAt && (
        <p
          className={cn("text-xs text-white", {
            "text-red-800": Date.now() - task.expiredAt.getTime() > 0,
          })}
        >
          {dayjs(task.expiredAt).format("YYYY-MM-DD")}
        </p>
      )}
    </div>
  );
}

export default TaskItem;
