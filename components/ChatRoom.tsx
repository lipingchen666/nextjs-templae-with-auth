'use client';
import firebaseDb from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import React from 'react'

const ChatRoom = () => {
    const messagesRef = collection(firebaseDb, 'messages');

    // React.useEffect(() => {
    //     async function getMessages() {
    //         const messages = await getDocs(messagesRef);
    //         console.log("messages", messages.docs);
    //     }
    //     getMessages();
    // }, []);

    // const q = query(messagesRef, limit(3));

    const [value, loading, error] =
        useCollection(messagesRef);
    console.log("values", value);
    return (
        <div>
            <p>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Collection: Loading...</span>}
                {value && (
                    <span>
                        Collection:{' '}
                        {value.docs.map((doc) => (
                            <React.Fragment key={doc.id}>
                                {JSON.stringify(doc.data())},{' '}
                            </React.Fragment>
                        ))}
                    </span>
                )}
            </p>
        </div>
    )
}

export default ChatRoom
