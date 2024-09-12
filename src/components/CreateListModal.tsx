"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ListMap } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  createListZodSchema,
  type createListZodSchemaType,
} from "@/schema/createList";
import { useState } from "react";

import { createList } from "@/actions/list";
import { toast } from "@/hooks/use-toast";

export default function CreateListModal() {
  const form = useForm({
    resolver: zodResolver(createListZodSchema),
    defaultValues: {
      name: "",
      color: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: createListZodSchemaType) => {
    try {
      await createList(data);
      onOpenChange(false);
      toast({
        title: "恭喜你",
        description: "清单创建成功",
      });
    } catch (error) {
      console.log("error", error);
      toast({
        title: "哎呀",
        description: "清单创建失败",
        variant: "destructive",
      });
    }
  };

  const onOpenChange = (open: boolean) => {
    form.reset();
    setOpen(open);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>添加清单</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>添加清单</SheetTitle>
          <SheetDescription>
            清单是任务的集合，比如“工作”、“生活”、“副业”
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设置清单的名称：</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：工作" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择清单的背景色：</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn("w-[180px]", ListMap.get(field.value), {
                          "text-white": !!field.value,
                        })}
                      >
                        <SelectValue placeholder="颜色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[...ListMap.entries()].map(
                            ([color, [className, name]]) => {
                              return (
                                <SelectItem
                                  key={color}
                                  value={color}
                                  className={cn(
                                    "my-1 w-full rounded-md text-white ring-black focus:font-bold focus:text-white focus:ring-2 dark:ring-white",
                                    className,
                                    `focus:${className}`,
                                  )}
                                >
                                  {name}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            创建
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
