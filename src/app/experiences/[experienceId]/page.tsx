import prisma from "@/lib/prisma";
import { MessageSquare, Mic2, Clock, AlertTriangle } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function ExperiencePage({
    params,
}: {
    params: Promise<{ experienceId: string }>;
}) {
    const { experienceId } = await params;
    const head = await headers();

    // Debug logging for the specific page hit
    console.log(`[ExperiencePage] Loading ${experienceId}`, {
        auth: !!head.get("authorization"),
        allHeaders: Array.from(head.keys())
    });

    let userId: string | undefined;

    try {
        const result = await whopsdk.verifyUserToken(head);
        userId = result.userId;
    } catch (error) {
        console.error(`[ExperiencePage] Auth error for ${experienceId}:`, error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Authentication Failed</h2>
                <p className="text-gray-600 mt-2 max-w-md">
                    We couldn't verify your Whop session. This happens if the app is opened outside of the Whop iframe or if the auth token is missing.
                </p>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left text-xs font-mono w-full max-w-lg overflow-auto">
                    <p className="font-bold text-gray-400 mb-2 uppercase">Diagnostic Info:</p>
                    <pre>{JSON.stringify({
                        route: `/experiences/${experienceId}`,
                        hasAuth: !!head.get("authorization"),
                        error: String(error)
                    }, null, 2)}</pre>
                </div>
                <p className="mt-6 text-sm text-gray-400">Please try refreshing or re-opening the app from Whop.</p>
            </div>
        );
    }

    if (!userId) {
        redirect("/");
    }

    const access = await whopsdk.users.checkAccess(experienceId, { id: userId });

    if (!access.has_access) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600 mt-2">You do not have access to this experience.</p>
            </div>
        );
    }

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
                    posts.map((post: any) => (
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
