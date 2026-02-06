import { redirect } from "next/navigation";
import { verifyUserToken, checkAccess } from "@/lib/whop";

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

    const { has_access, access_level } = await checkAccess(companyId, auth.userId);

    if (has_access && access_level === "admin") {
        redirect("/admin");
    }

    // If not admin, maybe they should go to member view of this company?
    redirect("/member");
}
