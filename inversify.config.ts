import { Container, decorate, injectable } from "inversify";
require("reflect-metadata");
import { MultiPartUpload, SinglePartUpload, TYPES } from "./lib/server/types/upload-manager";
import s3Upload from "./lib/server/s3upload";
import { default as S3UploadClient } from "./lib/client/s3Upload";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Destination, UploadClient, TYPES as CLIENT_TYPES } from "./lib/client/types/upload-manager";
import { TYPES as ENCODING_TYPES, EncodingManager } from "./lib/server/types/encoding-manager";
import { MediaConvertClient } from "@aws-sdk/client-mediaconvert";
import AwsEncode from "./lib/server/encoder/aws-encoder/AwsEncode";
import { cdnManager, TYPES as CDN_TYPES } from "./lib/server/types/cdn-manager";
import CloudFrontCdn from "./lib/server/cdn/cloudfront-cdn/CloudFrontCdn";
import BitmovinApi, { ConsoleLogger } from "@bitmovin/api-sdk";
import BitMovinEncode from "./lib/server/encoder/bitMovin-encoder/bitMovinEncode";

//SERVER
const myContainer = new Container();

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const mediaConvertClient = new MediaConvertClient({
    region: 'us-east-1',
    endpoint: "https://lxlxpswfb.mediaconvert.us-east-1.amazonaws.com",
    // endpoint: "https://wa11sy9gb.mediaconvert.us-east-2.amazonaws.com"
});

const bitMovinClient = new BitmovinApi({
    apiKey: process.env.BITMOVIN_API_KEY || '26b08c5c-6ee8-4a14-9525-9b9e161d8b8f',
    logger: new ConsoleLogger()
});

myContainer.bind<S3Client>(TYPES.S3Client).toConstantValue(s3Client);
myContainer.bind<MediaConvertClient>(ENCODING_TYPES.MediaConvertClient).toConstantValue(mediaConvertClient);
myContainer.bind<BitmovinApi>(ENCODING_TYPES.BitMovingClient).toConstantValue(bitMovinClient);

myContainer.bind<MultiPartUpload>(TYPES.MultiPartUpload).to(s3Upload);
myContainer.bind<SinglePartUpload>(TYPES.SinglePartUpload).to(s3Upload);

// myContainer.bind<EncodingManager>(ENCODING_TYPES.EncodingManager).to(AwsEncode);
myContainer.bind<EncodingManager>(ENCODING_TYPES.EncodingManager).to(BitMovinEncode);

myContainer.bind(CDN_TYPES.domain).toConstantValue(process.env.CLOUD_FRONT_DOMAIN);
myContainer.bind(CDN_TYPES.keyPairId).toConstantValue(process.env.CLOUD_FRONT_KEY_PAIR_ID);
myContainer.bind(CDN_TYPES.privateKey).toConstantValue(process.env.CLOUD_FRONT_PRIVATE_KEY);
myContainer.bind<cdnManager>(CDN_TYPES.cdnManager).to(CloudFrontCdn);

//CLIENT
myContainer.bind<UploadClient<S3Destination>>(CLIENT_TYPES.UploadClient).to(S3UploadClient);

export { myContainer };