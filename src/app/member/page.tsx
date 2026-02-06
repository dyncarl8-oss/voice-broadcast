import { headers } from "next/headers";
import { verifyUserToken, isMemberOfResource } from "@/lib/whop";
import { MemberExperience } from "@/components/views/member-experience";

export const dynamic = "force-dynamic";

export default async function MemberPage() {
    const headerList = await headers();
    const experienceId = headerList.get("x-whop-experience-id");
    const bizId = headerList.get("x-whop-biz-id");

    const auth = await verifyUserToken();
    if (!auth) {
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    // Check Experience first, then Biz
    const resourceId = experienceId || bizId;

    if (!resourceId) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Context Required</h1>
                    <p className="text-muted-foreground">Please access this page from your Whop community or dashboard.</p>
                </div>
            </div>
        );
    }

    const isMember = await isMemberOfResource(resourceId, auth.userId);
    if (!isMember) {
        return <div className="p-6 text-center text-red-600">Access denied. You do not have permission for this resource.</div>;
    }

    return <MemberExperience experienceId={resourceId} userId={auth.userId} />;
}
