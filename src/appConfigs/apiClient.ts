import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://127.0.0.1:8081', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
