import Link from "next/link";
import { PlusCircle, MessageSquare, Mic2, Users, AlertTriangle } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const head = await headers();

    console.log(`[DashboardPage] Loading ${companyId}`, {
        auth: !!head.get("authorization")
    });

    let userId: string | undefined;

    try {
        const result = await whopsdk.verifyUserToken(head);
        userId = result.userId;
    } catch (error) {
        console.error(`[DashboardPage] Auth error for ${companyId}:`, error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Admin Auth Failed</h2>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left text-xs font-mono w-full max-w-lg overflow-auto">
                    <pre>{JSON.stringify({
                        route: `/dashboard/${companyId}`,
                        hasAuth: !!head.get("authorization"),
                        error: String(error)
                    }, null, 2)}</pre>
                </div>
            </div>
        );
    }

    if (!userId) {
        redirect("/");
    }

    const access = await whopsdk.users.checkAccess(companyId, { id: userId });

    if (access.access_level !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600 mt-2">You must be an administrator of this company to view this page.</p>
                <Link href="/" className="mt-4 text-indigo-600 underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                    <p className="text-gray-500">Here's what's happening with your voice broadcasts.</p>
                </div>
                <Link
                    href={`/dashboard/${companyId}/posts/new`}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    New Broadcast
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Posts</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Audio Broadcasts</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                        <Mic2 className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Member Reach</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
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
