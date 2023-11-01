// import { myContainer } from "@/inversify.config";
import s3Upload from "@/lib/server/s3upload"
import { MultiPartUpload, TYPES } from "@/lib/server/types/upload-manager";
import { Container } from "@/lib/typedi.config";
import { S3Client } from "@aws-sdk/client-s3"
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    // const s3Uploader = new s3Upload(new S3Client({
    //     region: 'us-east-1',
    //     credentials: {
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    //     }
    // }));
    
    const multiUploader = Container.get(s3Upload);
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

