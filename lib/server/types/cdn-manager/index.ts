export interface cdnManager {
    getSignedUrl(objectKey: string): Promise<string>
}

export const TYPES = {
    cdnManager: Symbol.for("cdnManager"),
    domain: Symbol.for("domain"),
    keyPairId: Symbol.for("keyPairId"),
    privateKey: Symbol.for("privateKey")
}