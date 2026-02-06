import { headers } from "next/headers";
import { verifyUserToken, isAdminOfCompany } from "@/lib/whop";
import { AdminDashboard } from "@/components/views/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const headerList = await headers();
    const bizId = headerList.get("x-whop-biz-id");

    const auth = await verifyUserToken();
    if (!auth) {
        return <div className="p-6 text-center">Invalid session. Please refresh Whop.</div>;
    }

    if (!bizId) {
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
        return <div className="p-6 text-center text-red-600">Admin permissions required for this resource.</div>;
    }

    return <AdminDashboard companyId={bizId} userId={auth.userId} />;
}
