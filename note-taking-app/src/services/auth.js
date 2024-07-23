// src/authFunctions.js

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};


export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('INFO: User signed in: userID: ', user.uid);
        return user;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

export const handleSignOut = () => {
    signOut(auth).catch((error) => console.error('WARNING: Sign out error:', error.message));
};

export const deleteUserAccount = () => {
    deleteUser(auth.currentUser).catch((error) => console.error('WARNING: Delete user account:', error.message));
};
