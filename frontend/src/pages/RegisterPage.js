import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import AuthForm from "../components/AuthForm";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleRegister = async (username, password) => {
    try {
      await register(username, password);
      setSuccess("Registration successful! Redirecting to login...");
      setError(null);
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (error) {
      let message = error.response?.data?.message;
      setError(`${message || "Registration failed"}. Please try again.`);
      setSuccess(null);
      console.error("Registration failed");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <AuthForm handleSubmit={handleRegister} buttonText="Register" />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
