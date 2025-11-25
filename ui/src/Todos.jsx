import React, { useState, useEffect } from 'react';

export default function Todos({ API_URL, refreshTrigger }) {
    // Adds refreshTrigger to useEffect dependencies
    // When refreshTrigger changes, useEffect runs again
    // This calls fetchTodos() to get the latest data

    // useEffect dependencies - Array tells React when to re-run the effect
    // When refreshTrigger changes → useEffect runs → fetchTodos() called → list updates

    const [todoList, setTodoList] = useState([]);

    async function fetchTodos() {
        const response = await fetch(`${API_URL}/todos`);
        const data = await response.json();
        setTodoList(data);
    }

    useEffect(() => {
        fetchTodos();
    }, [refreshTrigger]);

    async function deleteTodo(todoId) {
        await fetch(`${API_URL}/todos/${todoId}`, {
            method: 'DELETE',
        });
        // Refresh the list to show the todo is gone
        fetchTodos();
    }

    return (
        <div className="todos-container">
            <ul>
                {todoList.map((todo) => (
                    <li key={todo.id}>
                        <div>
                            {todo.completed ? (
                                <span>Completed</span>
                            ) : (
                                <span>In Progress</span>
                            )}{' '}
                            {todo.title}
                            <br />
                            {todo.description}
                        </div>
                        {/* Add delete button */}
                        <button onClick={() => deleteTodo(todo.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
