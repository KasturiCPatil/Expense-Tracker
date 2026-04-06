import axios from 'axios';

// Automatically detect if VITE_API_URL is provided by Vercel/Render, otherwise fallback to local backend port
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
