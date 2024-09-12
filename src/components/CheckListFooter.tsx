"use client";

import { deleteList } from "@/actions/list";
import { toast } from "@/hooks/use-toast";
import { List } from "@prisma/client";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
interface Props {
  checkList: List;
}

export default function CheckListFooter({ checkList }: Props) {
  const { createdAt, id } = checkList;
  const deleteCheckList = async () => {
    try {
      await deleteList(id);
      toast({
        title: "操作成功",
        description: "清单已删除",
      });
    } catch (e) {
      toast({
        title: "操作失败",
        description: "清单删除失败",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Separator />
      <footer className="flex h-[60px] w-full items-center justify-between text-sm text-white">
        <p>创建于{createdAt.toLocaleDateString("zh-CN")}</p>
        <div>
          <CreateTaskModal checkList={checkList} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                <AlertDialogDescription>该操作无法撤回</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCheckList}>
                  确定
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </>
  );
}
