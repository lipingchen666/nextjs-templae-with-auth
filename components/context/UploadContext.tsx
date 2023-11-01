import { myContainer } from '@/inversify.config';
import { S3Destination, TYPES, UploadClient } from '@/lib/client/types/upload-manager'
import React from 'react'
import { PropsWithChildren } from 'react'


export const UploaderContext = React.createContext<{ uploadClient: UploadClient<S3Destination> }>({ uploadClient: myContainer.get<UploadClient<S3Destination>>(TYPES.UploadClient) })

export const UploadClientProvider = ({
    children,
}: PropsWithChildren) => {
    return (
        <UploaderContext.Provider value={{ uploadClient: myContainer.get<UploadClient<S3Destination>>(TYPES.UploadClient) }}>
            {children}
        </UploaderContext.Provider>
    );
};