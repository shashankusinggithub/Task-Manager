import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBox from "../components/Filter";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
} from "../services/api";
import { json, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        try {
          const response = await getTasks(token, sortBy, order);
          let data = response.data;
          setTasks(data);
        } catch (error) {
          setError("Failed to fetch tasks.");
          if (error.response.data.msg === "Token has expired") {
            localStorage.clear();
            navigate("/login");
          }
        }
      }
    };
    fetchTasks();
  }, [token, sortBy, order]);

  function getErrorMessages(errors) {
    let errorMessages = [];
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((error) => {
          errorMessages.push(`${key}: ${error}`);
        });
      }
    }
    return errorMessages.join("\n");
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

  const handleSearch = async ({ filter, sortBy, order, searchQuery }) => {
    if (token) {
      try {
        const response = await searchTasks(token, {
          filter,
          sortBy,
          order,
          searchQuery,
        });
        setTasks(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to search tasks.");
      }
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "All" || task.status === filter
  );

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mt-4">
        <Col md={8}>
          <FilterBox
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          <TaskList
            tasks={filteredTasks}
            handleDelete={handleDeleteTask}
            handleUpdate={handleUpdateTask}
          />
        </Col>
        <Col md={4}>
          <TaskForm handleSubmit={handleCreateTask} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
