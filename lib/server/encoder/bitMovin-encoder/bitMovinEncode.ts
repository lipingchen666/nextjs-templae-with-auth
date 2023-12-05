import "reflect-metadata";
import { inject, injectable } from "inversify";
import { EncodingManager, TYPES } from "../../types/encoding-manager";
import BitmovinApi, { AacAudioConfiguration, AclEntry, AclPermission, CodecConfiguration, DashManifest, DashManifestDefault, DashManifestDefaultVersion, Encoding, EncodingOutput, Fmp4Muxing, H264VideoConfiguration, HlsManifest, HlsManifestDefault, HlsManifestDefaultVersion, HttpInput, Input, Manifest, ManifestGenerator, ManifestResource, MessageType, MuxingStream, Output, PresetConfiguration, S3Input, S3Output, Sprite, StartEncodingRequest, Status, Stream, StreamInput, StreamSelectionMode, Task } from '@bitmovin/api-sdk';

@injectable()
class BitMovinEncode implements EncodingManager {
    bitMovinClient: BitmovinApi;

    constructor(@inject(TYPES.BitMovingClient) bitMovinClient: BitmovinApi) {
        this.bitMovinClient = bitMovinClient;
    }

    async encode(bucket: string = "nextjs-template-bucket", key: string, outPutBucket: string = "s3://nextjs-template-output-bucket", outPutKey: string): Promise<string | undefined> {
        const encoding = await this.createEncoding(key, 'let us see');
        const input = await this.createS3Input(bucket);
        const output = await this.createS3Output(outPutBucket);

        const inputFilePath = key;

        const videoConfigurations = [
            await this.createH264VideoConfig(1280, 720, 3000000),
            // await this.createH264VideoConfig(1280, 720, 4608000),
            // await this.createH264VideoConfig(1920, 1080, 6144000),
            // await this.createH264VideoConfig(1920, 1080, 7987200),
        ];

        for (const videoConfig of videoConfigurations) {
            const videoStream = await this.createStream(encoding, input, inputFilePath, videoConfig);
            const spriteConfig = new Sprite({
                spriteName: "cool.jpg",
                vttName: "cool.vtt",
                outputs: [this.buildEncodingOutput(output, `/`)],
                distance: 10,
                width: 320
            });
            const sprite = await this.bitMovinClient.encoding.encodings.streams.sprites.create(encoding.id || "", videoStream.id || "", spriteConfig);
            await this.createFmp4Muxing(encoding, output, `video/${videoConfig.bitrate}`, videoStream);
        }

        // Audio - AAC
        // const audioConfigurations = [
        //     await this.createAacAudioConfig(192000),
        //     //  await this.createAacAudioConfig(64000)
        // ];

        // for (const audioConfig of audioConfigurations) {
        //     const audioStream = await this.createStream(encoding, input, inputFilePath, audioConfig);
        //     await this.createFmp4Muxing(encoding, output, `audio/${audioConfig.bitrate}`, audioStream);
        // }

        const dashManifest = await this.createDefaultDashManifest(encoding, output, '/');
        const hlsManifest = await this.createDefaultHlsManifest(encoding, output, '/');

        const startEncodingRequest = new StartEncodingRequest({
            manifestGenerator: ManifestGenerator.V2,
            vodDashManifests: [this.buildManifestResource(dashManifest)],
            vodHlsManifests: [this.buildManifestResource(hlsManifest)]
        });

        await this.executeEncoding(encoding, startEncodingRequest);

        return '';
    }

    /**
     * Creates an Encoding object. This is the base object to configure your encoding.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/encodings#/Encoding/PostEncodingEncodings
     *
     * @param name A name that will help you identify the encoding in our dashboard (required)
     * @param description A description of the encoding (optional)
     */
    createEncoding(name: string, description: string): Promise<Encoding> {
        const encoding = new Encoding({
            name: name,
            description: description
        });

        return this.bitMovinClient.encoding.encodings.create(encoding);
    }

    /**
     * Creates a resource representing an HTTP server providing the input files. For alternative input
     * methods see <a
     * href="https://bitmovin.com/docs/encoding/articles/supported-input-output-storages">list of
     * supported input and output storages</a>
     *
     * <p>For reasons of simplicity, a new input resource is created on each execution of this
     * example. In production use, this method should be replaced by a <a
     * href="https://bitmovin.com/docs/encoding/api-reference/sections/inputs#/Encoding/GetEncodingInputsHttpByInputId">get
     * call</a> to retrieve an existing resource.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/inputs#/Encoding/PostEncodingInputsHttp
     *
     * @param host The hostname or IP address of the HTTP server e.g.: my-storage.biz
     */
    async createHttpInput(host: string): Promise<HttpInput> {
        const input = new HttpInput({
            host: host
        });

        return this.bitMovinClient.encoding.inputs.http.create(input);
    }

