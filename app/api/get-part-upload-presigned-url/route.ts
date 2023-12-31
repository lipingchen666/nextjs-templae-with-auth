import { type NextRequest } from 'next/server';
import { MultiPartUpload, TYPES } from '@/lib/server/types/upload-manager';
import { myContainer } from '@/inversify.config';

export async function GET(request: NextRequest) {
    const multiUploader = myContainer.get<MultiPartUpload>(TYPES.MultiPartUpload);
    
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
    
    const signedUrl = await multiUploader.getPartUploadUrl(bucket, key, uploadId, parseInt(partNumber));

    return Response.json({ signedUrl })
}
