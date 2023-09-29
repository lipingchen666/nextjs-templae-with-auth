'use client';
import firebaseDb from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, limit, query } from 'firebase/firestore';
import React from 'react'

const ChatRoom = () => {
    const messagesRef = collection(firebaseDb, 'messages');
    const q = query(messagesRef, limit(1));
    const [value, loading, error] =
        useCollection(q);

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
