import React, { useState, useEffect } from 'react';

export default function Notes({ API_URL, refreshTrigger }) {
    // Adds refreshTrigger to useEffect dependencies
    // When refreshTrigger changes, useEffect runs again
    // This calls fetchNotes() to get the latest data

    // useEffect dependencies - Array tells React when to re-run the effect
    // When refreshTrigger changes → useEffect runs → fetchNotes() called → list updates

    const [noteList, setNoteList] = useState([]);

    async function fetchNotes() {
        const response = await fetch(`${API_URL}/notes`);
        const data = await response.json();
        setNoteList(data);
    }

    useEffect(() => {
        fetchNotes();
    }, [refreshTrigger]);

    async function deleteNote(noteId) {
        await fetch(`${API_URL}/notes/${noteId}`, {
            method: 'DELETE',
        });
        // Refresh the list to show the note is gone
        fetchNotes();
    }

    return (
        <div className="notes-container">
            <ul>
                {noteList.map((note) => (
                    <li key={note.id}>
                        <div>
                            {note.title}
                            <br />
                            {note.description}
                            <br />
                            {note.name}
                            <img className='noteImage' src={note.img_url} alt="image" />
                        </div>
                        {/* Add delete button */}
                        <button onClick={() => deleteNote(note.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
