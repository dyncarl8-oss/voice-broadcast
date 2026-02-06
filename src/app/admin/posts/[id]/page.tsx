import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getWhopContext } from "@/lib/context";
import { VoiceSummaryFlow } from "./VoiceSummaryFlow";

export default async function PostDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;
    const { bizId } = await getWhopContext();

    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post || post.creatorId !== bizId) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border shadow-sm space-y-4">
                        {post.title && (
                            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                        )}
                        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <VoiceSummaryFlow postId={post.id} />

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-semibold mb-4">Broadcast Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase">Draft</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Created</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
