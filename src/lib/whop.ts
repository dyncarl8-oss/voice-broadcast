import Whop from "@whop/sdk";
import { verifyUserToken as baseVerifyUserToken } from "@whop/sdk/lib/verify-user-token";
import { headers } from "next/headers";

export const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY!,
    appID: process.env.WHOP_APP_ID!,
});

/**
 * Robustly verify the user token.
 * Can take a token directly or automatically extract from headers.
 */
export const verifyUserToken = async (tokenInput?: string) => {
    try {
        let token = tokenInput;

        if (!token) {
            const headersList = await headers();
            token = headersList.get("x-whop-user-token") || undefined;
        }

        if (!token) return null;

        const result = await baseVerifyUserToken(token, {
            appId: process.env.WHOP_APP_ID!,
        });

        return result;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

/**
 * Check if the user is an admin of a company.
 */
export const isAdminOfCompany = async (companyId: string, userId: string) => {
    try {
        const result = await whop.users.checkAccess(companyId, { id: userId });
        return result.access_level === "admin";
    } catch (error) {
        console.error(`Admin check failed for ${companyId}:`, error);
        return false;
    }
};

/**
 * Check if the user is a member/customer of a resource.
 */
export const isMemberOfResource = async (resourceId: string, userId: string) => {
    try {
        const result = await whop.users.checkAccess(resourceId, { id: userId });
        return result.has_access;
    } catch (error) {
        console.error(`Member check failed for ${resourceId}:`, error);
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
        console.error(`Retrieve user failed for ${userId}:`, error);
        return null;
    }
};
