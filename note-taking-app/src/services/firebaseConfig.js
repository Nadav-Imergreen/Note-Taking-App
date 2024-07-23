// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCM2QQ2-PSPyTKD5pUYgKVeYMsJYVhMMtA",
    authDomain: "note-taking-app-601d8.firebaseapp.com",
    projectId: "note-taking-app-601d8",
    storageBucket: "note-taking-app-601d8.appspot.com",
    messagingSenderId: "378348475623",
    appId: "1:378348475623:web:8a0a5e34889fb3d49abe42",
    measurementId: "G-3BLBN8DYK5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);