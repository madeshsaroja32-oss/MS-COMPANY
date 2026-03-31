import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import '../../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials', 'camera', or 'otp'
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Location states
  const [locationStatus, setLocationStatus] = useState('prompt');
  const [locationCoords, setLocationCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus('granted');
          setLocationCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => setLocationStatus('denied')
      );
    }
  }, []);

  const getLocation = () => {
    return new Promise((resolve) => {
      if (locationCoords) {
        resolve({ lat: locationCoords.lat, lng: locationCoords.lng, address: 'Location captured' });
      } else {
        resolve({ address: 'Location not available' });
      }
    });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // First, try admin login (OTP flow)
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        // Admin – go to OTP step
        setUserId(data.userId);
        setStep('otp');
        return;
      } else if (response.status === 403) {
        // Not admin – fallback to employee face login
        setStep('camera');
        return;
      } else {
        // Invalid credentials
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      // Network error – maybe fallback to employee flow?
      setError('Network error. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    handleLoginWithFace(imageSrc);
  };

  const handleLoginWithFace = async (photoData) => {
    try {
      const location = await getLocation();
      const response = await fetch('http://localhost:5000/api/auth/login-with-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, photo: photoData, loginLocation: location })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Face verification failed');
        setStep('credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStep('credentials');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('madeshsaroja32@gmail.com');
    setPassword('sri1234');
  };

  return (
    <div className="page">
      <div className="header">
        <h2>MS COMPANY</h2>
        <h2>Employee Management System</h2>
        <p>WELCOME TO OUR COMPANY</p>
      </div>

      <div className="login-box">
        {step === 'credentials' && (
          <>
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}

            {/* Location status */}
            <div style={{ marginBottom: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
              {locationStatus === 'prompt' && <p>Requesting location...</p>}
              {locationStatus === 'granted' && <p style={{ color: 'green' }}>✓ Location granted</p>}
              {locationStatus === 'denied' && <p style={{ color: 'red' }}>✗ Location denied</p>}
            </div>

            <form onSubmit={handleCredentialsSubmit}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '50px' }}
                />
                {/* Eye icon inside a separate box */}
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
                      lineHeight: 1.8
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit">Next</button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={fillAdminCredentials}
                style={{
                  background: 'transparent',
                  border: '1px solid #667eea',
                  color: '#667eea',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔐 Login As Admin (Demo)
              </button>
            </div>

            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2>Verify OTP</h2>
            <p>Enter the verification code sent to your email</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleOtpSubmit}>
              <div>
                <label htmlFor="otp">Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Verify & Login
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'camera' && (
          <>
            <h2>Verify Your Face</h2>
            <p>Please look at the camera and click Capture</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                videoConstraints={{ facingMode: "user" }}
              />
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setStep('credentials')}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={capture}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Capture & Login
                </button>
              </div>
            </div>
            {error && <p className="error-message" style={{ marginTop: '10px' }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;