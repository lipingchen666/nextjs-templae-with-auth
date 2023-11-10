import { myContainer } from '@/inversify.config';
import { S3Destination, TYPES, UploadClient } from '@/lib/client/types/upload-manager'
import React from 'react'
import { PropsWithChildren } from 'react'


export const UploaderContext = React.createContext<{ 
    uploadClient: UploadClient<S3Destination>, 
    file: File | null, 
    setFile : ((file: File | null) => void)
}>({ 
    uploadClient: myContainer.get<UploadClient<S3Destination>>(TYPES.UploadClient), 
    file: null, 
    setFile: (file) => {}
})

export const UploadClientProvider = ({
    children,
}: PropsWithChildren) => {
    const [file, setFile] = React.useState<File | null>(null);
    const setFileInContext = React.useCallback((file: File | null ) => {
        setFile(file)
    }, []);

    return (
        <UploaderContext.Provider value={{
            uploadClient: myContainer.get<UploadClient<S3Destination>>(TYPES.UploadClient),
            file: file,
            setFile: setFileInContext,
        }}>
            {children}
        </UploaderContext.Provider>
    );
};