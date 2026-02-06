import { headers } from "next/headers";
import { verifyUserToken, checkAccess } from "@/lib/whop";
import { AdminDashboard } from "@/components/views/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const headerList = await headers();
    const bizId = headerList.get("x-whop-biz-id");

    if (!bizId) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
                    <p className="text-muted-foreground">Please access this page through your Whop Dashboard.</p>
                </div>
            </div>
        );
    }

    const auth = await verifyUserToken();
    if (!auth) {
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    const access = await checkAccess(bizId, auth.userId);
    if (access.access_level !== "admin") {
        return <div className="p-6 text-center text-red-600">Admin permissions required for this resource.</div>;
    }

    return <AdminDashboard companyId={bizId} userId={auth.userId} />;
}
