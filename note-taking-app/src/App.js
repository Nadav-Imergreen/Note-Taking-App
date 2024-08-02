import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import { NoteProvider } from './context/NoteContext';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { handleSignOut } from './services/auth';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        handleSignOut();
        setIsAuthenticated(false);
        setShowNotes(false);
    };

    return (
        <NoteProvider>
            <div className="App container mt-5">
                <h1 className="mb-4">Note-Taking App</h1>
                {!isAuthenticated ? (
                    <>
                        <div className="mb-4">
                            <RegistrationForm onSuccess={handleLoginSuccess} />
                        </div>
                        <div className="mb-4">
                            <LoginForm onSuccess={handleLoginSuccess} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <button onClick={handleLogout} className="btn btn-secondary mr-2">Logout</button>
                            <button onClick={() => setShowNotes(!showNotes)} className="btn btn-info">
                                {showNotes ? 'Hide Notes' : 'Notes'}
                            </button>
                        </div>
                        <div className="mb-4">
                            <AddNoteForm />
                        </div>
                        {showNotes && <NoteList />}
                    </>
                )}
            </div>
        </NoteProvider>
    );
};

export default App;
