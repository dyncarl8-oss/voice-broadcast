import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const head = await headers();

    try {
        const { userId } = await whopsdk.verifyUserToken(head);
        const experienceId = head.get("x-whop-experience-id");

        if (!userId) {
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
                <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm">
                    <h1 className="text-lg font-bold text-indigo-600">Voice Broadcast</h1>
                </header>
                <main className="max-w-4xl mx-auto p-6">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        redirect("/");
    }
}
