import { WhopSDK } from "@whop-sdk/core";

export const whopsdk = new WhopSDK({
    apiKey: process.env.WHOP_API_KEY,
});
