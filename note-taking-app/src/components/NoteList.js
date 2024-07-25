import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';

const NoteList = () => {
    const { notes, updateNote, deleteNote } = useNotes();
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditContent(note.content);
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
        setEditContent('');
    };

    const handleEdit = async (id) => {
        await updateNote(id, editContent);
        cancelEditing();
    };

    return (
        <div>
            <h2>User Notes</h2>
            {notes.length > 0 ? (
                <ul className="list-group">
                    {notes.map((note) => (
                        <li key={note.id} className="list-group-item">
                            {editingNoteId === note.id ? (
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <button onClick={() => handleEdit(note.id)} className="btn btn-primary">Save</button>
                                    <button onClick={cancelEditing} className="btn btn-secondary">Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <p>{note.content}</p>
                                    <button onClick={() => startEditing(note)} className="btn btn-primary">Edit</button>
                                    <button onClick={() => deleteNote(note.id)} className="btn btn-danger">Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notes available</p>
            )}
        </div>
    );
};

export default NoteList;
