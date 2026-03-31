import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../index.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    position: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Location states
  const [locationStatus, setLocationStatus] = useState('prompt');
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('granted');
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError('');
      },
      (err) => {
        setLocationStatus('denied');
        setLocationError(err.message);
      }
    );
  }, []);

  const requestLocation = () => {
    setLocationStatus('prompt');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('granted');
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        setLocationStatus('denied');
        setLocationError(err.message);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register({ ...formData, photo });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const departments = [
    'Select department',
    'Engineering', 'Human Resources', 'Sales', 'Marketing',
    'Finance', 'Operations', 'Customer Support', 'Administration'
  ];

  const positions = [
    'Select position',
    'Manager', 'Team Lead', 'Senior Developer', 'Junior Developer',
    'HR Specialist', 'Sales Representative', 'Marketing Analyst',
    'Accountant', 'Operations Coordinator', 'Support Agent', 'Administrative Assistant'
  ];

  return (
    <div className="split-screen">
      <div className="brand-side">
        <h1>MS COMPANY</h1>
        <p>Welcome to Register With Our Company</p>
        <p style={{ marginTop: '2rem', fontSize: '1rem' }}>Join our team today</p>
      </div>

      <div className="form-side">
        <div className="form-card">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}

          <div style={{ marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
            {locationStatus === 'prompt' && <p style={{ color: '#666' }}>Requesting location access...</p>}
            {locationStatus === 'granted' && (
              <p style={{ color: 'green' }}>
                ✓ Location access granted
                {locationCoords && ` (${locationCoords.lat.toFixed(4)}, ${locationCoords.lng.toFixed(4)})`}
              </p>
            )}
            {locationStatus === 'denied' && (
              <p style={{ color: 'red' }}>
                ✗ Location access denied. {locationError}
                <br />
                <button onClick={requestLocation} style={{ background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer', marginTop: '5px' }}>
                  Try again
                </button>
              </p>
            )}
            {locationStatus === 'unavailable' && <p style={{ color: 'red' }}>✗ Geolocation not supported</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Password field with toggle button inside a box */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '50px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '32px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: 0,
                    margin: 0,
                    lineHeight: 1.9
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password field with its own toggle inside a box */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingRight: '50px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '32px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: 0,
                    margin: 0,
                    lineHeight: 1.9
                  }}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone">Phone</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                {departments.map((dept, index) => (
                  <option key={index} value={dept === 'Select department' ? '' : dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="position">Position</label>
              <select id="position" name="position" value={formData.position} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                {positions.map((pos, index) => (
                  <option key={index} value={pos === 'Select position' ? '' : pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="photo">Profile Photo (optional)</label>
              <input type="file" id="photo" accept="image/*" onChange={handlePhotoUpload} style={{ marginBottom: '10px' }} />
              {photo && <img src={photo} alt="preview" style={{ width: '100px', borderRadius: '50%' }} />}
            </div>

            <button type="submit">Register</button>
          </form>

          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;