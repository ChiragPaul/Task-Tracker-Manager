import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

export const fetchTasks = async (filters = {}) => {
  const { status, priority, sortBy } = filters;
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (priority && priority !== 'All') params.append('priority', priority);
  if (sortBy) params.append('sortBy', sortBy);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
