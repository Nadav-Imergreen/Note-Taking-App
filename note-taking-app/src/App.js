import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import { NoteProvider } from './context/NoteContext';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {handleSignOut} from "./services/auth";

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
                        <button onClick={() => setShowNotes(!showNotes)} className="btn btn-info">User Notes</button>
                        <AddNoteForm />
                        {showNotes && <NoteList />}
                    </>
                )}
            </div>
        </NoteProvider>
    );
};

export default App;
