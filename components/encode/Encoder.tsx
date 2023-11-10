'use client'
import React from 'react'
import { UploaderContext } from '../context/UploadContext';

const Encoder = () => {
    const { file } = React.useContext(UploaderContext);

    const encode = async () => {
        if (file) {
            await fetch("/api/encode", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: file.name
                })
            })
        }
        else {
            console.log("file not uploaded yet in this session")
        }
    }

    return (
        <button
            onClick={encode}
        >
            encode
        </button>
    )
}

export default Encoder