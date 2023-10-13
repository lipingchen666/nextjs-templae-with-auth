// import { myContainer } from "@/inversify.config";
import s3Upload from "@/lib/server/s3upload"
import { MultiPartUpload, TYPES } from "@/lib/server/types/upload-manager";
import { Container } from "@/lib/typedi.config";
import { S3Client } from "@aws-sdk/client-s3"

export async function GET(request: Request) {
    // const s3Uploader = new s3Upload(new S3Client({
    //     region: 'us-east-1',
    //     credentials: {
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    //     }
    // }));
    const multiUploader = Container.get(s3Upload);
    const uploadId = await multiUploader.createMultiUpload('nextjs-template-bucket', "file.mov");

    return Response.json({ uploadId })
}

