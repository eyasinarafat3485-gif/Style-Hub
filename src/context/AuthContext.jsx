import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('stylehub_cached_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('stylehub_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('stylehub_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('stylehub_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Backend auth check failed (server may be starting or offline):', err.message);
        // If server is offline, keep cached user session if available
        const cachedUser = localStorage.getItem('stylehub_cached_user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (_) { }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Register
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('stylehub_token', data.token);
      localStorage.setItem('stylehub_cached_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('stylehub_token', data.token);
      localStorage.setItem('stylehub_cached_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Google Login / OAuth
  const loginWithGoogle = async (credential, userInfo) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, userInfo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('stylehub_token', data.token);
      localStorage.setItem('stylehub_cached_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('stylehub_token');
    localStorage.removeItem('stylehub_cached_user');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        loginWithGoogle,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
