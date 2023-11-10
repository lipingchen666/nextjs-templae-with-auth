import "reflect-metadata";
import {
    MediaConvertClient,
    CreateJobCommand,
    AccelerationMode,
    AudioDefaultSelection,
    InputTimecodeSource,
    OutputGroupType,
    CmafWriteHLSManifest,
    CmafWriteDASHManifest,
    CmafSegmentControl,
    CmafManifestDurationFormat,
    CmafStreamInfResolution,
    CmafClientCache,
    CmafManifestCompression,
    HlsCodecSpecification,
    StatusUpdateInterval
} from "@aws-sdk/client-mediaconvert";
import { inject, injectable } from "inversify";
import * as dashJobInput from './jobs/mp4MovToDash.json';
import { EncodingManager, TYPES } from "../../types/encoding-manager";

@injectable()
class AwsEncode implements EncodingManager {
    mediaConvertClient: MediaConvertClient;

    constructor(@inject(TYPES.MediaConvertClient) mediaConvertClient: MediaConvertClient) {
        this.mediaConvertClient = mediaConvertClient;
    }

    async encode(bucket: string = "nextjs-template-bucket", key: string, outPutBucket: string = "s3://nextjs-template-output-bucket", outPutKey: string): Promise<string | undefined> {
        const input = dashJobInput;
        for (let i = 0; i < input.Settings.Inputs.length; i++) {
            input.Settings.Inputs[i].FileInput = `s3://${bucket}/${key}`;
        }

        for (let i = 0; i < input.Settings.OutputGroups.length; i++) {
            input.Settings.OutputGroups[i].OutputGroupSettings.DashIsoGroupSettings.Destination = `s3://${outPutBucket}/${outPutKey}`;
        }


        // input.Settings.Inputs[0].FileInput = `s3://${bucket}/${key}`;
        // input.Settings.OutputGroups[0].OutputGroupSettings.DashIsoGroupSettings.Destination = `s3://${outPutBucket}/${outPutKey}`;

        // const input = {
        //     "JobTemplate": "arn:aws:mediaconvert:us-east-2:536041993003:jobTemplates/System-Ott_Cmaf_Cmfc_Avc_Aac_Sdr_Cbr",
        //     "Queue": "arn:aws:mediaconvert:us-east-2:536041993003:queues/Default",
        //     "UserMetadata": {},
        //     "Role": "arn:aws:iam::536041993003:role/service-role/MediaConvert_Default_Role_3",
        //     // Role: "arn:aws:iam::536041993003:user/nextj-template-s3",
        //     "Settings": {
        //         "OutputGroups": [
        //             {
        //                 "Name": "CMAF",
        //                 "Outputs": [
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1920x1080p_30Hz_10Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1920x1080p_30Hz_10000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1920x1080p_30Hz_8Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1920x1080p_30Hz_8000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1440x810p_30Hz_6Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1440x810p_30Hz_6000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1440x810p_30Hz_5Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1440x810p_30Hz_5000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1280x720p_30Hz_5Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1280x720p_30Hz_5000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1280x720p_30Hz_4Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1280x720p_30Hz_4000Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_960x540p_30Hz_2.5Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_960x540p_30Hz_2500Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_768x432p_30Hz_1.2Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_768x432p_30Hz_1200Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_640x360p_30Hz_0.8Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_640x360p_30Hz_800Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_416x234p_30Hz_0.36Mbps_Cbr",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Avc_16x9_Sdr_416x234p_30Hz_360Kbps_Cbr"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Aac_He_96Kbps",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Aac_He_96Kbps"
        //                     },
        //                     {
        //                         "Preset": "System-Ott_Cmaf_Cmfc_Aac_He_64Kbps",
        //                         "NameModifier": "_Ott_Cmaf_Cmfc_Aac_He_64Kbps"
        //                     }
        //                 ],
        //                 "OutputGroupSettings": {
        //                     "Type": OutputGroupType.CMAF_GROUP_SETTINGS,
        //                     "CmafGroupSettings": {
        //                         "WriteHlsManifest": CmafWriteHLSManifest.ENABLED,
        //                         "WriteDashManifest": CmafWriteDASHManifest.ENABLED,
        //                         "SegmentLength": 30,
        //                         "Destination": "s3://nextjs-template-output-bucket/",
        //                         "FragmentLength": 3,
        //                         "SegmentControl": CmafSegmentControl.SEGMENTED_FILES,
        //                         "ManifestDurationFormat": CmafManifestDurationFormat.INTEGER,
        //                         "StreamInfResolution": CmafStreamInfResolution.INCLUDE,
        //                         "ClientCache": CmafClientCache.ENABLED,
        //                         "ManifestCompression": CmafManifestCompression.NONE,
        //                         "CodecSpecification": HlsCodecSpecification.RFC_4281,
        //                     }
        //                 }
        //             }
        //         ],
        //         "AdAvailOffset": 0,
        //         "Inputs": [
        //             {
        //                 "AudioSelectors": {
        //                     "Audio Selector 1": {
        //                         "DefaultSelection": AudioDefaultSelection.DEFAULT
        //                     }
        //                 },
        //                 "VideoSelector": {},
        //                 "TimecodeSource": InputTimecodeSource.ZEROBASED,
        //                 "FileInput": "s3://nextjs-template-bucket/friendly-woman-in-colorful-sweater-greeting-the-camera-vibrant-backdrop-SBV-338976413-HD.mov"
        //             }
        //         ]
        //     },
        //     AccelerationSettings: {
        //         Mode: AccelerationMode.DISABLED
        //     },
        //     "StatusUpdateInterval": StatusUpdateInterval.SECONDS_60,
        //     "Priority": 0,
        //     "HopDestinations": []
        // }
        // const input = dashJobInput;
        
        // @ts-ignore
        const command = new CreateJobCommand(input);
        const response = await this.mediaConvertClient.send(command);
        console.log("response", response);

        return "success";
    }
}

export default AwsEncode;