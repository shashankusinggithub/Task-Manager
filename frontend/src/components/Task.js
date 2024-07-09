import React from "react";
import { Card, Button, Form } from "react-bootstrap";

const Task = ({ task, handleDelete, handleUpdate }) => {
  const handleStatusChange = (e) => {
    const updatedTask = { ...task, status: e.target.value };
    handleUpdate(task._id, updatedTask);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title className="display-6">{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={task.status}
            onChange={handleStatusChange}
            className="form-select"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Form.Control>
        </Form.Group>
        <Button variant="danger" onClick={() => handleDelete(task._id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Task;
