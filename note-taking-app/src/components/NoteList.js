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
            setShowHistory(false);
            setSelectedNoteId(null);
            setVersions([]);
        } else {
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

    const groupedNotes = notes.reduce((acc, note) => {
        if (!acc[note.category]) {
            acc[note.category] = [];
        }
        acc[note.category].push(note);
        return acc;
    }, {});

    return (
        <div className="container mt-5">
            <h2>User Notes</h2>
            {Object.keys(groupedNotes).length > 0 ? (
                Object.keys(groupedNotes).map((category) => (
                    <div key={category} className="mb-4">
                        <h3>{category}</h3>
                        <ul className="list-group">
                            {groupedNotes[category].map((note) => (
                                <li key={note.id} className="list-group-item mb-3">
                                    {editingNoteId === note.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <button onClick={() => handleEdit(note.id)} className="btn btn-primary mr-2">Save</button>
                                            <button onClick={cancelEditing} className="btn btn-secondary">Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>{note.content}</p>
                                            <button onClick={() => startEditing(note)} className="btn btn-primary mr-2">Edit</button>
                                            <button onClick={() => deleteNote(note.id)} className="btn btn-danger mr-2">Delete</button>
                                            <button onClick={() => handleViewVersions(note.id)} className="btn btn-info">
                                                {selectedNoteId === note.id && showHistory ? 'Hide Versions' : 'View Versions'}
                                            </button>
                                        </div>
                                    )}
                                    {selectedNoteId === note.id && showHistory && (
                                        <div className="mt-3">
                                            <h4>Version History</h4>
                                            {versions.length > 0 ? (
                                                <ul className="list-group">
                                                    {versions.map((version) => (
                                                        <li key={version.id} className="list-group-item mb-2">
                                                            <p>{version.content}</p>
                                                            <button onClick={() => handleRevertToVersion(note.id, version.id)} className="btn btn-warning">
                                                                Revert to this version
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No history to show</p>
                                            )}
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
