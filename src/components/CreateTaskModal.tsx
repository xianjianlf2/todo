"use client";

import { createTask } from "@/actions/task";
import { toast } from "@/hooks/use-toast";
import { ListMap } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  createTaskZodSchema,
  createTaskZodSchemaType,
} from "@/schema/createTask";
import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@prisma/client";
import dayjs from "dayjs";
import { CalendarDays, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  checkList: List;
}

export default function CreateTaskModal({ checkList }: Props) {
  const { id, name, color } = checkList;

  const [open, setOpen] = useState(false);

  const form = useForm<createTaskZodSchemaType>({
    resolver: zodResolver(createTaskZodSchema),
    defaultValues: {
      todoId: id,
      content: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    form.reset();
    setOpen(open);
  };

  const onSubmit = async (data: createTaskZodSchemaType) => {
    try {
      await createTask(data);
      toast({
        title: "操作成功",
        description: "任务创建成功",
      });
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "操作失败",
        description: "任务创建失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <CirclePlus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加任务</DialogTitle>
          <DialogDescription>任务添加到【{name}】清单</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务内容：</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务截止时间：</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {field.value &&
                              dayjs(field.value).format("YYYY-MM-DD")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          ></Calendar>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={cn(
              "w-full text-white dark:text-white",
              ListMap.get(color),
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
