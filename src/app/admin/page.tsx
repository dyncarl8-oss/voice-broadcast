import { headers } from "next/headers";
import { verifyUserToken, isAdminOfCompany } from "@/lib/whop";
import { AdminDashboard } from "@/components/views/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ bizId?: string }>;
}) {
    console.log("[Admin Page] Request received");
    const headerList = await headers();
    const { bizId: queryBizId } = await searchParams;
    const headerBizId = headerList.get("x-whop-biz-id");
    const bizId = headerBizId || queryBizId;

    console.log(`[Admin Page] Context identification - Header: ${headerBizId}, Query: ${queryBizId}`);

    const auth = await verifyUserToken();
    if (!auth) {
        console.error("[Admin Page] Authentication failed");
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    if (!bizId) {
        console.error("[Admin Page] MISSING bizId context");
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Admin Context Required</h1>
                    <p className="text-muted-foreground">Could not identify the business context. Please load from Whop Dashboard.</p>
                </div>
            </div>
        );
    }

    const isAdmin = await isAdminOfCompany(bizId, auth.userId);
    if (!isAdmin) {
        console.warn(`[Admin Page] Access denied for user ${auth.userId} in business ${bizId}`);
        return <div className="p-6 text-center text-red-600">Admin permissions required for this resource.</div>;
    }

    console.log("[Admin Page] Rendering Dashboard");
    return <AdminDashboard companyId={bizId} userId={auth.userId} />;
}
