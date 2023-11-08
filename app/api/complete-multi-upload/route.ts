import { type NextRequest } from 'next/server';
import { myContainer } from '@/inversify.config';
import { MultiPartUpload, TYPES } from '@/lib/server/types/upload-manager';
// import { MultiPartUpload, TYPES } from '@/lib/server/types/upload-manager';

export async function POST(request: NextRequest) {
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
