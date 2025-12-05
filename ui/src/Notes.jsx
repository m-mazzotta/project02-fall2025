import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
            {noteList.map((note) => (
                <Card key={note.id} style={{ width: 350 }}>
                    <div>
                        <h3>{note.title}</h3>
                        <p>{note.description}</p>
                        <p>
                            <b>Note By</b> {note.name}
                        </p>
                        <img
                            className="noteImage"
                            src={note.img_url}
                            alt="note"
                        />
                    </div>
                    <Button
                        type="primary"
                        className="delbutton"
                        onClick={() => deleteNote(note.id)}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                </Card>
            ))}
        </div>
    );
}
