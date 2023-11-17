import { type NextRequest } from 'next/server';
import { SinglePartUpload, TYPES } from '@/lib/server/types/upload-manager';
import { myContainer } from '@/inversify.config';

export async function GET(request: NextRequest) {
    const singleUploader = myContainer.get<SinglePartUpload>(TYPES.SinglePartUpload);
    
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
    
    const signedUrl = await singleUploader.getSingleUploadUrl(bucket, key);

    return Response.json({ signedUrl })
}
