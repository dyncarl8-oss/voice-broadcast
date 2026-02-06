"use server";

import prisma from "@/lib/prisma";
import { summarizePost } from "@/lib/ai";
import { generateAudio } from "@/lib/fish-audio";
import { getWhopContext } from "@/lib/context";
import { revalidatePath } from "next/cache";

export async function generateSummaryAction(postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Post not found");

    const script = await summarizePost(post.content);
    return { script };
}

export async function confirmAndSendBroadcast(
    postId: string,
    script: string,
    voiceId: string
) {
    const { bizId } = await getWhopContext();

    // 1. Generate Audio
    const audioBuffer = await generateAudio(script, voiceId);

    // 2. Upload to storage (Placeholder: in a real app, you'd upload to S3/R2)
    // For MVP, we'll assume we have a URL
    const audioUrl = `https://example.com/audio/${postId}.mp3`;

    // 3. Save to DB
    await prisma.audioSummary.create({
        data: {
            postId,
            audioUrl,
            script,
            duration: 30, // Example
        },
    });

    // 4. Send DMs (Logic in whop-api.ts)

    // 5. Track Broadcast
    await prisma.broadcast.create({
        data: {
            postId,
            audienceType: "ALL_COMPANY",
            totalRecipients: 10, // Example
        },
    });

    revalidatePath(`/admin/posts/${postId}`);
    revalidatePath("/member");

    return { success: true };
}
