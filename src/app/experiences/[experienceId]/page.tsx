import { redirect } from "next/navigation";
import { verifyUserToken, isMemberOfResource } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function ExperienceCatchAll({
    params
}: {
    params: Promise<{ experienceId: string }>
}) {
    console.log("[Experience Catch-All] Request received");
    const { experienceId } = await params;
    const auth = await verifyUserToken();

    if (!auth) {
        console.warn("[Experience Catch-All] No auth, redirecting to root");
        redirect("/");
    }

    const isMember = await isMemberOfResource(experienceId, auth.userId);

    if (isMember) {
        console.log(`[Experience Catch-All] User ${auth.userId} HAS access, redirecting to clean /member`);
        redirect(`/member?experienceId=${experienceId}`);
    }

    console.warn(`[Experience Catch-All] User ${auth.userId} NO access, redirecting to root`);
    redirect("/");
}
