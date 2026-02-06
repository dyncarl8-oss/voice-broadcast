import Whop from "@whop/sdk";
import { verifyUserToken as baseVerifyUserToken } from "@whop/sdk/lib/verify-user-token";

export const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY!,
});

export const verifyUserToken = async (token: string) => {
    try {
        const result = await baseVerifyUserToken(token, {
            appId: process.env.WHOP_APP_ID!,
        });
        return result;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
