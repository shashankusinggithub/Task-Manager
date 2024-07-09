import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";

// Mock the register API function
jest.mock("../services/api", () => ({
  register: jest.fn(() => Promise.resolve()),
}));

const mockRegister = require("../services/api").register;

test("renders registration form", () => {
  render(
    <Router>
      <RegisterPage />
    </Router>
  );

  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getAllByText(/register/i)[1]).toBeInTheDocument();
});

test("displays error message on registration failure", async () => {
  mockRegister.mockImplementationOnce(() =>
    Promise.reject(new Error("Registration failed"))
  );
  render(
    <Router>
      <RegisterPage />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "pass" },
  });
  fireEvent.click(screen.getAllByText(/register/i)[1]);

  await waitFor(() => {
    expect(
      screen.getByText(/registration failed\. please try again\./i)
    ).toBeInTheDocument();
  });
});

test("displays success message on successful registration and redirects", async () => {
  const navigate = jest.fn();
  render(
    <Router>
      <RegisterPage navigate={navigate} />
    </Router>
  );

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "pass" },
  });
  fireEvent.click(screen.getAllByText(/register/i)[1]);

  await waitFor(() => {
    expect(
      screen.getByText(/registration successful! redirecting to login\.\.\./i)
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    setTimeout(() => {
      expect(navigate).toHaveBeenCalledWith("/login");
    }, 3500);
  });
});
