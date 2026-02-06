"use server";

import dbConnect from "@/lib/db/mongodb";
import { Post, AudioSummary, Broadcast } from "@/lib/db/models";
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
        await dbConnect();

        // 1. Get post content
        const post = await Post.findById(params.postId);
        if (!post) throw new Error("Post not found");

        // 2. Generate Summary
        const script = await summarizePost(post.content, params.length);

        // 3. Generate Audio
        const audioResult = await generateAudio(script, params.voiceId);
        if (!audioResult) throw new Error("Audio generation failed");

        // 4. Save Audio Summary
        const summary = await AudioSummary.create({
            postId: params.postId,
            audioUrl: audioResult.audioUrl,
            script,
            duration: audioResult.duration,
        });

        // 5. Send DMs via Whop
        // This is a placeholder for the actual Whop API DM sending logic
        console.log(`Sending DMs to ${params.audience} audience...`);

        // 6. Record Broadcast
        await Broadcast.create({
            postId: params.postId,
            audioSummaryId: summary._id,
            companyId: params.companyId,
            targetAudience: params.audience,
            productIds: params.productIds || [],
        });

        return { success: true };
    } catch (error) {
        console.error("Broadcast failed:", error);
        return { error: "Failed to send broadcast" };
    }
}
