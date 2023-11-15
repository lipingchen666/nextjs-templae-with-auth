import "reflect-metadata";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"
import { cdnManager } from "../../types/cdn-manager";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/cdn-manager";

@injectable()
class CloudFrontCdn implements cdnManager {
    domain: string;
    keyPairId: string;
    privateKey: string;

    constructor(@inject(TYPES.domain) domain: string, @inject(TYPES.keyPairId) keyPairId: string, @inject(TYPES.privateKey) privateKey: string) {
        this.domain = domain;
        this.keyPairId = keyPairId;
        this.privateKey = privateKey;
    }

    async getSignedUrl(objectKey: string): Promise<string> {
        const expireDate = "2024-01-01";
        const url = `${this.domain}/${objectKey}`;
        
        return getSignedUrl({
            url,
            keyPairId: this.keyPairId,
            dateLessThan: expireDate,
            privateKey: this.privateKey,
        });
    }
}

export default CloudFrontCdn;