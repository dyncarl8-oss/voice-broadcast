import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";
import { Navigation } from "@/components/navigation";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ companyId: string }>;
}) {
    const { companyId } = await params;
    const head = await headers();

    try {
        const { userId } = await whopsdk.verifyUserToken(head);

        if (!userId) {
            redirect("/");
        }

        const access = await whopsdk.users.checkAccess(companyId, { id: userId });
        if (access.access_level !== "admin") {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500 font-semibold">Admin access required for this company.</p>
                </div>
            );
        }

        return (
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 bg-white border-r hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-indigo-600">Voice Broadcast</h2>
                        <p className="text-xs text-gray-400">Admin Dashboard</p>
                    </div>
                    <Navigation role="admin" companyId={companyId} />
                </aside>
                <main className="flex-1 text-black">
                    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                        <h1 className="text-lg font-medium">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                A
                            </div>
                        </div>
                    </header>
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        console.error("[DashboardLayout] Auth failure:", error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full text-black">
                    {children}
                </div>
            </div>
        );
    }
}
