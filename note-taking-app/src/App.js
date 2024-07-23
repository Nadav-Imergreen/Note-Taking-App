// src/App.js

import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import { NoteProvider } from './context/NoteContext';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <NoteProvider>
            <div className="App">
                <h1>Note-Taking App</h1>
                {!isAuthenticated ? (
                    <>
                        <RegistrationForm onSuccess={handleLoginSuccess} />
                        <LoginForm onSuccess={handleLoginSuccess} />
                    </>
                ) : (
                    <>
                        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                        <AddNoteForm />
                        <NoteList />
                    </>
                )}
            </div>
        </NoteProvider>
    );
};

export default App;
