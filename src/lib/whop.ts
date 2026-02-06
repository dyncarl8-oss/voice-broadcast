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
 * Check access level for a specific resource (company, experience, or product)
 */
export const checkAccess = async (resourceId: string, userId: string) => {
    try {
        // resourceId can be biz_xxx, exp_xxx etc
        const result = await whop.users.checkAccess(resourceId, { id: userId });
        return {
            has_access: result.has_access,
            access_level: result.access_level,
        };
    } catch (error) {
        console.error(`Access check failed for ${resourceId}:`, error);
        return { has_access: false, access_level: "no_access" };
    }
};
