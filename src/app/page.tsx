import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyUserToken, isAdminOfCompany, isMemberOfResource } from "@/lib/whop";

export const dynamic = "force-dynamic";

export default async function Home() {
  console.log("[Root Path] Request received");
  const headerList = await headers();

  // Log all whop-related headers
  const headersLog = {
    token: headerList.get("x-whop-user-token") ? "PRESENT" : "MISSING",
    bizId: headerList.get("x-whop-biz-id"),
    experienceId: headerList.get("x-whop-experience-id"),
  };
  console.log("[Root Path] Headers:", JSON.stringify(headersLog));

  const auth = await verifyUserToken();
  const bizId = headerList.get("x-whop-biz-id");
  const experienceId = headerList.get("x-whop-experience-id");

  if (!auth) {
    console.warn("[Root Path] No authentication found, showing landing");
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Voice Broadcast for Whop</h1>
          <p className="text-muted-foreground">Please access this app through your Whop Dashboard or community.</p>
        </div>
      </div>
    );
  }

  // 1. Are they an Admin of the business?
  if (bizId) {
    const isAdmin = await isAdminOfCompany(bizId, auth.userId);
    if (isAdmin) {
      console.log("[Root Path] Redirecting ADMIN to /admin");
      redirect(`/admin?bizId=${bizId}`);
    }
  }

  // 2. Are they a Member of this business or experience?
  if (experienceId) {
    const isMember = await isMemberOfResource(experienceId, auth.userId);
    if (isMember) {
      console.log("[Root Path] Redirecting MEMBER to /member (Experience Context)");
      redirect(`/member?experienceId=${experienceId}`);
    }
  }

  if (bizId) {
    const isMember = await isMemberOfResource(bizId, auth.userId);
    if (isMember) {
      console.log("[Root Path] Redirecting MEMBER to /member (Business Context)");
      redirect(`/member?bizId=${bizId}`);
    }
  }

  console.warn("[Root Path] Access restricted for user:", auth.userId);
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Access Restricted</h2>
      <p className="text-muted-foreground">You don't have permission to view this app in this context.</p>
    </div>
  );
}
