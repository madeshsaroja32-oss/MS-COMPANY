import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

  // Get admin credentials from localStorage (or use defaults)
  const getAdminCredentials = () => {
    const stored = localStorage.getItem('adminCredentials');
    if (stored) {
      return JSON.parse(stored);
    }
    // Default admin credentials (you can change these)
    return { email: 'admin@mscompany.com', password: 'admin123' };
  };

  // Regular login (employee or admin)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Check if it's admin login
    const adminCreds = getAdminCredentials();
    if (email === adminCreds.email && password === adminCreds.password) {
      // Admin login
      const adminData = {
        name: 'Administrator',
        email: adminCreds.email,
        role: 'admin'
      };
      login(adminData, 'admin-token', 'admin');
      navigate('/admin');
      return;
    }

    // 2. Otherwise, check employee (registered user)
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
    if (!registeredUser) {
      setError('No registered user found. Please register first.');
      return;
    }

    if (email === registeredUser.email && password === registeredUser.password) {
      const userData = {
        name: registeredUser.name,
        email: registeredUser.email,
        phone: registeredUser.phone,
        department: registeredUser.department,
        position: registeredUser.position,
        photo: registeredUser.photo,
        role: 'employee'
      };
      login(userData, 'mock-user-token', 'employee');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  // Auto‑fill admin credentials and submit
  const handleAutoAdminLogin = () => {
    const adminCreds = getAdminCredentials();
    setEmail(adminCreds.email);
    setPassword(adminCreds.password);
    // Small delay to let state update, then submit
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }, 50);
  };

  // One‑click admin demo (bypasses form – uses the same admin credentials but directly)
  const demoAdminLogin = () => {
    const adminCreds = getAdminCredentials();
    const adminData = {
      name: 'Administrator',
      email: adminCreds.email,
      role: 'admin'
    };
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
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight: '50px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer' }}>{showPassword ? '🙈' : '👁️'}</button>
          </div>
          <button type="submit">Next</button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button type="button" onClick={handleAutoAdminLogin} style={{ background: 'transparent', border: '1px solid #667eea', color: '#667eea', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
            🔐 Auto Employee Login (fill & submit)
          </button>
          <button type="button" onClick={demoAdminLogin} style={{ background: 'transparent', border: '1px solid #28a745', color: '#28a745', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
            ⚡ One‑Click Admin Demo
          </button>
        </div>

        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;