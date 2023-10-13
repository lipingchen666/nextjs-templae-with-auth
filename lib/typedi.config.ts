import 'reflect-metadata';
import { Container } from 'typedi';
import { S3Client } from "@aws-sdk/client-s3";
import s3Upload from './client/s3Upload';

Container.set(S3Client, new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
}));

Container.set("MultiPartUpload", s3Upload);

export { Container }