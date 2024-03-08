import { myContainer } from '@/inversify.config';
import { TYPES, MediaAnalyzer } from '@/lib/client/types/media-analyzer'
import React from 'react'
import { PropsWithChildren } from 'react'


export const MediaAnalyzerContext = React.createContext<{ 
    mediaAnalyzer: MediaAnalyzer, 
}>({ 
    mediaAnalyzer: myContainer.get<MediaAnalyzer>(TYPES.MediaAnalyzer)
})

export const MediaAnalyzerProvider = ({
    children,
}: PropsWithChildren) => {
    return (
        <MediaAnalyzerContext.Provider value={{
            mediaAnalyzer: myContainer.get<MediaAnalyzer>(TYPES.MediaAnalyzer),
        }}>
            {children}
        </MediaAnalyzerContext.Provider>
    );
};