import { type NextRequest } from 'next/server';
import s3Upload from "@/lib/server/s3upload";
import { S3Client } from "@aws-sdk/client-s3";
import { Container } from '@/lib/typedi.config';
import { myContainer } from '@/inversify.config';
import { MultiPartUpload, TYPES } from '@/lib/server/types/upload-manager';
// import { MultiPartUpload, TYPES } from '@/lib/server/types/upload-manager';

export async function POST(request: NextRequest) {
    // const s3Uploader = new s3Upload(new S3Client({
    //     region: 'us-east-1',
    //     credentials: {
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    //     }
    // }));
    // const multiUploader = Container.get(s3Upload);
    const multiUploader = myContainer.get<MultiPartUpload>(TYPES.MultiPartUpload);
    const body = await request.json();
    console.log("body", body);
    const bucket = body.params.bucket|| "";
    const key = body.params.key || "";
    const uploadId = body.params.uploadId || "";
    const parts = body.params.parts;

    if (!bucket || !key || !uploadId || !parts) {
        return Response.json({
            message: "unacceptable params"
        }, {
            status: 400
        })
    }
    
    const data = await multiUploader.completeMultiPartUpload(bucket, key, uploadId, parts);
    console.log("data", data);
    return Response.json({ data });
}
