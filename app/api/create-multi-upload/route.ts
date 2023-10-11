import s3Upload from "@/lib/server/s3upload"
import { S3Client } from "@aws-sdk/client-s3"

export async function GET(request: Request) {
    const s3Uploader = new s3Upload(new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
    }));
    const uploadId = await s3Uploader.createMultiUpload('nextjs-template-bucket', "file.mov");

    return Response.json({ uploadId })
}

