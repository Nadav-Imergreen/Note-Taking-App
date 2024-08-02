import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';

const AddNoteForm = () => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Personal');
    const { addNote } = useNotes();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addNote(content, category);
        setContent('');
        setCategory('Personal');
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-5">
            <div className="form-group mb-3">
                <label htmlFor="note-content">New Note:</label>
                <input
                    type="text"
                    id="note-content"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="note-category">Category:</label>
                <select
                    id="note-category"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Note</button>
        </form>
    );
};

export default AddNoteForm;
