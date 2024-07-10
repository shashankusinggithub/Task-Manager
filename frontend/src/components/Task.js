import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useState } from "react";
import {
  formatDistanceToNow,
  parseISO,
  isPast,
  isWithinInterval,
  addDays,
} from "date-fns";

const Task = ({ task, handleDelete, handleUpdate }) => {
  const initialDueDate = task.due_date
    ? parseISO(task.due_date).toISOString().substr(0, 10)
    : "";
  const initialDueTime = task.due_date
    ? parseISO(task.due_date).toISOString().substr(11, 3)
    : "";

  const [dueDate, setDueDate] = useState(initialDueDate);
  const [dueTime, setDueTime] = useState(initialDueTime);

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
    const updatedDate = `${e.target.value} ${dueTime}`;
    handleUpdate(task._id, { ...task, due_date: updatedDate });
  };

  const handleDueTimeChange = (e) => {
    setDueTime(e.target.value);
    const updatedDate = `${dueDate} ${e.target.value}`;
    handleUpdate(task._id, { ...task, due_date: updatedDate });
  };

  const getCardColor = () => {
    if (!task.due_date) return "light";
    const dueDate = parseISO(task.due_date);
    const now = new Date();
    if (isPast(dueDate)) return "danger";
    if (isWithinInterval(now, { start: dueDate, end: addDays(dueDate, 3) }))
      return "warning";
    return "success";
  };

  return (
    <Card bg={getCardColor()} text="white" className="mb-3">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>Status: {task.status}</Card.Text>
        <Card.Text>
          Due Date:{" "}
          {task.due_date
            ? formatDistanceToNow(parseISO(task.due_date))
            : "No due date set"}
        </Card.Text>
        <Form.Group controlId="formDueDate">
          <Form.Label>Update Due Date</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
          />
        </Form.Group>
        <Form.Group controlId="formDueTime">
          <Form.Label>Update Due Time</Form.Label>
          <Form.Control
            type="time"
            value={dueTime}
            onChange={handleDueTimeChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => handleUpdate(task._id, { ...task, status: "To Do" })}
          className="mr-2"
        >
          Mark To Do
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            handleUpdate(task._id, { ...task, status: "In Progress" })
          }
          className="mr-2"
        >
          Mark In Progress
        </Button>
        <Button
          variant="primary"
          onClick={() => handleUpdate(task._id, { ...task, status: "Done" })}
          className="mr-2"
        >
          Mark Done
        </Button>
        <Button variant="danger" onClick={() => handleDelete(task._id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Task;
