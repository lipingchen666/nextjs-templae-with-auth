import React from 'react';
import { FFprobeWorker } from "ffprobe-wasm";
import { UploaderContext } from '../context/UploadContext';
import { MediaAnalyzerContext } from '../context/MediaAnalyzer';

const Uploader = () => {
    // const [file, setFile] = React.useState<File | null>(null);
    const { uploadClient, file, setFile } = React.useContext(UploaderContext);
    const { mediaAnalyzer } = React.useContext(MediaAnalyzerContext);

    const onInputChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        // const worker = new FFprobeWorker();
        // const fileInfo = await worker.getFileInfo(file);
        const fileInfo = await mediaAnalyzer.getFileTotalInfo(file);
        console.log("fileInfo", fileInfo);
        setFile(file);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            await uploadClient.uploadFile(file, {
                bucket: 'nextjs-template-bucket',
                key: file.name,
            }, (percent) => { console.log(percent) })
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                className=""
                onChange={onInputChange} id="fileSelect" type="file"
                name="file"
            />
            <button type="submit">
                submit
            </button>
        </form>
    )
}

export default Uploader;