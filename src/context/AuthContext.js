import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Determine role from token or stored role
        const role = token === 'demo-admin-token' ? 'admin' : (userData.role || 'employee');
        setUser({ ...userData, role, token });
      } catch (err) {
        console.error('Failed to parse stored user', err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token, role) => {
    const fullUser = { ...userData, role, token };
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(fullUser));
    if (role === 'admin') localStorage.setItem('role', 'admin');
    setUser(fullUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    setUser(null);
  };

  const register = (userData) => {
    // Store registered user for later login
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    // Optionally auto-login after registration
    // For your flow, you might want to redirect to login page instead
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};