import { type NextRequest } from 'next/server';
import { myContainer } from '@/inversify.config';
import { TYPES } from '@/lib/server/types/encoding-manager';
import { EncodingManager } from '@/lib/server/types/encoding-manager';

export async function POST(request: NextRequest) {
    const encoder = myContainer.get<EncodingManager>(TYPES.EncodingManager);
    const body = await request.json();
    console.log("body", body);
    const bucket = body.bucket || "nextjs-template-bucket";
    const key = body.key || "";

    if (!key) {
        return Response.json({
            message: "unacceptable params"
        }, {
            status: 400
        })
    }
    
    const response = await encoder.encode( "nextjs-template-bucket", key, "nextjs-template-output-bucket", "");
    
    console.log("response", response);
    return Response.json({ data: response });
}
