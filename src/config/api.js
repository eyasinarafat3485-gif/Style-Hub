// Centralized API Base URL Configuration for StyleHub
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocalhost
    ? 'http://localhost:5000/api'
    : 'https://style-hub-server-psi.vercel.app/api');

export default API_BASE_URL;
