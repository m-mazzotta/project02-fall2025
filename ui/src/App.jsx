import React, { useState } from 'react';
import './globals.css';
import Notes from './Notes';
import CreateNote from './CreateNote';

const API_URL = 'http://localhost:8000';

export default function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // refreshTrigger - A number that changes when we want to refresh
    // refreshNotes() - Function that increments the trigger
    // Passes refreshTrigger to Notes (so it knows when to refresh)
    // Passes onNoteCreated to CreateNote (callback to call after creating)

    function refreshNotes() {
        setRefreshTrigger((prev) => prev + 1);
    }

    return (
        <>
            <header>
                <h1>My Notes List</h1>
            </header>
            <main>
                <Notes API_URL={API_URL} refreshTrigger={refreshTrigger} />
                <CreateNote API_URL={API_URL} onNoteCreated={refreshNotes} />
            </main>
        </>
    );
}
