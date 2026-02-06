import Whop from "@whop/sdk";
import { verifyUserToken as baseVerifyUserToken } from "@whop/sdk/lib/verify-user-token";
import { headers } from "next/headers";

export const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY!,
    appID: process.env.WHOP_APP_ID!,
});

/**
 * Robustly verify the user token.
 */
export const verifyUserToken = async (tokenInput?: string) => {
    console.log("[Verifying User Token] Starting...");
    try {
        let token = tokenInput;

        if (!token) {
            const headersList = await headers();
            token = headersList.get("x-whop-user-token") || undefined;
            console.log("[Verifying User Token] Extracted from headers:", token ? "Found" : "None");
        } else {
            console.log("[Verifying User Token] Using provided token");
        }

        if (!token) {
            console.warn("[Verifying User Token] No token available");
            return null;
        }

        const result = await baseVerifyUserToken(token, {
            appId: process.env.WHOP_APP_ID!,
        });

        console.log("[Verifying User Token] Success for user:", result.userId);
        return result;
    } catch (error) {
        console.error("[Verifying User Token] FAILED:", error);
        return null;
    }
};

/**
 * Check if the user is an admin of a company.
 */
export const isAdminOfCompany = async (companyId: string, userId: string) => {
    console.log(`[Admin Check] Checking user ${userId} for company ${companyId}`);
    try {
        const result = await whop.users.checkAccess(companyId, { id: userId });
        const isAdmin = result.access_level === "admin";
        console.log(`[Admin Check] Result: ${isAdmin ? "IS ADMIN" : "NOT ADMIN"} (Level: ${result.access_level})`);
        return isAdmin;
    } catch (error) {
        console.error(`[Admin Check] FAILED for ${companyId}:`, error);
        return false;
    }
};

/**
 * Check if the user is a member/customer of a resource.
 */
export const isMemberOfResource = async (resourceId: string, userId: string) => {
    console.log(`[Member Check] Checking user ${userId} for resource ${resourceId}`);
    try {
        const result = await whop.users.checkAccess(resourceId, { id: userId });
        console.log(`[Member Check] Result: ${result.has_access ? "HAS ACCESS" : "NO ACCESS"}`);
        return result.has_access;
    } catch (error) {
        console.error(`[Member Check] FAILED for ${resourceId}:`, error);
        return false;
    }
};

/**
 * Retrieve user details by ID.
 */
export const getWhopUser = async (userId: string) => {
    try {
        return await whop.users.retrieve(userId);
    } catch (error) {
        console.error(`[Retrieve User] FAILED for ${userId}:`, error);
        return null;
    }
};
