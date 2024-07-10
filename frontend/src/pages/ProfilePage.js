import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { updateProfile } from "../services/api";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const token = localStorage.getItem("token");
      await updateProfile(formData, token);
      setError(null);
    } catch (error) {
      setError("Failed to update profile.");
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Profile</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar">
              <Form.Label>Avatar</Form.Label>
              <Form.Control type="file" onChange={handleAvatarChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
