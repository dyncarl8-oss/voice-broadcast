import { headers } from "next/headers";
import { verifyUserToken, checkAccess } from "@/lib/whop";
import { AdminDashboard } from "@/components/views/admin-dashboard";
import { MemberExperience } from "@/components/views/member-experience";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headerList = await headers();
  const token = headerList.get("x-whop-user-token");

  // If no token, we are likely not in the Whop iframe or not authenticated
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Voice Broadcast for Whop</h1>
          <p className="text-muted-foreground">Please access this app through your Whop Dashboard or as a community member.</p>
        </div>
      </div>
    );
  }

  const auth = await verifyUserToken(token);
  if (!auth) {
    return <div className="p-6 text-center">Invalid or expired session. Please refresh Whop.</div>;
  }

  const { userId } = auth;
  const bizId = headerList.get("x-whop-biz-id");
  const experienceId = headerList.get("x-whop-experience-id");

  // Determine role and view
  // 1. If we have bizId, check if they are an admin of that company
  if (bizId) {
    const access = await checkAccess(bizId, userId);
    if (access.access_level === "admin") {
      return <AdminDashboard companyId={bizId} userId={userId} />;
    }
  }

  // 2. If we have experienceId, check if they have access to it
  if (experienceId) {
    const access = await checkAccess(experienceId, userId);
    if (access.has_access) {
      return <MemberExperience experienceId={experienceId} userId={userId} />;
    }
  }

  // 3. Fallback: If no IDs in headers, maybe they are an admin but the header missed? 
  // Or check their companies to see if they own any
  // For now, if we have a bizId but they aren't admin, or we have experienceId but no access
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Access Restricted</h2>
      <p className="text-muted-foreground">You don't have permission to view this page.</p>
    </div>
  );
}
