import React, { useState } from 'react';

export default function CreateNote({ API_URL, onNoteCreated }) {
    // User creates Note → handleSubmit runs
    // POST request succeeds → onNoteCreated() called
    // This calls refreshNotes() in App
    // refreshTrigger increments → Notes’ useEffect runs
    // fetchNotes() called → New list fetched → UI updates!

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [img_url, setImgURL] = useState('');




    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, name, img_url }),
        });

        if (response.ok && onNoteCreated) {
            // Add check for callback
            onNoteCreated(); // Call the callback!
            setTitle('');
            setDescription('');
            setName('');
            setImgURL('');


        }
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

              <input
                type="text"
                placeholder="Image URL"
                value={img_url}
                onChange={(e) => setImgURL(e.target.value)}
            />

            <button type="submit">Create Note</button>
            <div className="side-note">
                The Note list will automatically update after creating a new
                Note!
            </div>
        </form>
    );
}
