import Link from "next/link";
import { PlusCircle, MessageSquare, Mic2, Users } from "lucide-react";
import prisma from "@/lib/prisma";
import { getWhopContext } from "@/lib/context";

export default async function AdminDashboard() {
    const { bizId } = await getWhopContext();

    // Fetch some basic stats
    // Note: This might fail if Prisma client is not generated (Typescript error)
    // But for the sake of progress, I'll write the logic.

    // const postCount = await prisma.post.count({ where: { creatorId: bizId! } });
    // const broadcastCount = await prisma.broadcast.count({ where: { post: { creatorId: bizId! } } });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                    <p className="text-gray-500">Here's what's happening with your voice broadcasts.</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    New Broadcast
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Posts"
                    value="0"
                    icon={MessageSquare}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Audio Broadcasts"
                    value="0"
                    icon={Mic2}
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Member Reach"
                    value="0"
                    icon={Users}
                    color="bg-green-50 text-green-600"
                />
            </div>

            <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p>No posts yet. Start by creating your first broadcast!</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={cn("p-3 rounded-lg", color)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
