import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";
import { Navigation } from "@/components/navigation";

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const head = await headers();

    console.log("MemberLayout hit:", {
        experienceId: head.get("x-whop-experience-id"),
        userId: head.get("x-whop-user-id"),
        authHeader: !!head.get("authorization")
    });

    try {
        const { userId } = await whopsdk.verifyUserToken(head);
        const experienceId = head.get("x-whop-experience-id");

        if (!userId) {
            console.log("MemberLayout: No userId after verification, redirecting to /");
            redirect("/");
        }

        // Ensure user has access to the experience
        if (experienceId) {
            const access = await whopsdk.users.checkAccess(experienceId, { id: userId });
            if (!access.has_access) {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <p className="text-red-500 font-semibold">Access denied.</p>
                    </div>
                );
            }
        }

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-bold text-indigo-600">Voice Broadcast</h1>
                    <div className="flex items-center gap-4">
                        <Navigation role="member" />
                    </div>
                </header>
                <main className="max-w-4xl mx-auto p-6">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        console.error("Whop authentication error in MemberLayout:", error);
        return (
            <div className="flex items-center justify-center min-h-screen p-4 flex-col text-center">
                <p className="text-red-500 font-semibold text-lg">Member Authentication failed.</p>
                <p className="text-gray-500 text-sm mt-2">Error: {String(error)}</p>
                <a href="/" className="mt-4 text-indigo-600 underline">Try returning home</a>
            </div>
        );
    }
}
