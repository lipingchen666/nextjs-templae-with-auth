'use client';
import s3Upload from '@/lib/client/s3Upload';
import React from 'react';

const page = () => {
    const [file, setFile] = React.useState<File | null>(null);
    const onInputChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setFile(file);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const uploader = new s3Upload();
            //await uploader.multiPartUpload(file);
            await uploader.uploadFile(file, {
                bucket: 'nextjs-template-bucket',
                key: file.name,
            }, (percent) => { console.log(percent)} )
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

export default page