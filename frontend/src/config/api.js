/**
 * Centralized API configuration.
 * Uses environment variables with fallback to window.location.origin in production.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Standard headers helper including authentication token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('boardnightToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
