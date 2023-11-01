import { ErrorBase } from "../Error";

export interface UploadClient<T> {
    uploadFile(file: File, destination: T, callback: (percent: number) => void): Promise<String>
}

export type S3Destination = {
    bucket: string,
    key: string,
}

export type MultiUploadClientErrorName = 
    | 'GET_UPLOAD_ID_FAILED'
    | 'GET_PART_SIGNED_URL_FAILED'
    | 'COMPLETE_MULTI_UPLOADS_FAILED'

export class MultiUploadClientError extends ErrorBase<MultiUploadClientErrorName> {};