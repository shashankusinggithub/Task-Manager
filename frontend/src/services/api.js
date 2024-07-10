import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const register = (username, password) => {
  return axios.post(`${API_URL}/api/auth/register`, { username, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/auth/login`, { username, password });
};

export const getTasks = (token, sort_by = "title", order = "asc") => {
  return axios.get(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      sort_by,
      order,
    },
  });
};

export const searchTasks = (token, { filter, sortBy, order, searchQuery }) => {
  return axios.get(`${API_URL}/api/tasks/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      filter,
      sort_by: sortBy,
      order,
      query: searchQuery,
    },
  });
};

export const createTask = (task, token) => {
  return axios.post(`${API_URL}/api/tasks`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = (taskId, task, token) => {
  return axios.put(`${API_URL}/api/tasks/${taskId}`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTask = (taskId, token) => {
  return axios.delete(`${API_URL}/api/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserProfile = (token) => {
  return axios.get(`${API_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = (formData, token) => {
  return axios.put(`${API_URL}/api/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
