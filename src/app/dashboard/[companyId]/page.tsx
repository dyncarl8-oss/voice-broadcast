import { redirect } from "next/navigation";
import { verifyUserToken, isAdminOfCompany } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function DashboardCatchAll({
    params
}: {
    params: Promise<{ companyId: string }>
}) {
    console.log("[Dashboard Catch-All] Request received");
    const { companyId } = await params;
    const auth = await verifyUserToken();

    if (!auth) {
        console.warn("[Dashboard Catch-All] No auth, redirecting to root");
        redirect("/");
    }

    const isAdmin = await isAdminOfCompany(companyId, auth.userId);

    if (isAdmin) {
        console.log(`[Dashboard Catch-All] User ${auth.userId} is ADMIN, redirecting to clean /admin`);
        redirect(`/admin?bizId=${companyId}`);
    }

    console.log(`[Dashboard Catch-All] User ${auth.userId} NOT primary admin, redirecting to /member`);
    redirect(`/member?bizId=${companyId}`);
}
