import { type NextRequest } from 'next/server';
import { myContainer } from '@/inversify.config';
import { TYPES } from '@/lib/server/types/encoding-manager';
import { EncodingManager } from '@/lib/server/types/encoding-manager';

export async function POST(request: NextRequest) {
    const encoder = myContainer.get<EncodingManager>(TYPES.EncodingManager);
    const body = await request.json();
    console.log("body", body);

    const encodingOptions = encoder.generateEncodingOptions(body);
    const response = await encoder.encode(encodingOptions);
    
    console.log("response", response);
    return Response.json({ data: response });
}
