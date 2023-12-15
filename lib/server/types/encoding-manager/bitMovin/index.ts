export interface bitMovinEncodingOptions {
    hasAudio?: boolean
    hasVideo?: boolean
    videoOptions?: bitMovinVideoEncodeOPtions[]
    audioOptions?: bitMovinAudioEncodeOptions[]
    subtitle?: boolean
    drm?: boolean,
    thumbnailTrack?: boolean
}

export interface bitMovinVideoEncodeOPtions {
    height: number,
    width: number,
    bitrate: number,
}

export interface bitMovinAudioEncodeOptions {
    bitrate: number
}