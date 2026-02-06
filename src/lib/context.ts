import { headers } from "next/headers";

export async function getWhopContext() {
    const head = await headers();
    return {
        userId: head.get("x-whop-user-id"),
        bizId: head.get("x-whop-biz-id"),
        experienceId: head.get("x-whop-experience-id"),
    };
}
