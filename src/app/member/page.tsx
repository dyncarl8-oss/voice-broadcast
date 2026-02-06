import { headers } from "next/headers";
import { verifyUserToken, checkAccess } from "@/lib/whop";
import { MemberExperience } from "@/components/views/member-experience";

export const dynamic = "force-dynamic";

export default async function MemberPage() {
    const headerList = await headers();
    const experienceId = headerList.get("x-whop-experience-id");

    if (!experienceId) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Experience Access Required</h1>
                    <p className="text-muted-foreground">Please access this page as a community member.</p>
                </div>
            </div>
        );
    }

    const auth = await verifyUserToken();
    if (!auth) {
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    const access = await checkAccess(experienceId, auth.userId);
    if (!access.has_access) {
        return <div className="p-6 text-center text-red-600">Access denied. You do not have permission for this experience.</div>;
    }

    return <MemberExperience experienceId={experienceId} userId={auth.userId} />;
}
