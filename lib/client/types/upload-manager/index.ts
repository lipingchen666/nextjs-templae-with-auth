import { ErrorBase } from "../Error";

export interface UploadClient<T> {
    uploadFile(file: File, destination: T, callback: () => void): Promise<String>
}

export type S3Destination = {
    bucket: string,
    key: string,
    uploadId: string
}

export type MultiUploadClientErrorName = 
    | 'GET_UPLOAD_ID_FAILED'
    | 'GET_PART_SIGNED_URL_FAILED'
    | 'UPLOAD_PARTS_FAILED'

export class MultiUploadClientError extends ErrorBase<MultiUploadClientErrorName> {};