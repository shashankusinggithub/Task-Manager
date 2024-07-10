import axios from "axios";

let API_URL = process.env.REACT_APP_API_URL;
if (process.env.REACT_APP_NODE_ENV === "production") {
  API_URL = "";
}

export const register = (username, password) => {
  return axios.post(`${API_URL}/api/auth/register`, { username, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/auth/login`, { username, password });
};

export const getTasks = (token) => {
  return axios.get(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchTasks = (token, query) => {
  return axios.get(`${API_URL}/api/tasks/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
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
  console.log(task);
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
