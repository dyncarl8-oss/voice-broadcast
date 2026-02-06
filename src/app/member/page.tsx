import { headers } from "next/headers";
import { verifyUserToken, isMemberOfResource } from "@/lib/whop";
import { MemberExperience } from "@/components/views/member-experience";

export const dynamic = "force-dynamic";

export default async function MemberPage({
    searchParams,
}: {
    searchParams: Promise<{ experienceId?: string, bizId?: string }>;
}) {
    console.log("[Member Page] Request received");
    const headerList = await headers();
    const { experienceId: queryExpId, bizId: queryBizId } = await searchParams;

    const headerExpId = headerList.get("x-whop-experience-id");
    const headerBizId = headerList.get("x-whop-biz-id");

    const experienceId = headerExpId || queryExpId;
    const bizId = headerBizId || queryBizId;

    console.log(`[Member Page] Context identification - ExpHeader: ${headerExpId}, ExpQuery: ${queryExpId}, BizHeader: ${headerBizId}, BizQuery: ${queryBizId}`);

    const auth = await verifyUserToken();
    if (!auth) {
        console.error("[Member Page] Authentication failed");
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    const resourceId = experienceId || bizId;

    if (!resourceId) {
        console.error("[Member Page] MISSING context/resourceId");
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
        console.warn(`[Member Page] Access denied for user ${auth.userId} on resource ${resourceId}`);
        return <div className="p-6 text-center text-red-600">Access denied. You do not have permission for this resource.</div>;
    }

    console.log("[Member Page] Rendering Experience");
    return <MemberExperience experienceId={resourceId} userId={auth.userId} />;
}
