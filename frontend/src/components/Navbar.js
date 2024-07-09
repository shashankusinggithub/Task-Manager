import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" className="px-3">
        Task Manager
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className=" px-3">
          {token ? (
            <Nav.Link onClick={handleLogout} className=" align-items-center">
              Logout
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className=" align-items-center">
                <Button variant="outline-light">Login</Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <Button variant="outline-light">Register</Button>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
