import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyUserToken, checkAccess } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await verifyUserToken();
  const headerList = await headers();
  const bizId = headerList.get("x-whop-biz-id");
  const experienceId = headerList.get("x-whop-experience-id");

  // If no token or verification fails, show fallback
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

  // 1. If we have bizId, check if they are an admin
  if (bizId) {
    const access = await checkAccess(bizId, auth.userId);
    if (access.access_level === "admin") {
      redirect("/admin");
    }
  }

  // 2. If we have experienceId, check if they have access
  if (experienceId) {
    const access = await checkAccess(experienceId, auth.userId);
    if (access.has_access) {
      redirect("/member");
    }
  }

  // 3. Fallback: If they reached here but we have context, try to find a sensible place
  if (bizId) {
    redirect("/member");
  }

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Access Restricted</h2>
      <p className="text-muted-foreground">You don't have permission to view this page.</p>
    </div>
  );
}
