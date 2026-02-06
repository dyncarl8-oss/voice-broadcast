import prisma from "@/lib/prisma";
import { MessageSquare, Mic2, Clock } from "lucide-react";

export default async function MemberFeed() {
    const posts = await prisma.post.findMany({
        include: {
            summaries: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
            </div>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No updates from the creator yet.</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl border shadow-sm overflow-hidden text-black">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">{post.title || "Untitled Post"}</h3>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                    {post.content}
                                </div>

                                {post.summaries.length > 0 && (
                                    <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 space-y-3">
                                        <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm">
                                            <Mic2 className="w-4 h-4" />
                                            Listen to Voice Summary
                                        </div>
                                        <audio
                                            controls
                                            className="w-full h-8"
                                            src={post.summaries[0].audioUrl}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
