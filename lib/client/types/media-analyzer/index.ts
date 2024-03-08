export interface MediaAnalyzer {
    getFileTotalInfo(file: File): Promise<fileInfo>;
}

export interface fileInfo {
    hasVideo: boolean,
    hasAudio: boolean
    videoStream: videoStreamInfo | {},
    audioStream: audioStreamInfo | {},
    fileName: string,
    size: number,
    extension?: string
}

export type videoStreamInfo = {
    bitRate: number,
    duration_s: number,
}

export type audioStreamInfo = {
    bitRate: number,
    duration_s: number
}

export const TYPES = {
    MediaAnalyzer: Symbol.for("MediaAnalyzer"),
    FfprobeCient: Symbol.for("FfprobeClient")
}