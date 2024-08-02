import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';

const NoteList = () => {
    const { notes, updateNote, deleteNote, getNoteVersions, revertToVersion } = useNotes();
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [versions, setVersions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

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

    const handleViewVersions = async (noteId) => {
        if (selectedNoteId === noteId && showHistory) {
            // If clicking the same note and history is already shown, hide it
            setShowHistory(false);
            setSelectedNoteId(null);
            setVersions([]);
        } else {
            // Else, show history for the new note
            const versions = await getNoteVersions(noteId);
            setShowHistory(true);
            setSelectedNoteId(noteId);
            setVersions(versions);
        }
    };

    const handleRevertToVersion = async (noteId, versionId) => {
        await revertToVersion(noteId, versionId);
        setVersions([]);
        setSelectedNoteId(null);
        setShowHistory(false);
    };

    // Group notes by category
    const groupedNotes = notes.reduce((acc, note) => {
        if (!acc[note.category]) {
            acc[note.category] = [];
        }
        acc[note.category].push(note);
        return acc;
    }, {});

    return (
        <div>
            <h2>User Notes</h2>
            {Object.keys(groupedNotes).length > 0 ? (
                Object.keys(groupedNotes).map((category) => (
                    <div key={category}>
                        <h3>{category}</h3>
                        <ul className="list-group">
                            {groupedNotes[category].map((note) => (
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
                                            <button onClick={() => handleViewVersions(note.id)} className="btn btn-info">
                                                {selectedNoteId === note.id && showHistory ? 'Hide Versions' : 'View Versions'}
                                            </button>
                                        </div>
                                    )}
                                    {selectedNoteId === note.id && showHistory && (
                                        <div>
                                            <h4>Version History</h4>
                                            <ul className="list-group">
                                                {versions.map((version) => (
                                                    <li key={version.id} className="list-group-item">
                                                        <p>{version.content}</p>
                                                        <button onClick={() => handleRevertToVersion(note.id, version.id)} className="btn btn-warning">
                                                            Revert to this version
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No notes available</p>
            )}
        </div>
    );
};

export default NoteList;
