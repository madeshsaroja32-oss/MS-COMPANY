import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import '../../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [locationStatus, setLocationStatus] = useState('prompt');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
    } else {
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus('granted'),
        () => setLocationStatus('denied')
      );
    }
  }, []);

  // Quick admin demo (optional – uses localStorage, not backend)
  const getAdminCredentials = () => {
    const stored = localStorage.getItem('adminCredentials');
    if (stored) return JSON.parse(stored);
    return { email: 'admin@mscompany.com', password: 'admin123' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Admin demo login (bypasses backend)
    const adminCreds = getAdminCredentials();
    if (email === adminCreds.email && password === adminCreds.password) {
      const adminData = { name: 'Administrator', email: adminCreds.email, role: 'admin' };
      login(adminData, 'admin-token', 'admin');
      navigate('/admin');
      return;
    }

    // Normal employee login via backend
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      login(user, token, user.role);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password');
    }
  };

  const handleDirectAdminLogin = () => {
    const adminCreds = getAdminCredentials();
    const adminData = { name: 'Administrator', email: adminCreds.email, role: 'admin' };
    login(adminData, 'admin-token', 'admin');
    navigate('/admin');
  };

  return (
    <div className="page">
      <div className="header">
        <h2>MS COMPANY</h2>
        <h2>Employee Management System</h2>
        <p>WELCOME TO OUR COMPANY</p>
      </div>

      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div style={{ marginBottom: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
          {locationStatus === 'prompt' && <p>Requesting location...</p>}
          {locationStatus === 'granted' && <p style={{ color: 'green' }}>✓ Location granted</p>}
          {locationStatus === 'denied' && <p style={{ color: 'red' }}>✗ Location denied (login still works)</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div style={{ position: 'relative' }}>
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '50px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '-125px', top: '25px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit">Next</button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDirectAdminLogin}
            style={{
              background: '#4a6cf7',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
              fontWeight: '500'
            }}
          >
            🔐 Admin Login
          </button>
        </div>

        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;