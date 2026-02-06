import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function RootPage() {
  const head = await headers();

  // Whop passes bizId for Dashboard View and experienceId for Experience View
  // These are often in the query params, but during SSR we can check headers or just wait for the view-specific routes

  // In a real Whop app, the entry point might be different depending on how it's configured in the developer portal.
  // Usually, Dashboard View points to /admin and Experience View points to /

  console.log("RootPage hit:", {
    bizId: head.get("x-whop-biz-id"),
    experienceId: head.get("x-whop-experience-id"),
    userId: head.get("x-whop-user-id"),
    authHeader: !!head.get("authorization")
  });

  try {
    const { userId } = await whopsdk.verifyUserToken(head);
    console.log("Verified User ID:", userId);

    if (!userId) {
      console.log("No User ID found after verification");
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-gray-600">Please open this app inside Whop.</p>
        </div>
      );
    }

    const bizId = head.get("x-whop-biz-id");
    const experienceId = head.get("x-whop-experience-id");

    if (bizId) {
      console.log("Redirecting to /admin based on bizId");
      redirect("/admin");
    }

    if (experienceId) {
      console.log("Redirecting to /member based on experienceId");
      redirect("/member");
    }

    // Fallback if we can't detect automatically
    console.log("No specific context found, checking authorized companies...");
    const { data: companies } = await whopsdk.authorizedUsers.list({ user_id: userId });

    if (companies && companies.length > 0) {
      console.log("User has admin companies, redirecting to /admin");
      redirect("/admin");
    } else {
      console.log("User has no admin companies, redirecting to /member");
      redirect("/member");
    }

  } catch (error) {
    console.error("Auth error in RootPage:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Session Expired or Invalid</h1>
        <p className="text-gray-600 mt-2">Please refresh the page or re-open the app in Whop.</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs text-left inline-block max-w-full overflow-auto">
          {String(error)}
        </pre>
      </div>
    );
  }
}
