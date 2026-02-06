import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { whopsdk } from "@/lib/whop";

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const head = await headers();
  const query = await searchParams;

  console.log("RootPage hit:", {
    bizId: head.get("x-whop-biz-id") || query.bizId || query.biz_id,
    experienceId: head.get("x-whop-experience-id") || query.experienceId || query.experience_id,
    userId: head.get("x-whop-user-id") || query.userId || query.user_id,
    authHeader: !!head.get("authorization"),
    query: query
  });

  const bizId = head.get("x-whop-biz-id") || (typeof query.bizId === 'string' ? query.bizId : undefined);
  const experienceId = head.get("x-whop-experience-id") || (typeof query.experienceId === 'string' ? query.experienceId : undefined);

  // Construct search string to preserve context
  const searchStr = new URLSearchParams();
  if (bizId) searchStr.set("bizId", bizId);
  if (experienceId) searchStr.set("experienceId", experienceId);
  const queryString = searchStr.toString() ? `?${searchStr.toString()}` : "";

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

    if (bizId) {
      console.log("Redirecting to /admin based on bizId");
      redirect(`/admin${queryString}`);
    }

    if (experienceId) {
      console.log("Redirecting to /member based on experienceId");
      redirect(`/member${queryString}`);
    }

    // Fallback if we can't detect automatically
    console.log("No specific context found, checking authorized companies...");
    const { data: companies } = await whopsdk.authorizedUsers.list({ user_id: userId });

    if (companies && companies.length > 0) {
      console.log("User has admin companies, redirecting to /admin");
      redirect(`/admin${queryString}`);
    } else {
      console.log("User has no admin companies, redirecting to /member");
      redirect(`/member${queryString}`);
    }

  } catch (error) {
    console.error("Auth error in RootPage:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Context Required</h1>
        <p className="text-gray-600 mt-2">Please ensure you are viewing this app through the Whop dashboard or experience view.</p>
        <div className="mt-4 p-4 bg-gray-50 rounded text-left inline-block max-w-full">
          <p className="text-xs font-mono text-gray-500 mb-2">Debug Info:</p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              headers: {
                bizId: head.get("x-whop-biz-id"),
                experienceId: head.get("x-whop-experience-id"),
                auth: !!head.get("authorization")
              },
              query: query
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}
