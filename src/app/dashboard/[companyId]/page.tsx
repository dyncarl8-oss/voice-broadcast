import { redirect } from "next/navigation";
import { verifyUserToken, isAdminOfCompany } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function DashboardCatchAll({
    params
}: {
    params: Promise<{ companyId: string }>
}) {
    const { companyId } = await params;
    const auth = await verifyUserToken();

    if (!auth) {
        redirect("/");
    }

    const isAdmin = await isAdminOfCompany(companyId, auth.userId);

    if (isAdmin) {
        redirect("/admin");
    }

    // If not admin, they must be a member or unauthorized
    redirect("/member");
}
