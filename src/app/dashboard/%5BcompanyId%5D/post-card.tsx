"use client";

import { Mic, Share2 } from "lucide-react";
import { useState } from "react";
import { VoiceSummaryModal } from "./voice-summary-modal";

export function PostCard({ post }: { post: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{post.title || "Untitled Post"}</h3>
                    <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-muted-foreground line-clamp-3 mb-4">{post.content}</p>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Mic className="w-4 h-4" />
                        Send Voice Summary
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        <Share2 className="w-4 h-4" />
                        View Full Post
                    </button>
                </div>
            </div>
            <VoiceSummaryModal
                post={post}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
