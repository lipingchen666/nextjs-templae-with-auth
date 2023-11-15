
import { myContainer } from "@/inversify.config";
import { cdnManager, TYPES } from "@/lib/server/types/cdn-manager";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const cdn = myContainer.get<cdnManager>(TYPES.cdnManager);
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key') || "";

    if (!key) {
        console.log("key", key);
        return Response.json({
            message: "unacceptable query params"
        }, {
            status: 400
        })
    }

    const cdnSignedUrl = await cdn.getSignedUrl(key);

    return Response.json({ cdnSignedUrl })
}

