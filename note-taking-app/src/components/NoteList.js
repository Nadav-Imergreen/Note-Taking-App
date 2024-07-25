import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';

const NoteList = () => {
    const { notes, updateNote, deleteNote, getNoteVersions, revertToVersion } = useNotes();
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [versions, setVersions] = useState([]);

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
        const versions = await getNoteVersions(noteId);
        setVersions(versions);
        setSelectedNoteId(noteId);
    };

    const handleRevertToVersion = async (noteId, versionId) => {
        await revertToVersion(noteId, versionId);
        setVersions([]);
        setSelectedNoteId(null);
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
                                    <button onClick={() => handleViewVersions(note.id)} className="btn btn-info">View Versions</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notes available</p>
            )}
            {selectedNoteId && (
                <div>
                    <h3>Version History</h3>
                    <ul className="list-group">
                        {versions.map((version) => (
                            <li key={version.id} className="list-group-item">
                                <p>{version.content}</p>
                                <button onClick={() => handleRevertToVersion(selectedNoteId, version.id)} className="btn btn-warning">Revert to this version</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NoteList;
