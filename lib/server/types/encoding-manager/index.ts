export interface EncodingManager {
    encode(bucket: string, key: string, outPutBucket: string, outPutKey: string): Promise<string | undefined>;
}

export const TYPES = {
    EncodingManager: Symbol.for("EncodingManager"),
    MediaConvertClient: Symbol.for("MediaConvertClient")
}