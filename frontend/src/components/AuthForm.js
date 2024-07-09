import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const AuthForm = ({ handleSubmit, buttonText }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }
    setFormError("");
    handleSubmit(username, password);
  };

  return (
    <Form onSubmit={onSubmit}>
      {formError && <div className="alert alert-danger">{formError}</div>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default AuthForm;
