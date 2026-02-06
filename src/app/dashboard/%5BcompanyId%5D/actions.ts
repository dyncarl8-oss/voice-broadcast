"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createPost(formData: {
    title: string;
    content: string;
    creatorId: string;
    companyId: string;
}) {
    try {
        await db.insert(posts).values({
            title: formData.title,
            content: formData.content,
            creatorId: formData.creatorId,
            companyId: formData.companyId,
        });
        revalidatePath(`/dashboard/${formData.companyId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { error: "Failed to create post" };
    }
}
