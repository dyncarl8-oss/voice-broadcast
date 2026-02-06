import { redirect } from "next/navigation";
import { verifyUserToken, checkAccess } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function ExperienceCatchAll({
    params
}: {
    params: Promise<{ experienceId: string }>
}) {
    const { experienceId } = await params;
    const auth = await verifyUserToken();

    if (!auth) {
        redirect("/");
    }

    const { has_access } = await checkAccess(experienceId, auth.userId);

    if (has_access) {
        redirect("/member");
    }

    redirect("/");
}
