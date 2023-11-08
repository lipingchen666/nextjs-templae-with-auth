export type Part = {
    PartNumber: number,
    ETag: string
}

export interface MultiPartUpload {
    createMultiUpload(bucket: string, key: string): Promise<string | undefined>;
    getPartUploadUrl(bucket: string, key: string, uploadId: string, partNumber: number): Promise<string>;
    completeMultiPartUpload(bucket: string, key: string, uploadId: string, parts: Part[]): Promise<string | undefined>;
}

const TYPES = {
    MultiPartUpload: Symbol.for("MultiPartUpload"),
    S3Client: Symbol.for("S3Client")
};

export { TYPES };