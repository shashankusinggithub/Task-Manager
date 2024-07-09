import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Filter from "../components/Filter";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        try {
          const response = await getTasks(token);
          setTasks(response.data);
        } catch (error) {
          setError("Failed to fetch tasks.");
        }
      } else {
        navigate("/login");
      }
    };
    fetchTasks();
  }, [token]);

  function getErrorMessages(errors) {
    let errorMessages = [];
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((error) => {
          errorMessages.push(`${key}: ${error}`);
        });
      }
    }
    return errorMessages.join(" ");
  }
  const handleCreateTask = async (task) => {
    if (token) {
      try {
        const response = await createTask(task, token);
        setTasks([...tasks, { ...task, _id: response.data }]);
        setError(null);
      } catch (error) {
        setError(getErrorMessages(error.response.data.errors));
      }
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    if (token) {
      try {
        await updateTask(taskId, updatedTask, token);
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        );
        setError(null);
      } catch (error) {
        setError(getErrorMessages(error.response.data.errors));
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (token) {
      try {
        await deleteTask(taskId, token);
        setTasks(tasks.filter((task) => task._id !== taskId));
        setError(null);
      } catch (error) {
        setError("Failed to delete task.");
      }
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "All" || task.status === filter
  );

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col>
          <TaskForm handleSubmit={handleCreateTask} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Filter filter={filter} setFilter={setFilter} />
        </Col>
      </Row>
      <Row>
        <Col>
          <TaskList
            tasks={filteredTasks}
            handleDelete={handleDeleteTask}
            handleUpdate={handleUpdateTask}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
