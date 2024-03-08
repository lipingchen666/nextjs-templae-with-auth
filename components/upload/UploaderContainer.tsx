'use client';
import React from 'react';
import { UploadClientProvider } from '../context/UploadContext';
import Uploader from './Uploader';
import Encoder from '../encode/Encoder';
import { MediaAnalyzerProvider } from '../context/MediaAnalyzer';

const UploaderContainer = () => {
  return (
    <UploadClientProvider>
      <MediaAnalyzerProvider>
        <Uploader />
        <Encoder />
      </MediaAnalyzerProvider>
    </UploadClientProvider>
  )
}

export default UploaderContainer