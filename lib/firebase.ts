import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVwX7fesAmWK4zIwI4nKDpcigdlf2ew-o",
    authDomain: "nextjs-template-chat-app.firebaseapp.com",
    projectId: "nextjs-template-chat-app",
    storageBucket: "nextjs-template-chat-app.appspot.com",
    messagingSenderId: "47307729756",
    appId: "1:47307729756:web:8a7907c42c2f9c89846f99",
    measurementId: "G-K99J6KQQ9H",
    databaseURL: "https://nextjs-template-chat-app-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);
export const firebaseRealTimeDb = getDatabase(app);