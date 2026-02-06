import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function RootPage() {
  const head = await headers();

  // Whop passes bizId for Dashboard View and experienceId for Experience View
  // These are often in the query params, but during SSR we can check headers or just wait for the view-specific routes

  // In a real Whop app, the entry point might be different depending on how it's configured in the developer portal.
  // Usually, Dashboard View points to /admin and Experience View points to /

  // Let's try to verify the token first
  try {
    const { userId } = await whopsdk.verifyUserToken(head);

    if (!userId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-gray-600">Please open this app inside Whop.</p>
        </div>
      );
    }

    // We can try to detect the context by looking at the search params if they were passed,
    // but in Next.js App Router root page, we don't have them in 'headers' directly unless we use middleware or pass them.

    // However, we can use the 'whop' headers if they are available
    const bizId = head.get("x-whop-biz-id");
    const experienceId = head.get("x-whop-experience-id");

    if (bizId) {
      redirect("/admin");
    }

    if (experienceId) {
      redirect("/member");
    }

    // Fallback if we can't detect automatically
    // We'll check if the user is an admin of ANY company
    const { data: companies } = await whopsdk.authorizedUsers.list({ user_id: userId });

    if (companies && companies.length > 0) {
      redirect("/admin");
    } else {
      redirect("/member");
    }

  } catch (error) {
    console.error("Auth error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold">Session Expired</h1>
        <p className="text-gray-600">Please refresh the page or re-open the app in Whop.</p>
      </div>
    );
  }
}
