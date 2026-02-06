import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/whop";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const result = await verifyUserToken(token);
        if (!result) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const { userId } = result;
        return NextResponse.json({ userId });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
