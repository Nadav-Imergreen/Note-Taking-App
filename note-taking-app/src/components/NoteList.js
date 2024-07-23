import React from 'react';
import { useNotes } from '../context/NoteContext';
import NoteItem from './NoteItem';

const NoteList = () => {
    const { notes } = useNotes();

    return (
        <div>
            {notes.map(note => (
                <NoteItem key={note.id} note={note} />
            ))}
        </div>
    );
};

export default NoteList;
