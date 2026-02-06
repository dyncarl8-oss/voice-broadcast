import Whop from "@whop/sdk";
import { verifyUserToken as baseVerifyUserToken } from "@whop/sdk/lib/verify-user-token";

export const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY!,
    appID: process.env.WHOP_APP_ID!,
});

export const verifyUserToken = async (input: any) => {
    try {
        const result = await baseVerifyUserToken(input, {
            appId: process.env.WHOP_APP_ID!,
        });
        return result;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

export const checkAccess = async (resourceId: string, userId: string) => {
    try {
        const result = await whop.users.checkAccess(resourceId, { id: userId });
        return result;
    } catch (error) {
        console.error("Access check failed:", error);
        return { has_access: false, access_level: "no_access" };
    }
};
