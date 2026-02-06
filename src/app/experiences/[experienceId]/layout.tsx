import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";
import { Navigation } from "@/components/navigation";

export default async function ExperienceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ experienceId: string }>;
}) {
    const { experienceId } = await params;
    const head = await headers();

    try {
        const { userId } = await whopsdk.verifyUserToken(head);

        if (!userId) {
            redirect("/");
        }

        const access = await whopsdk.users.checkAccess(experienceId, { id: userId });
        if (!access.has_access) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500 font-semibold">Access denied for this experience.</p>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-lg font-bold text-indigo-600">Voice Broadcast</h1>
                    <div className="flex items-center gap-4">
                        <Navigation role="member" experienceId={experienceId} />
                    </div>
                </header>
                <main className="max-w-4xl mx-auto p-6 text-black">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        // Log the error but let the page decide how to render the error UI
        console.error("[ExperienceLayout] Auth failure:", error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full text-black">
                    {children}
                </div>
            </div>
        );
    }
}
