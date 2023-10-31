import axios from 'axios';
import { MultiUploadClientError, S3Destination, UploadClient } from './types/upload-manager';

class s3Upload implements UploadClient<S3Destination> {
    async uploadFile(file: File, destination: S3Destination, callback: () => void): Promise<String> {
        const uploadId = await this.createMultiUpload();
        const fileSize = file.size;
        const CHUNK_SIZE = 10000000; // 10MB
        const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
        const promisesArray = [];
        let start;
        let end;
        let blob;

        for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
            start = (index - 1) * CHUNK_SIZE;
            end = index * CHUNK_SIZE;
            blob = index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);
            const partSignedUrl = await this.getPartSignedUrl(destination, uploadId, index);
            const uploadResp = axios.put(partSignedUrl, blob, {
                headers: {
                    'Content-Type': file.type,
                },
            })
            promisesArray.push(uploadResp)
        }

        const resolvedArray = await Promise.all(promisesArray);
        const uploadPartsArray = resolvedArray.map(({ headers }, i) => ({
            ETag: headers.etag,
            PartNumber: i + 1
        }));
    }

    async createMultiUpload(): Promise<string> {
        const res = await fetch('/api/create-multi-upload');
        const { uploadId } = await res.json();

        if (!uploadId) {
            throw new MultiUploadClientError({
                name: 'GET_UPLOAD_ID_FAILED',
                message: ''
            })
        }

        return uploadId;
    }

    async completeMultiUpload(): Promise<string> {
        
    }

    async getPartSignedUrl(destination: S3Destination, uploadId: string, index: number): Promise<string> {
        const signedUrlResponse = await fetch(`/api/get-part-upload-presigned-url?bucket=${destination.bucket}&key=${destination.key}&uploadId=${uploadId}&partNumber=${index}`);
        const { signedUrl } = await signedUrlResponse.json();
        console.log("signedUrl", signedUrl);
        if (!signedUrl) {
            throw new MultiUploadClientError({
                name: 'GET_PART_SIGNED_URL_FAILED',
                message: ''
            })
        }

        return signedUrl;
    }



    async multiPartUpload(file: File, bucket = 'nextjs-template-bucket', key = 'file.mov') {
        const res = await fetch('/api/create-multi-upload');
        const { uploadId } = await res.json();
        console.log("uploadId", uploadId);
        if (uploadId) {
            const fileSize = file.size;
            const CHUNK_SIZE = 10000000; // 10MB
            const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
            const promisesArray = [];
            let start;
            let end;
            let blob;

            for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
                start = (index - 1) * CHUNK_SIZE;
                end = index * CHUNK_SIZE;
                blob = index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);
                const signedUrlResponse = await fetch(`/api/get-part-upload-presigned-url?bucket=${bucket}&key=${key}&uploadId=${uploadId}&partNumber=${index}`);
                const { signedUrl } = await signedUrlResponse.json();
                console.log("signedUrl", signedUrl);
                if (signedUrl) {
                    const uploadProgressHandler = async (progressEvent, blob, index) => {
                        if (progressEvent.loaded >= progressEvent.total) return

                        const currentProgress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        console.log("currentProgress", currentProgress);
                    }

                    const uploadResp = axios.put(signedUrl, blob, {
                        onUploadProgress: e => uploadProgressHandler(e, CHUNKS_COUNT, index),
                        headers: {
                            'Content-Type': file.type,
                        },
                    })
                    promisesArray.push(uploadResp)
                }
            }
            const resolvedArray = await Promise.all(promisesArray);
            const uploadPartsArray = resolvedArray.map(({ headers }, i) => ({
                ETag: headers.etag,
                PartNumber: i + 1
            }));

            const completeUploadResp = await axios.post(`/api/complete-multi-upload`, {
                params: {
                    bucket,
                    key,
                    uploadId,
                    parts: uploadPartsArray
                },
            })
            console.log(completeUploadResp.data, 'upload response complete');
        }
    }
}

export default s3Upload