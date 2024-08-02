import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';

export const NoteContext = createContext();

export const useNotes = () => {
    return useContext(NoteContext);
};

export const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const notesRef = collection(db, 'notes');
        const unsubscribe = onSnapshot(notesRef, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addNote = async (content, category) => {
        const note = {
            content,
            category,
            createdAt: new Date()
        };
        const notesRef = collection(db, 'notes');
        await addDoc(notesRef, note)
            .then(() => console.log('INFO: Note saved to Firestore'))
            .catch((error) => console.error('WARNING: Error saving note to Firestore:', error));
    };

    const updateNote = async (id, content) => {
        const noteRef = doc(db, 'notes', id);
        const noteSnapshot = await getDoc(noteRef);
        if (noteSnapshot.exists()) {
            const noteData = noteSnapshot.data();
            const versionRef = collection(noteRef, 'versions');
            await addDoc(versionRef, {
                ...noteData,
                versionTimestamp: new Date()
            });
        }

        await updateDoc(noteRef, { content })
            .then(() => console.log('INFO: Note updated in Firestore'))
            .catch((error) => console.error('WARNING: Error updating note in Firestore:', error));
    };

    const deleteNote = async (id) => {
        const noteRef = doc(db, 'notes', id);
        await deleteDoc(noteRef)
            .then(() => console.log('INFO: Note deleted from Firestore'))
            .catch((error) => console.error('WARNING: Error deleting note from Firestore:', error));
    };

    const getNoteVersions = async (noteId) => {
        const noteRef = doc(db, 'notes', noteId);
        const versionRef = collection(noteRef, 'versions');
        const versionSnapshot = await getDocs(versionRef);

        return versionSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    const revertToVersion = async (noteId, versionId) => {
        const noteRef = doc(db, 'notes', noteId);
        const versionRef = doc(noteRef, 'versions', versionId);
        const versionSnapshot = await getDoc(versionRef);

        if (versionSnapshot.exists()) {
            const versionData = versionSnapshot.data();
            const currentNoteSnapshot = await getDoc(noteRef);
            if (currentNoteSnapshot.exists()) {
                const currentNoteData = currentNoteSnapshot.data();
                const versionCollectionRef = collection(noteRef, 'versions');
                await addDoc(versionCollectionRef, {
                    ...currentNoteData,
                    versionTimestamp: new Date()
                });
            }

            await updateDoc(noteRef, {
                content: versionData.content,
                category: versionData.category,
                createdAt: versionData.createdAt,
                updatedAt: new Date()
            });

            await deleteDoc(versionRef);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNoteVersions, revertToVersion }}>
            {children}
        </NoteContext.Provider>
    );
};
