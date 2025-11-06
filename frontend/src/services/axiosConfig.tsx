import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const getUserById = (id) => api.get(`/users/${id}`);

export default api;