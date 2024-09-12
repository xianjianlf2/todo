import CheckListFooter from "@/components/CheckListFooter";
import { ListMap } from "@/lib/const";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { List, Task } from "@prisma/client";
import TaskItem from "./TaskItem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CheckListProps {
  checkList: List;
}
function CheckList({ checkList }: CheckListProps) {
  const { name, color, tasks } = checkList;
  return (
    <Card
      className={
        ((cn("w-full sm:col-span-1"), ListMap.get(color)), "text-white")
      }
      x-chunk="dashboard-05-chunk-0"
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 && <p>目前没有任务</p>}
        {tasks.length > 0 && (
          <div>
            {tasks.map((task: Task) => {
              return <TaskItem key={task.id} task={task} />;
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col pb-2">
        <CheckListFooter checkList={checkList}></CheckListFooter>
      </CardFooter>
    </Card>
  );
}

export async function CheckLists() {
  const user = await currentUser();
  const checkLists = await prisma.list.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (checkLists.length === 0)
    return <div className="mt-4">尚未创建清单，赶紧创建一个吧！</div>;

  return (
    <>
      <div className="mt-6 flex w-full flex-col gap-4">
        {checkLists.map((checkList) => (
          <CheckList key={checkList.id} checkList={checkList} />
        ))}
      </div>
    </>
  );
}
