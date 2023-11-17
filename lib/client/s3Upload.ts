import axios, { AxiosProgressEvent } from 'axios';
import { MultiUploadClientError, S3Destination, SingleUploadClientError, UploadClient } from './types/upload-manager';
import { Part } from '@aws-sdk/client-s3';
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
class s3Upload implements UploadClient<S3Destination> {
    async uploadFile(file: File, destination: S3Destination, callback: (percent: number) => void): Promise<String> {
        if (file.size >= 100000000) {
            return this.uploadFileAsMultiParts(file, destination, callback)
        }

        return this.uploadFileAsOnePart(file, destination, callback);
    }

    async uploadFileAsMultiParts(file: File, destination: S3Destination, callback: (percent: number) => void): Promise<String> {
        const uploadId = await this.createMultiUpload(destination);
        const fileSize = file.size;
        const CHUNK_SIZE = 10000000; // 10MB
        const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
        const promisesArray = [];
        const progressArray = Array(CHUNKS_COUNT+1).fill(0);
        let start;
        let end;
        let blob;

        for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
            start = (index - 1) * CHUNK_SIZE;
            end = index * CHUNK_SIZE;
            blob = index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);
            const partSignedUrl = await this.getPartSignedUrl(destination, uploadId, index);

            const uploadResp = axios.put(partSignedUrl, blob, {
                onUploadProgress: e => this.uploadProgressHandler(e, progressArray, index, callback),
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
        const location = await this.completeMultiUpload(destination, uploadId, uploadPartsArray);
        console.log("location", location);
        return location;
    }

    async uploadFileAsOnePart(file: File, destination: S3Destination, callback: (percent: number) => void): Promise<String> {
        const signedUrl = await this.getSingleSignedUrl(destination);
        const progressArray = [0, 0];
        const uploadResp = await axios.put(signedUrl, file, {
            onUploadProgress: e => this.uploadProgressHandler(e, progressArray, 1, callback),
            headers: {
                'Content-Type': file.type,
            },
        });
        console.log("uploadResp", uploadResp);

        return uploadResp.data;
    }

    async uploadProgressHandler(progressEvent: AxiosProgressEvent, progressArray: number[], index: number, callback: (percent: number) => void) {
        let progressPercent;
        const eventTotal = progressEvent.total || 0;
        if (progressEvent.loaded >= eventTotal) {
            progressPercent = 100
        }
        else {
            progressPercent = progressEvent.loaded * 100 / eventTotal;
        }
        
        progressArray[index] = progressPercent;
        console.log("progressArray", progressArray);
        
        const totalProgress = progressArray.reduce((acc, e) => {
            return acc + e
        }, 0);

        const totalProgressPercent = totalProgress / (progressArray.length - 1)
        callback(totalProgressPercent);
    }

    async createMultiUpload(destination: S3Destination): Promise<string> {
        const res = await fetch(`/api/create-multi-upload?bucket=${destination.bucket}&key=${destination.key}`);
        const { uploadId } = await res.json();

        if (!uploadId) {
            throw new MultiUploadClientError({
                name: 'GET_UPLOAD_ID_FAILED',
                message: ''
            })
        }

        return uploadId;
    }

    async getSingleSignedUrl(destination: S3Destination) {
        const signedUrlResponse = await fetch(`/api/get-single-upload-presigned-url?bucket=${destination.bucket}&key=${destination.key}`);

        const { signedUrl } = await signedUrlResponse.json();
        console.log("signedUrl", signedUrl);
        if (!signedUrl) {
            throw new SingleUploadClientError({
                name: 'GET_SINGLE_SIGNED_URL_FAILED',
                message: ''
            })
        }

        return signedUrl;
    }

    async completeMultiUpload(destination: S3Destination, uploadId: string, parts: Part[]): Promise<string> {
        const completeUploadResp = await axios.post(`/api/complete-multi-upload`, {
            params: {
                bucket: destination.bucket,
                key: destination.key,
                uploadId,
                parts: parts
            },
        })
        if (!completeUploadResp.data) {
            throw new MultiUploadClientError({
                name: 'COMPLETE_MULTI_UPLOADS_FAILED',
                message: ''
            })
        }

        return completeUploadResp.data;
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
}

export default s3Upload