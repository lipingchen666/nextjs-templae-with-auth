import {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    S3Client,
    CompletedMultipartUpload,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class s3Upload {
    s3Client: S3Client;

    constructor(s3Client: S3Client) {
        this.s3Client = s3Client;
    }

    async createSingleUpload(bucket: string, key: string) {

    }

    async createMultiUpload(bucket: string, key: string) {
        const multipartUpload = await this.s3Client.send(
            new CreateMultipartUploadCommand({
                Bucket: bucket,
                Key: key,
            }),
        );

        return multipartUpload.UploadId;
    }

    async getPartUploadUrl(
        bucket: string,
        key: string,
        uploadId: string,
        partNumber: number
    ): Promise<string> {

        const params = {
            Bucket: bucket,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
        };

        const cmd = new UploadPartCommand(params);
        const signedUrl = await getSignedUrl(this.s3Client, cmd, {
            expiresIn: 60 * 15,
        });

        return signedUrl as string;
    }

    async completeMultiPartUpload(
        bucket: string,
        key: string,
        uploadId: string,
        multipartUpload: CompletedMultipartUpload
    ) {
        console.log("multipartUpload", multipartUpload.Parts)
        return await this.s3Client.send(
            new CompleteMultipartUploadCommand({
                Bucket: bucket,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: multipartUpload
            }),
        );
    }
}

export default s3Upload;