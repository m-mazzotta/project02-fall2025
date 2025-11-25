import React, { useState } from 'react';
import './globals.css';
import Todos from './Todos';
import CreateTodo from './CreateTodo';

const API_URL = 'http://localhost:8000';

export default function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // refreshTrigger - A number that changes when we want to refresh
    // refreshTodos() - Function that increments the trigger
    // Passes refreshTrigger to Todos (so it knows when to refresh)
    // Passes onTodoCreated to CreateTodo (callback to call after creating)

    function refreshTodos() {
        setRefreshTrigger((prev) => prev + 1);
    }

    return (
        <>
            <header>
                <h1>TODO List</h1>
            </header>
            <main>
                <Todos API_URL={API_URL} refreshTrigger={refreshTrigger} />
                <CreateTodo API_URL={API_URL} onTodoCreated={refreshTodos} />
            </main>
        </>
    );
}