    async createS3Input(bucketName: string): Promise<any> {
        const s3Input = new S3Input({
            bucketName: bucketName,
            accessKey: process.env.AWS_ACCESS_KEY_ID,
            secretKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        return this.bitMovinClient.encoding.inputs.s3.create(s3Input);
    }

    /**
     * Creates a resource representing an AWS S3 cloud storage bucket to which generated content will
     * be transferred. For alternative output methods see <a
     * href="https://bitmovin.com/docs/encoding/articles/supported-input-output-storages">list of
     * supported input and output storages</a>
     *
     * <p>The provided credentials need to allow <i>read</i>, <i>write</i> and <i>list</i> operations.
     * <i>delete</i> should also be granted to allow overwriting of existings files. See <a
     * href="https://bitmovin.com/docs/encoding/faqs/how-do-i-create-a-aws-s3-bucket-which-can-be-used-as-output-location">creating
     * an S3 bucket and setting permissions</a> for further information
     *
     * <p>For reasons of simplicity, a new output resource is created on each execution of this
     * example. In production use, this method should be replaced by a <a
     * href="https://bitmovin.com/docs/encoding/api-reference/sections/outputs#/Encoding/GetEncodingOutputsS3">get
     * call</a> retrieving an existing resource.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/outputs#/Encoding/PostEncodingOutputsS3
     *
     * @param bucketName The name of the S3 bucket
     * @param accessKey The access key of your S3 account
     * @param secretKey The secret key of your S3 account
     */
    async createS3Output(bucketName: string): Promise<S3Output> {
        const s3Output = new S3Output({
            bucketName: bucketName,
            accessKey: process.env.AWS_ACCESS_KEY_ID,
            secretKey:  process.env.AWS_SECRET_ACCESS_KEY
        });

        return this.bitMovinClient.encoding.outputs.s3.create(s3Output);
    }
    /**
     * Creates a configuration for the H.264 video codec to be applied to video streams.
     *
     * <p>The output resolution is defined by setting the height to 1080 pixels. Width will be
     * determined automatically to maintain the aspect ratio of your input video.
     *
     * <p>To keep things simple, we use a quality-optimized VoD preset configuration, which will apply
     * proven settings for the codec. See <a
     * href="https://bitmovin.com/docs/encoding/tutorials/how-to-optimize-your-h264-codec-configuration-for-different-use-cases">How
     * to optimize your H264 codec configuration for different use-cases</a> for alternative presets.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/configurations#/Encoding/PostEncodingConfigurationsVideoH264
     *
     * @param width The width of the output video
     * @param height The height of the output video
     * @param bitrate The target bitrate of the output video
     */
    async createH264VideoConfig(width: number, height: number, bitrate: number): Promise<H264VideoConfiguration> {
        const config = new H264VideoConfiguration({
            name: `H.264 ${height}p ${Math.round(bitrate / 1000)} Kbit/s`,
            presetConfiguration: PresetConfiguration.VOD_STANDARD,
            height: height,
            width: width,
            bitrate: bitrate
        });

        return this.bitMovinClient.encoding.configurations.video.h264.create(config);
    }

    /**
     * Creates a configuration for the AAC audio codec to be applied to audio streams.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/configurations#/Encoding/PostEncodingConfigurationsAudioAac
     *
     * @param bitrate The target bitrate for the encoded audio
     */
    async createAacAudioConfig(bitrate: number): Promise<AacAudioConfiguration> {
        const config = new AacAudioConfiguration({
            name: `AAC ${Math.round(bitrate / 1000)} kbit/s`,
            bitrate: bitrate
        });

        return this.bitMovinClient.encoding.configurations.audio.aac.create(config);
    }

    /**
     * Adds a video or audio stream to an encoding
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/encodings#/Encoding/PostEncodingEncodingsStreamsByEncodingId
     *
     * @param encoding The encoding to which the stream will be added
     * @param input The input resource providing the input file
     * @param inputPath The path to the input file
     * @param codecConfiguration The codec configuration to be applied to the stream
     */
    async createStream(
        encoding: Encoding,
        input: Input,
        inputPath: string,
        codecConfiguration: CodecConfiguration
    ): Promise<Stream> {
        const streamInput = new StreamInput({
            inputId: input.id,
            inputPath: inputPath,
            selectionMode: StreamSelectionMode.AUTO
        });

        const stream = new Stream({
            inputStreams: [streamInput],
            codecConfigId: codecConfiguration.id
        });

        return this.bitMovinClient.encoding.encodings.streams.create(encoding.id!, stream);
    }

    /**
     * Creates a fragmented MP4 muxing. This will generate segments with a given segment length for
     * adaptive streaming.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/all#/Encoding/PostEncodingEncodingsMuxingsFmp4ByEncodingId
     *
     * @param encoding The encoding where to add the muxing to
     * @param output The output that should be used for the muxing to write the segments to
     * @param outputPath The output path where the fragmented segments will be written to
     * @param stream The stream that is associated with the muxing
     */
    async createFmp4Muxing(encoding: Encoding, output: Output, outputPath: string, stream: Stream): Promise<Fmp4Muxing> {
        const muxing = new Fmp4Muxing({
            segmentLength: 4.0,
            outputs: [this.buildEncodingOutput(output, outputPath)],
            streams: [new MuxingStream({ streamId: stream.id })]
        });

        return this.bitMovinClient.encoding.encodings.muxings.fmp4.create(encoding.id!, muxing);
    }

    buildEncodingOutput(output: Output, outputPath: string): EncodingOutput {
        const aclEntry = new AclEntry({
            permission: AclPermission.PUBLIC_READ
        });

        return new EncodingOutput({
            outputPath: outputPath,
            outputId: output.id,
            acl: [aclEntry]
        });
    }

    /**
     * Creates a DASH default manifest that automatically includes all representations configured in
     * the encoding.
     *
     * <p>API endpoint:
     * https://bitmovin.com/docs/encoding/api-reference/sections/manifests#/Encoding/PostEncodingManifestsDash
     *
     * @param encoding The encoding for which the manifest should be generated
     * @param output The output to which the manifest should be written
     * @param outputPath The path to which the manifest should be written
     */
    async createDefaultDashManifest(
        encoding: Encoding,
        output: Output,
        outputPath: string
    ): Promise<DashManifest> {
        let dashManifestDefault = new DashManifestDefault({
            encodingId: encoding.id,
            manifestName: 'stream.mpd',
            version: DashManifestDefaultVersion.V1,
            outputs: [this.buildEncodingOutput(output, outputPath)]
        });
        
        return await this.bitMovinClient.encoding.manifests.dash.default.create(dashManifestDefault);
    }

    async createDefaultHlsManifest(encoding: Encoding, output: Output, outputPath: string): Promise<HlsManifest> {
        let hlsManifestDefault = new HlsManifestDefault({
            encodingId: encoding.id,
            outputs: [this.buildEncodingOutput(output, outputPath)],
            name: 'master.m3u8',
            manifestName: 'master.m3u8',
            version: HlsManifestDefaultVersion.V1
        });

        return await this.bitMovinClient.encoding.manifests.hls.default.create(hlsManifestDefault);
    }

    buildManifestResource(manifest: Manifest) {
        return new ManifestResource({
            manifestId: manifest.id
        });
    }
    
    logTaskErrors(task: Task): void {
        if (task.messages == undefined) {
            return;
        }
        task.messages!.filter(msg => msg.type === MessageType.ERROR).forEach(msg => console.error(msg.text));
    }

    timeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Starts the actual encoding process and periodically polls its status until it reaches a final
     * state
     *
     * <p>API endpoints:
     * https://bitmovin.com/docs/encoding/api-reference/all#/Encoding/PostEncodingEncodingsStartByEncodingId
     * https://bitmovin.com/docs/encoding/api-reference/sections/encodings#/Encoding/GetEncodingEncodingsStatusByEncodingId
     *
     * <p>Please note that you can also use our webhooks API instead of polling the status. For more
     * information consult the API spec:
     * https://bitmovin.com/docs/encoding/api-reference/sections/notifications-webhooks
     *
     * @param encoding The encoding to be started
     * @param startEncodingRequest The request object to be sent with the start call
     */
    async executeEncoding(encoding: Encoding, startEncodingRequest: StartEncodingRequest): Promise<void> {
        await this.bitMovinClient.encoding.encodings.start(encoding.id!, startEncodingRequest);

        let task: Task;
        do {
            await this.timeout(5000);
            task = await this.bitMovinClient.encoding.encodings.status(encoding.id!);
            console.log(`Encoding status is ${task.status} (progress: ${task.progress} %)`);
        } while (task.status !== Status.FINISHED && task.status !== Status.ERROR);

        if (task.status === Status.ERROR) {
            this.logTaskErrors(task);
            throw new Error('Encoding failed');
        }

        console.log('Encoding finished successfully');
    }
}

export default BitMovinEncode;