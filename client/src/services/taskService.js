import axios from 'axios';

const API_BASE_URL = '/api/tasks';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getAllTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);

    const response = await api.get(`?${params.toString()}`);
    return response.data;
  },

  async getTaskById(id) {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  async getActivityLogs(taskId = null) {
    const params = taskId ? `?taskId=${taskId}` : '';
    const response = await api.get(`/logs/activity${params}`);
    return response.data;
  },
};

