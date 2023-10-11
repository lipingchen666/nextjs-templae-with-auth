import { type NextRequest } from 'next/server';
import s3Upload from "@/lib/server/s3upload";
import { S3Client } from "@aws-sdk/client-s3";

export async function GET(request: NextRequest) {
    const s3Uploader = new s3Upload(new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    }));

    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket') || "";
    const key = searchParams.get('key') || "";
    const uploadId = searchParams.get('uploadId') || "";
    const partNumber = searchParams.get('partNumber');

    if (!searchParams || !bucket || !key || !uploadId || !partNumber) {
        console.log("bucket", bucket);
        console.log("key", key);
        console.log("uploadId", uploadId);
        console.log("partNumber", partNumber);
        return Response.json({
            message: "unacceptable query params"
        }, {
            status: 400
        })
    }
    
    const signedUrl = await s3Uploader.getPartUploadUrl(bucket, key, uploadId, parseInt(partNumber));

    return Response.json({ signedUrl })
}
