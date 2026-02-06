"use client";

import { useTransition } from "react";
import { createPost } from "./actions";
import { Loader2, Send } from "lucide-react";

export function CreatePostForm() {
    const [isPending, startTransition] = useTransition();

    async function action(formData: FormData) {
        startTransition(async () => {
            try {
                await createPost(formData);
            } catch (error) {
                alert(error instanceof Error ? error.message : "Something went wrong");
            }
        });
    }

    return (
        <form action={action} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Post Title (Optional)
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter a title for your update..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={10}
                    placeholder="Write your update here... Markdown is supported."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    Create Post
                </button>
            </div>
        </form>
    );
}
