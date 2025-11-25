import React, { useState } from 'react';

export default function CreateTodo({ API_URL, onTodoCreated }) {
    // User creates todo → handleSubmit runs
    // POST request succeeds → onTodoCreated() called
    // This calls refreshTodos() in App
    // refreshTrigger increments → Todos’ useEffect runs
    // fetchTodos() called → New list fetched → UI updates!

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed: false }),
        });

        if (response.ok && onTodoCreated) {
            // Add check for callback
            onTodoCreated(); // Call the callback!
            setTitle('');
            setDescription('');
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
            <button type="submit">Create TODO</button>
            <div className="side-note">
                The todo list will automatically update after creating a new
                todo!
            </div>
        </form>
    );
}
