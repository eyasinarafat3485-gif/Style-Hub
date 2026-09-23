// Centralized API Base URL Configuration for StyleHub

const getApiBaseUrl = () => {
  // 1. Check if running in browser on localhost/local network
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local');

    if (isLocal) {
      return (
        (typeof import.meta !== 'undefined' &&
          import.meta.env &&
          import.meta.env.VITE_API_URL) ||
        'http://localhost:5000/api'
      );
    }
  }

  // 2. If explicitly configured in production environment variables with a live domain
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_URL &&
    !import.meta.env.VITE_API_URL.includes('localhost') &&
    !import.meta.env.VITE_API_URL.includes('127.0.0.1')
  ) {
    return import.meta.env.VITE_API_URL;
  }

  // 3. Live backend API on Vercel
  return 'https://style-hub-server-psi.vercel.app/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
