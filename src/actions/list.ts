'use server'

import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createListZodSchema, createListZodSchemaType } from "@/schema/createList";
import { revalidatePath } from "next/cache";

export async function createList(data: createListZodSchemaType) {
    const user = await requireAuth();

    const result = createListZodSchema.safeParse(data)


    if (!result.success) {
        return {
            success: false,
            message: result.error.flatten().fieldErrors
        }
    }
    await prisma.list.create({
        data: {
            name: data.name,
            color: data.color,
            userId: user.id
        }
    })

    revalidatePath('/')

    return {
        success: true,
        message: '清单创建成功'
    }

}


export async function deleteList(id: number) {
    const user = await requireAuth();

    await prisma.list.delete({
        where: {
            id,
            userId: user.id
        }
    })

    revalidatePath('/')

}   