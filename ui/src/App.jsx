import React, { useState } from 'react';
import './globals.css';
import Notes from './Notes';
import CreateNote from './CreateNote';

// Use environment variable for API URL, default to localhost for development
// In production (Railway), this will be empty string since frontend and backend are same origin
// Check if VITE_API_URL is explicitly set (even if empty string), otherwise use localhost
const API_URL =
    import.meta.env.VITE_API_URL !== undefined
        ? import.meta.env.VITE_API_URL // address for production architecture
        : 'http://localhost:8000'; // address for local architecture

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
                <h1>My Notes List!</h1>
            </header>
            <main>
                <Notes API_URL={API_URL} refreshTrigger={refreshTrigger} />
                <CreateNote API_URL={API_URL} onNoteCreated={refreshNotes} />
            </main>
        </>
    );
}
