export interface EncodingManager {
    encode(bucket: string, key: string, outPutBucket: string, outPutKey: string): Promise<string | undefined>;
}