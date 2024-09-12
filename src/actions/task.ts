"use server";

import prisma from "@/lib/prisma";
import {
    createTaskZodSchema,
    createTaskZodSchemaType,
} from "@/schema/createTask";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTask(data: createTaskZodSchemaType) {
    const user = await currentUser();

    if (!user) {
        throw new Error("用户未登录，请先登录");
    }

    const result = createTaskZodSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            error: result.error.flatten().fieldErrors,
        };
    }

    const { content, expiresAt, todoId } = data


    await prisma.task.create({
        data: {
            userId: user.id,
            content,
            expiresAt,
            list: {
                connect: {
                    id: todoId
                }
            }
        }
    })


    revalidatePath('/')
}
