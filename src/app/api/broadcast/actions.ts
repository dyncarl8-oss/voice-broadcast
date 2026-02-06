"use server";

import { whop } from "@/lib/whop";
import { db } from "@/db";
import { broadcasts, audioSummaries } from "@/db/schema";
import { summarizePost } from "@/lib/ai/summarize";
import { generateAudio } from "@/lib/audio/fish-audio";

export async function sendVoiceBroadcast(params: {
    postId: string;
    companyId: string;
    length: "short" | "standard";
    audience: "all" | "product_scoped";
    productIds?: string[];
    voiceId: string;
}) {
    try {
        // 1. Get post content
        const post = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.id, params.postId),
        });

        if (!post) throw new Error("Post not found");

        // 2. Generate Summary
        const script = await summarizePost(post.content, params.length);

        // 3. Generate Audio
        const audioResult = await generateAudio(script, params.voiceId);
        if (!audioResult) throw new Error("Audio generation failed");

        // 4. Save Audio Summary
        const [summary] = await db.insert(audioSummaries).values({
            postId: params.postId,
            audioUrl: audioResult.audioUrl,
            script,
            duration: audioResult.duration,
            lengthType: params.length,
        }).returning();

        // 5. Send DMs via Whop
        // This is a placeholder for the actual Whop API DM sending logic
        // Using the whop SDK or fetch
        console.log(`Sending DMs to ${params.audience} audience...`);

        // 6. Record Broadcast
        await db.insert(broadcasts).values({
            postId: params.postId,
            audioSummaryId: summary.id,
            audienceType: params.audience,
            productIds: params.productIds || [],
            totalRecipients: 100, // Mock number
        });

        return { success: true };
    } catch (error) {
        console.error("Broadcast failed:", error);
        return { error: "Failed to send broadcast" };
    }
}
