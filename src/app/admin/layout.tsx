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

    console.log("AdminLayout hit:", {
        bizId: head.get("x-whop-biz-id"),
        userId: head.get("x-whop-user-id"),
        authHeader: !!head.get("authorization")
    });

    try {
        const { userId } = await whopsdk.verifyUserToken(head);
        const bizId = head.get("x-whop-biz-id");

        if (!userId) {
            console.log("AdminLayout: No userId after verification, redirecting to /");
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
        console.error("Whop authentication error in AdminLayout:", error);
        // Avoid redirect loop if we are already at / and redirecting here
        // If we came from /, and / redirects here based on headers, but we fail here, we MUST not redirect back to / if it will just loop
        return (
            <div className="flex items-center justify-center min-h-screen p-4 flex-col text-center">
                <p className="text-red-500 font-semibold text-lg">Admin Authentication failed.</p>
                <p className="text-gray-500 text-sm mt-2">Error: {String(error)}</p>
                <a href="/" className="mt-4 text-indigo-600 underline">Try returning home</a>
            </div>
        );
    }
}
