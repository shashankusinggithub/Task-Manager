import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Filter from "../components/Filter";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchTasks(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchTasks = async (token) => {
    try {
      const response = await getTasks(token);
      if (response.data) {
        setTasks(response.data);
      } else {
        console.error("Unexpected response data", response.data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleCreateTask = async (task) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await createTask(task, token);
        setTasks([...tasks, { ...task, _id: response.data }]);
      } catch (error) {
        console.error("Failed to create task", error);
      }
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { _id, ...taskData } = updatedTask;
        await updateTask(taskId, taskData, token);
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        );
      } catch (error) {
        console.error("Failed to update task", error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await deleteTask(taskId, token);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "All" || task.status === filter
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <TaskForm handleSubmit={handleCreateTask} />
        </Col>
      </Row>
      <Filter filter={filter} setFilter={setFilter} />
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
