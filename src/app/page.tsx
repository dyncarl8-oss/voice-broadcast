import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const headerList = await headers();
  const bizId = headerList.get("x-whop-biz-id");
  const experienceId = headerList.get("x-whop-experience-id");

  // If we have a bizId, the user is likely an admin in the Whop dashboard
  if (bizId) {
    redirect("/dashboard");
  }

  // If we have an experienceId, the user is likely a customer in an experience tab
  if (experienceId) {
    redirect("/experience");
  }

  // Otherwise, show the default landing or redirect to dashboard (common for dev)
  redirect("/dashboard");
}
