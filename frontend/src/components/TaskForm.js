import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const TaskForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const due_date = dueDate && dueTime ? `${dueDate} ${dueTime}:00` : dueDate;
    handleSubmit({ title, description, status, due_date });
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setDueDate("");
    setDueTime("");
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="mb-4 text-white bg-primary border rounded border-4 border-dark p-3"
    >
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formStatus">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formDueDate">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formDueTime">
        <Form.Label>Due Time</Form.Label>
        <Form.Control
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="btn btn-outline-dark">
        Add Task
      </Button>
    </Form>
  );
};

export default TaskForm;
