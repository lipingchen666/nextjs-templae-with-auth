'use client';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useList } from 'react-firebase-hooks/database';
import { ref, query as rtdbQuery, orderByChild, limitToLast, Query, limitToFirst } from "firebase/database";
import { collection, limit, query } from 'firebase/firestore';
import React from 'react'
import { firebaseDb, firebaseRealTimeDb } from '@/lib/firebase';

const ChatRoom = () => {
    const messagesRef = collection(firebaseDb, 'messages');
    const q = query(messagesRef, limit(2));

    const rtdbMessageRef = ref(firebaseRealTimeDb, 'messages');
    const rtdbQ = rtdbQuery(rtdbMessageRef, limitToFirst(10));

    const [value, loading, error] =
        useCollection(q);

    const [rtdbValue, rtdbLoading, rtdbError] = useList(rtdbQ);

    console.log("rtdbValue", rtdbValue)

    return (
        <div>
            <p>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>firestore Collection: Loading...</span>}
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
            <p>
                {rtdbError && <strong>Error: {rtdbError}</strong>}
                {rtdbLoading && <span>rtdb List: Loading...</span>}
                {!rtdbLoading && rtdbValue && (
                    <React.Fragment>
                        <span>
                            List:{' '}
                            {rtdbValue.map((v) => (
                                <React.Fragment key={v.key}>{JSON.stringify(v.val())}, </React.Fragment>
                            ))}
                        </span>
                    </React.Fragment>
                )}
            </p>
        </div>
    )
}

export default ChatRoom;

