
import { myContainer } from "@/inversify.config";
import { MultiPartUpload, TYPES } from "@/lib/server/types/upload-manager";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const multiUploader = myContainer.get<MultiPartUpload>(TYPES.MultiPartUpload);
    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket') || "";
    const key = searchParams.get('key') || "";

    if (!searchParams || !bucket || !key) {
        console.log("bucket", bucket);
        console.log("key", key);
        return Response.json({
            message: "unacceptable query params"
        }, {
            status: 400
        })
    }

    const uploadId = await multiUploader.createMultiUpload(bucket, key);

    return Response.json({ uploadId })
}

