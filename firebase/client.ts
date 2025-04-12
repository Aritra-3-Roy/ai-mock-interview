// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.GOOGLE_API_KEY,
    authDomain: "quantaprep-9015f.firebaseapp.com",
    projectId: "quantaprep-9015f",
    storageBucket: "quantaprep-9015f.firebasestorage.app",
    messagingSenderId: "1091822361183",
    appId: "1:1091822361183:web:426329261d54636bf319ea",
    measurementId: "G-KEMP2S6HX5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);