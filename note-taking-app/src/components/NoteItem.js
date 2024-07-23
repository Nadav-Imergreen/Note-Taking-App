import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';

const NoteItem = ({ note }) => {
    const { updateNote, deleteNote } = useNotes();
    const [content, setContent] = useState(note.content);

    const handleUpdate = async () => {
        await updateNote(note.id, content);
    };

    const handleDelete = async () => {
        await deleteNote(note.id);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleUpdate}
                    className="form-control"
                />
                <button onClick={handleDelete} className="btn btn-danger mt-2">Delete</button>
            </div>
        </div>
    );
};

export default NoteItem;
