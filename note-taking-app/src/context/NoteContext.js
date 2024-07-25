import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const NoteContext = createContext();

export const useNotes = () => {
    return useContext(NoteContext);
};

export const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const q = query(collection(db, 'users'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        });

        return () => unsubscribe();
    }, [userId]);

    const addNote = async (content, category) => {
        if (!userId) return;

        const note = {
            userId,
            content,
            category,
            createdAt: new Date()
        };
        const notesRef = collection(db, 'users');
        await addDoc(notesRef, note)
            .then(() => console.log('INFO: User note saved to Firestore'))
            .catch((error) => console.error('WARNING: Error saving user to Firestore:', error));
    };

    const updateNote = async (id, content) => {
        if (!userId) return;

        const noteRef = doc(db, 'users', id);
        await updateDoc(noteRef, { content })
            .then(() => console.log('INFO: User note updated in Firestore'))
            .catch((error) => console.error('WARNING: Error updating user in Firestore:', error));
    };

    const deleteNote = async (id) => {
        if (!userId) return;

        const noteRef = doc(db, 'users', id);
        await deleteDoc(noteRef)
            .then(() => console.log('INFO: User note deleted from Firestore'))
            .catch((error) => console.error('WARNING: Error deleting user from Firestore:', error));
    };

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
            {children}
        </NoteContext.Provider>
    );
};
