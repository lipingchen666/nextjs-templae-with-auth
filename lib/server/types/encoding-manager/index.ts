export interface EncodingManager {
    encode(encodingOption: encodingOption): Promise<string | undefined>;
    generateEncodingOptions(body: any): encodingOption;
}


/* 
fileName: string !required;
   fileInfo: object option;
   defaultTemplate: string optional
   inputBucket: string optional;
   outputBucket: string optional;
   outputFileName: string optional;
   encodeVideo: object optional;
   encodeAudio: object optional;
   encodeVideoOptions: {}
   encodeAudioOptions: {}
   generateThumbnailTrack: bool - optional;
   thumbnailOptions: {
   }  

*/

export type encodingOption = {
    fileName: string;
    fileInfo: fileInfo;
    inputBucket: string;
    outputBucket: string;
    outputFileName: string;
    encodeVideo?: boolean;
    videoOptions?: VideoOption[];
    encodeAudio?: boolean;
    audioOptions?: AudioOption[];
    generateThumbnailTrack?: boolean;
    drm?: boolean;
}

export interface fileInfo {
    hasVideo: boolean,
    hasAudio: boolean
    videoStream?: videoStreamInfo
    audioStream?: audioStreamInfo
    fileName: string,
    size: number,
    extension?: string
}

export type videoStreamInfo = {
    bitRate: number,
    width: number,
    height: number,
    duration_s: number,
}

export type audioStreamInfo = {
    bitRate: number,
    duration_s: number
}

export type VideoOption = {
    width: number,
    height: number,
    bitrate: number,
}

export type AudioOption = {
    bitrate: number
}

export const TYPES = {
    EncodingManager: Symbol.for("EncodingManager"),
    MediaConvertClient: Symbol.for("MediaConvertClient"),
    BitMovingClient: Symbol.for("BitMovinClient"),
}