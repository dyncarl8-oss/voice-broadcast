import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyUserToken, isAdminOfCompany, isMemberOfResource } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await verifyUserToken();
  const headerList = await headers();
  const bizId = headerList.get("x-whop-biz-id");
  const experienceId = headerList.get("x-whop-experience-id");

  // 1. No Auth? Show generic landing
  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Voice Broadcast for Whop</h1>
          <p className="text-muted-foreground">Please access this app through your Whop Dashboard or community.</p>
        </div>
      </div>
    );
  }

  // 2. Are they an Admin of the business?
  if (bizId) {
    const isAdmin = await isAdminOfCompany(bizId, auth.userId);
    if (isAdmin) {
      redirect("/admin");
    }
  }

  // 3. Are they a Member of this business or experience?
  // Try Experience first if present
  if (experienceId) {
    const isMember = await isMemberOfResource(experienceId, auth.userId);
    if (isMember) {
      redirect("/member");
    }
  }

  // Use bizId as fallback if not admin
  if (bizId) {
    const isMember = await isMemberOfResource(bizId, auth.userId);
    if (isMember) {
      redirect("/member");
    }
  }

  // 4. Default: Access Restricted
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Access Restricted</h2>
      <p className="text-muted-foreground">You don't have permission to view this app in this context.</p>
    </div>
  );
}
