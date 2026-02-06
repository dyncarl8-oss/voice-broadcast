import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";
import { Navigation } from "@/components/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const head = await headers();

    try {
        const { userId } = await whopsdk.verifyUserToken(head);
        const bizId = head.get("x-whop-biz-id");

        if (!userId) {
            redirect("/");
        }

        // If we have a bizId, ensure the user is an admin of that company
        if (bizId) {
            const access = await whopsdk.users.checkAccess(bizId, { id: userId });
            if (access.access_level !== "admin") {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <p className="text-red-500 font-semibold">Admin access required.</p>
                    </div>
                );
            }
        }

        return (
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 bg-white border-r hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-indigo-600">Voice Broadcast</h2>
                        <p className="text-xs text-gray-400">Admin Dashboard</p>
                    </div>
                    <Navigation role="admin" />
                </aside>
                <main className="flex-1">
                    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                        <h1 className="text-lg font-medium">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            {/* Profile/Settings placeholder */}
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                        </div>
                    </header>
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        redirect("/");
    }
}
