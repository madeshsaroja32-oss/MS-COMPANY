import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Webcam from 'react-webcam';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Leave request state
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveError, setLeaveError] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState('');

  // Attendance history (mock)
  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: '2024-04-01', login: '09:00 AM', logout: '05:00 PM', hours: 8, status: 'Present' },
    { date: '2024-04-02', login: '09:15 AM', logout: '05:00 PM', hours: 7.75, status: 'Late' },
    { date: '2024-04-03', login: '09:00 AM', logout: '05:00 PM', hours: 8, status: 'Present' },
  ]);

  // Webcam modal state
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const webcamRef = useRef(null);

  // Calculate present percentage for pie chart
  const totalDays = attendanceHistory.length;
  const presentDays = attendanceHistory.filter(record => record.status === 'Present').length;
  const presentPercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  const absentPercentage = 100 - presentPercentage;

  const pieData = [
    { name: 'Present', value: presentPercentage, color: '#4caf50' },
    { name: 'Absent/Late', value: absentPercentage, color: '#ff9800' },
  ];

  // Calendar state
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    let startOffset = startWeekday === 0 ? 6 : startWeekday - 1;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysArray = [];
    for (let i = 0; i < startOffset; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
    return daysArray;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const handlePrevMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [user, navigate]);

  const handleLeaveChange = (e) => {
    setLeaveRequest({ ...leaveRequest, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveRequest.startDate || !leaveRequest.endDate || !leaveRequest.reason) {
      setLeaveError('Please fill all fields');
      return;
    }
    setLeaveSuccess('Leave request submitted!');
    setLeaveError('');
    setLeaveRequest({ startDate: '', endDate: '', reason: '' });
    setTimeout(() => setLeaveSuccess(''), 3000);
  };

  // Visual permission flow: open modal
  const handleMarkLoginClick = () => {
    setShowWebcamModal(true);
    setCapturedImage(null);
    setConfirmationChecked(false);
    setLoginMessage('');
  };

  // Capture photo from webcam
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  // Confirm login after visual verification
  const confirmLogin = () => {
    if (!confirmationChecked) {
      setLoginMessage('Please confirm that this is your photo.');
      return;
    }
    // Record login time
    const now = new Date();
    const loginTime = now.toLocaleTimeString();
    const todayDate = now.toISOString().split('T')[0];
    // Add a mock attendance record for today (or update if already exists)
    const existingIndex = attendanceHistory.findIndex(rec => rec.date === todayDate);
    if (existingIndex === -1) {
      setAttendanceHistory([
        { date: todayDate, login: loginTime, logout: '-', hours: 0, status: 'Present' },
        ...attendanceHistory
      ]);
    } else {
      const updated = [...attendanceHistory];
      updated[existingIndex].login = loginTime;
      updated[existingIndex].status = 'Present';
      setAttendanceHistory(updated);
    }
    setLoginMessage(`Login recorded at ${loginTime}`);
    setTimeout(() => {
      setShowWebcamModal(false);
      setLoginMessage('');
    }, 2000);
  };

  if (!currentUser) return <div className="loading">Loading...</div>;

  return (
    <div className="employee-dashboard-new">
      <div className="dashboard-header">
        <h1>Home</h1>
        <div className="user-greeting">
          Hello, {currentUser.name || currentUser.email?.split('@')[0] || 'Employee'}
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-col">
          <div className="card welcome-card">
            <div className="profile-section">
              {currentUser.photo ? (
                <img src={currentUser.photo} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-placeholder">📷</div>
              )}
              <div className="profile-info">
                <h3>Welcome, {currentUser.name || 'User'}</h3>
                <p>Email: {currentUser.email}</p>
                <p>Department: {currentUser.department || 'Engineering'}</p>
                <p>Position: {currentUser.position || 'Staff'}</p>
              </div>
            </div>
            <button onClick={handleMarkLoginClick} className="mark-login-btn">Mark Login</button>
          </div>

          <div className="card leave-request">
            <h3>Request Leave</h3>
            {leaveError && <p className="error-message">{leaveError}</p>}
            {leaveSuccess && <p className="success-message">{leaveSuccess}</p>}
            <form onSubmit={handleLeaveSubmit}>
              <div>
                <label>Start Date</label>
                <input type="date" name="startDate" value={leaveRequest.startDate} onChange={handleLeaveChange} required />
              </div>
              <div>
                <label>End Date</label>
                <input type="date" name="endDate" value={leaveRequest.endDate} onChange={handleLeaveChange} required />
              </div>
              <div>
                <label>Reason</label>
                <textarea name="reason" value={leaveRequest.reason} onChange={handleLeaveChange} required rows="2"></textarea>
              </div>
              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>

        {/* MIDDLE COLUMN – Calendar + Pie Chart */}
        <div className="middle-col">
          <div className="card calendar">
            <div className="calendar-header">
              <button onClick={handlePrevMonth} className="calendar-nav">◀</button>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {months.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
              <select value={selectedYear} onChange={handleYearChange}>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button onClick={handleNextMonth} className="calendar-nav">▶</button>
            </div>
            <div className="calendar-grid">
              {weekDays.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
              {calendarDays.map((day, idx) => (
                <div key={idx} className={`calendar-day ${day === null ? 'empty' : ''}`}>
                  {day !== null ? day : ''}
                </div>
              ))}
            </div>
          </div>

          <div className="card pie-chart-card">
            <h3>Present Percentage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN – Attendance History */}
        <div className="right-col">
          <div className="card attendance-history">
            <h3>Attendance History</h3>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th><th>Login</th><th>Logout</th><th>Hours</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.date}</td>
                    <td>{record.login || '-'}</td>
                    <td>{record.logout || '-'}</td>
                    <td>{record.hours || '-'}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Webcam Modal for Visual Permission */}
      {showWebcamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Visual Permission Required</h3>
            <p>Please look at the camera and capture your photo.</p>
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                videoConstraints={{ facingMode: "user" }}
              />
            </div>
            {!capturedImage ? (
              <button onClick={capturePhoto} className="capture-btn">Capture Photo</button>
            ) : (
              <div>
                <img src={capturedImage} alt="Captured" style={{ width: '160px', borderRadius: '8px', marginTop: '10px' }} />
                <label style={{ display: 'block', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                  />
                  This is me – I confirm my identity.
                </label>
                <button onClick={confirmLogin} className="confirm-login-btn">Confirm Login</button>
              </div>
            )}
            <button onClick={() => setShowWebcamModal(false)} className="close-modal-btn">Close</button>
            {loginMessage && <p className="login-message">{loginMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;