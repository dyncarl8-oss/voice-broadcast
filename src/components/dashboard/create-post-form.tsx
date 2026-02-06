"use client";

import { useState } from "react";
import { createPost } from "./actions";
import { Loader2, Send } from "lucide-react";

export function CreatePostForm({
    companyId,
    creatorId
}: {
    companyId: string,
    creatorId: string
}) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setLoading(true);
        const result = await createPost({
            title,
            content,
            creatorId,
            companyId,
        });

        if (result.success) {
            setTitle("");
            setContent("");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Title (Optional)</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New Update"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening?"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
            </div>
            <button
                type="submit"
                disabled={loading || !content}
                className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Broadcast Post
            </button>
        </form>
    );
}
