import { redirect } from "next/navigation";
import { verifyUserToken, isMemberOfResource } from "@/lib/whop";

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

    const isMember = await isMemberOfResource(experienceId, auth.userId);

    if (isMember) {
        redirect("/member");
    }

    redirect("/");
}
