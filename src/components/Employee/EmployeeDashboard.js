import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LeaveRequest from './LeaveRequest'; // Import the LeaveRequest component

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationMsg, setLocationMsg] = useState('');

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const fetchToday = async () => {
    try {
      const { data } = await API.get('/attendance/me');
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.find(rec => rec.date === today);
      setAttendance(todayRecord);
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ address: 'Geolocation not supported' });
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: 'Location captured'
            });
          },
          () => {
            resolve({ address: 'Location permission denied' });
          }
        );
      }
    });
  };

  const handleLoginWithPhoto = async (photoData) => {
    setLoading(true);
    const location = await getLocation();
    try {
      await API.post('/attendance/login', { location, photo: photoData });
      setLocationMsg('Login recorded with photo');
      fetchToday();
    } catch (err) {
      setLocationMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setShowCamera(false);
    handleLoginWithPhoto(imageSrc);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await API.post('/attendance/logout');
      setLocationMsg('Logout recorded');
      fetchToday();
    } catch (err) {
      setLocationMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const canLogin = !attendance || !attendance.loginTime;
  const canLogout = attendance && attendance.loginTime && !attendance.logoutTime;

  return (
    <div>
      <h1 className="text-3xl mb-6">Employee Dashboard</h1>

      {/* Leave Request Form */}
      <LeaveRequest /> {/* No prop for now; will add refresh later */}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Welcome, {user?.name}</h2>
        <div className="mb-4">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Department:</strong> {user?.department}</p>
          <p><strong>Position:</strong> {user?.position}</p>
        </div>
        <div className="flex space-x-4">
          {canLogin && (
            <button
              onClick={() => setShowCamera(true)}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Mark Login'}
            </button>
          )}
          {canLogout && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Mark Logout'}
            </button>
          )}
        </div>
        {locationMsg && <p className="mt-2 text-sm text-gray-600">{locationMsg}</p>}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Attendance History</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Login</th>
              <th className="p-2 border">Logout</th>
              <th className="p-2 border">Hours</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(rec => (
              <tr key={rec._id}>
                <td className="p-2 border">{rec.date}</td>
                <td className="p-2 border">{rec.loginTime || '-'}</td>
                <td className="p-2 border">{rec.logoutTime || '-'}</td>
                <td className="p-2 border">{rec.workHours || '-'}</td>
                <td className="p-2 border">{rec.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-2">Take a photo</h3>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              videoConstraints={{ facingMode: "user" }}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowCamera(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={capture}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;