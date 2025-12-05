import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';

export default function CreateNote({ API_URL, onNoteCreated }) {
    // User creates Note → handleSubmit runs
    // POST request succeeds → onNoteCreated() called
    // This calls refreshNotes() in App
    // refreshTrigger increments → Notes’ useEffect runs
    // fetchNotes() called → New list fetched → UI updates!

    const [form] = Form.useForm();

    async function handleSubmit(values) {
        console.log(values);

        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        if (response.ok && onNoteCreated) {
            // Add check for callback
            onNoteCreated(); // Call the callback!
            form.resetFields();
        }
    }

    return (
        <Form
            form={form}
            className="form-container"
            onFinish={handleSubmit}
            layout="vertical"
        >
            <h3>Add a new note!</h3>
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter a title!' }]}
            >
                <Input placeholder="Title" />
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input placeholder="Description" />
            </Form.Item>
            <Form.Item label="Name" name="name">
                <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Image URL" name="img_url">
                <Input placeholder="Image URL" />
            </Form.Item>
            <Button className="createbutton" type="primary" htmlType="submit">
                Create Note
            </Button>
            <div className="side-note">
                The Note list will automatically update after creating a new
                Note!
            </div>
        </Form>
    );
}
