"use server";

import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    createTaskZodSchema,
    createTaskZodSchemaType,
} from "@/schema/createTask";
import { revalidatePath } from "next/cache";

export async function createTask(data: createTaskZodSchemaType) {
    const user = await requireAuth();

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
