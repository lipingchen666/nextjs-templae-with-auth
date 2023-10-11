import { type NextRequest } from 'next/server';
import s3Upload from "@/lib/server/s3upload";
import { S3Client } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
    const s3Uploader = new s3Upload(new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    }));
    
    const body = await request.json();
    console.log("body", body);
    const bucket = body.params.bucket|| "";
    const key = body.params.key || "";
    const uploadId = body.params.uploadId || "";
    const multipartUpload = body.params.multipartUpload;

    if (!bucket || !key || !uploadId || !multipartUpload) {
        return Response.json({
            message: "unacceptable params"
        }, {
            status: 400
        })
    }
    
    const data = s3Uploader.completeMultiPartUpload(bucket, key, uploadId, multipartUpload);

    return Response.json({ data })
}
