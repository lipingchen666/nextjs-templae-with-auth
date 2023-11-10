'use client';
import React from 'react';
import { UploadClientProvider } from '../context/UploadContext';
import Uploader from './Uploader';
import Encoder from '../encode/Encoder';

const UploaderContainer = () => {
  return (
    <UploadClientProvider>
        <Uploader />
        <Encoder />
    </UploadClientProvider>
  )
}

export default UploaderContainer