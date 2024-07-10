import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import AuthForm from "../components/AuthForm";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      localStorage.setItem("token", response.data.access_token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError("Login failed. Please check your username and password.");
      console.error("Login failed", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <AuthForm handleSubmit={handleLogin} buttonText="Login" />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
