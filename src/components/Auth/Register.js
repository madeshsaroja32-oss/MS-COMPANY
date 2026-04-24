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
    address: '',
    position: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState('');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('prompt');
  const [faceRegistered, setFaceRegistered] = useState(false);
  const [faceError, setFaceError] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Load face-api models once when component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        await window.faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await window.faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await window.faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true);
        console.log('Face models loaded');
      } catch (err) {
        console.error('Failed to load face models', err);
        setFaceError('Face recognition models could not be loaded. Registration will continue without face verification.');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('granted');
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Captured during registration'
          });
        },
        (err) => {
          setLocationStatus('denied');
          console.warn(err.message);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFaceRegistered(false);
    setFaceError('');

    // Preview photo
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);

    if (!modelsLoaded) {
      setFaceError('Face models not yet loaded. Please wait and try again.');
      return;
    }

    // Create an image element for face detection
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        const detection = await window.faceapi.detectSingleFace(img, new window.faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          const descriptor = Array.from(detection.descriptor);
          localStorage.setItem(`faceDescriptor_${formData.email}`, JSON.stringify(descriptor));
          setFaceRegistered(true);
          setFaceError('');
        } else {
          setFaceError('No face detected in the uploaded photo. Please upload a clear photo showing your face.');
        }
      } catch (err) {
        console.error('Face detection error:', err);
        setFaceError('Face detection failed. Please try another photo.');
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    img.onerror = () => {
      setFaceError('Failed to load image for face detection.');
      URL.revokeObjectURL(img.src);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      department: formData.department,
      position: formData.position,
      photo: photo,
      registeredAt: new Date().toISOString(),
      location: location || { lat: null, lng: null, address: 'Not captured' }
    };
    register(userData);
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  const departments = ['Select department', 'Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Support', 'Administration'];
  const positions = ['Select position', 'Manager', 'Team Lead', 'Senior Developer', 'Junior Developer', 'HR Specialist', 'Sales Representative', 'Marketing Analyst', 'Accountant', 'Operations Coordinator', 'Support Agent', 'Administrative Assistant'];

  const addressStyles = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginTop: '5px'
  };

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
            {locationStatus === 'prompt' && <p>Requesting location access...</p>}
            {locationStatus === 'granted' && <p style={{ color: 'green' }}>✓ Location granted</p>}
            {locationStatus === 'denied' && <p style={{ color: 'red' }}>✗ Location denied (registration still works)</p>}
          </div>
          <form onSubmit={handleSubmit}>
            <div><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
            <div><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div style={{ position: 'relative' }}>
              <label>Password</label>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required style={{ paddingRight: '50px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none' }}>{showPassword ? '🙈' : '👁️'}</button>
            </div>
            <div style={{ position: 'relative' }}>
              <label>Confirm Password</label>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ paddingRight: '50px' }} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none' }}>{showConfirmPassword ? '🙈' : '👁️'}</button>
            </div>
            <div><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +91 9876543210" /></div>
            <div>
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, State, ZIP Code"
                rows="3"
                style={addressStyles}
              />
            </div>
            <div><label>Department</label><select name="department" value={formData.department} onChange={handleChange} required>{departments.map((d,i) => <option key={i} value={d === 'Select department' ? '' : d}>{d}</option>)}</select></div>
            <div><label>Position</label><select name="position" value={formData.position} onChange={handleChange} required>{positions.map((p,i) => <option key={i} value={p === 'Select position' ? '' : p}>{p}</option>)}</select></div>
            <div><label>Profile Photo (optional)</label><input type="file" accept="image/*" onChange={handlePhotoUpload} /></div>
            {photo && <img src={photo} alt="preview" style={{ width: '100px', borderRadius: '50%' }} />}
            {faceRegistered && <p style={{ color: 'green' }}>✓ Face registration successful</p>}
            {faceError && <p style={{ color: 'red' }}>{faceError}</p>}
            {!modelsLoaded && <p style={{ color: 'orange' }}>Loading face recognition models...</p>}
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;