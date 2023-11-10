import React from 'react'
import { UploaderContext } from '../context/UploadContext';

const Uploader = () => {
    // const [file, setFile] = React.useState<File | null>(null);
    const { uploadClient, file, setFile } = React.useContext(UploaderContext);

    const onInputChange = (e) => {
        const file = e.target.files && e.target.files[0];
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