import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

// Mock the login API function
jest.mock("../services/api", () => ({
  login: jest.fn(() =>
    Promise.resolve({ data: { access_token: "fake-token" } })
  ),
}));

const mockLogin = require("../services/api").login;

test("renders login form", () => {
  render(
    <Router>
      <LoginPage />
    </Router>
  );

  expect(screen.getByLabelText("Username")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getAllByText("Login")[0]).toBeInTheDocument();
});

test("displays error message on login failure", async () => {
  mockLogin.mockImplementationOnce(() =>
    Promise.reject(new Error("Login failed"))
  );
  render(
    <Router>
      <LoginPage />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "pass" },
  });
  fireEvent.click(screen.getAllByText(/Login/i)[1]);

  await waitFor(() => {
    expect(
      screen.getByText(
        /login failed\. please check your username and password\./i
      )
    ).toBeInTheDocument();
  });
});

test("redirects on successful login", async () => {
  const navigate = jest.fn();
  render(
    <Router>
      <LoginPage navigate={navigate} />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "pass" },
  });
  fireEvent.click(screen.getAllByText(/Login/i)[1]);

  setTimeout(() => {
    expect(navigate).toHaveBeenCalledWith("/");
  }, 3500);
});
