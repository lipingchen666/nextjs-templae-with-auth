'use client';
import React from 'react';
import { UploadClientProvider } from '../context/UploadContext';
import Uploader from './Uploader';

const UploaderContainer = () => {
  return (
    <UploadClientProvider>
        <Uploader />
    </UploadClientProvider>
  )
}

export default UploaderContainer