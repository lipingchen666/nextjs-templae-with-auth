import { Container, decorate, injectable } from "inversify";
require("reflect-metadata");
import { MultiPartUpload, TYPES } from "./lib/server/types/upload-manager";
import s3Upload from "./lib/server/s3upload";
import { default as S3UploadClient } from "./lib/client/s3Upload";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Destination, UploadClient, TYPES as CLIENT_TYPES } from "./lib/client/types/upload-manager";

//SERVER
const myContainer = new Container();

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
myContainer.bind<S3Client>(TYPES.S3Client).toConstantValue(s3Client);
myContainer.bind<MultiPartUpload>(TYPES.MultiPartUpload).to(s3Upload);

//CLIENT
myContainer.bind<UploadClient<S3Destination>>(CLIENT_TYPES.UploadClient).to(S3UploadClient);

export { myContainer };