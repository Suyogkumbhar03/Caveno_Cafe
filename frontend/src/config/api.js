// Dynamic API Base URL Configuration for Development & Production (Render / Vercel)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Production fallback vs local development fallback
  if (import.meta.env.PROD) {
    return 'https://caveno-backend.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
