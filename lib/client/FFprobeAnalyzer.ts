import { FFprobeWorker } from "ffprobe-wasm";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { MediaAnalyzer, TYPES, fileInfo } from "./types/media-analyzer";

@injectable()
class FFprobeMediaAnalyzer implements MediaAnalyzer {
    ffprobeWorker: FFprobeWorker;

    constructor(@inject(TYPES.FfprobeCient) ffprobeWorker: FFprobeWorker) {
        this.ffprobeWorker = ffprobeWorker;
    }

    async getFileTotalInfo(file: File): Promise<fileInfo> {
        const fileInfo = await this.ffprobeWorker.getFileInfo(file);
        const streams = fileInfo.streams;
        const fileFormat = fileInfo.format;

        const hasVideo = streams.some(stream => stream.codec_type === "video");
        const hasAudio = streams.some(stream => stream.codec_type === "audio");

        const videoStream = streams.reduce((acc, stream) => {
            if (stream.codec_type === "video") {
                return {
                    ...acc,
                    bitRate: parseInt(stream.bit_rate),
                    duration_s: stream.duration
                }
            }

            return acc
        }, {})

        const audioStream = streams.reduce((acc, stream) => {
            if (stream.codec_type === "audio") {
                return {
                    ...acc,
                    bitRate: parseInt(stream.bit_rate),
                    duration_s: stream.duration
                }
            }

            return acc
        }, {})

        const extension = fileFormat.filename?.split('.').pop();

        return {
            hasVideo,
            hasAudio,
            videoStream,
            audioStream,
            fileName: fileFormat.filename,
            size: parseInt(fileFormat.size),
            extension
        }
    }
}

export default FFprobeMediaAnalyzer;