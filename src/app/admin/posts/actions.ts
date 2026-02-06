"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getWhopContext } from "@/lib/context";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
    const { userId, bizId } = await getWhopContext();

    if (!bizId) {
        throw new Error("Missing company context");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!content) {
        throw new Error("Content is required");
    }

    const post = await prisma.post.create({
        data: {
            creatorId: bizId,
            title,
            content,
        },
    });

    revalidatePath("/admin");
    revalidatePath("/member");

    redirect(`/admin/posts/${post.id}`);
}
