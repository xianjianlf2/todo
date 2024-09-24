import { currentUser } from "@clerk/nextjs/server";

export async function requireAuth() {
    const user = await currentUser();
    if (!user) {
        throw new Error('用户未登录，请先登录');
    }
    return user;
}