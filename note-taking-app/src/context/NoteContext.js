import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig'; // Ensure correct import
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const NoteContext = createContext();

export const useNotes = () => {
    return useContext(NoteContext);
};

export const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const q = query(collection(db, 'users', userId, 'notebooks', 'notebookId', 'notes'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        });

        return () => unsubscribe();
    }, [userId]);

    const addNote = async (content) => {
        if (!userId) return;

        console.log(`${userId} in add note func`);
        const note = {
            content,
            createdAt: new Date()
        };
        await addDoc(collection(db, 'users', userId, 'notebooks', 'notebookId', 'notes'), note);
    };

    const updateNote = async (id, content) => {
        if (!userId) return;

        const noteRef = doc(db, 'users', userId, 'notebooks', 'notebookId', 'notes', id);
        await updateDoc(noteRef, { content });
    };

    const deleteNote = async (id) => {
        if (!userId) return;

        const noteRef = doc(db, 'users', userId, 'notebooks', 'notebookId', 'notes', id);
        await deleteDoc(noteRef);
    };

    if (!userId) {
        return null; // or a loading spinner if you prefer
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
            {children}
        </NoteContext.Provider>
    );
};
