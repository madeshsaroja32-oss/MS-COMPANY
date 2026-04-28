import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Webcam from 'react-webcam';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAttendanceRecords, getEmployees, addAttendanceRecord } from '../../utils/adminDataService';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [presentPercentage, setPresentPercentage] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Leave request state
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveError, setLeaveError] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState('');

  // Webcam modal state
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const webcamRef = useRef(null);

  // Polling interval reference
  const intervalRef = useRef(null);

  // Load real attendance records for the logged-in employee
  const loadAttendanceHistory = () => {
    if (!currentUser) return;
    const allRecords = getAttendanceRecords();
    const employeeRecords = allRecords.filter(rec => rec.employeeId === currentUser.id);
    employeeRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceHistory(employeeRecords);
    const total = employeeRecords.length;
    const present = employeeRecords.filter(rec => rec.status === 'Present').length;
    setPresentPercentage(total > 0 ? (present / total) * 100 : 0);
  };

  // Load leave requests for this employee
  const loadLeaveRequests = () => {
    if (!currentUser) return;
    const allLeaveRequests = JSON.parse(localStorage.getItem('admin_leave_requests')) || [];
    const myRequests = allLeaveRequests.filter(req => req.employeeId === currentUser.id);
    myRequests.sort((a, b) => b.id - a.id); // newest first
    setLeaveRequests(myRequests);
  };

  // Combined data load (attendance + leave requests)
  const refreshAllData = () => {
    loadAttendanceHistory();
    loadLeaveRequests();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Ensure currentUser has an id; if not, try to find/assign one
      if (!user.id) {
        const employees = getEmployees();
        const emp = employees.find(e => e.email === user.email);
        if (emp) user.id = emp.id;
      }
      setCurrentUser(user);
      refreshAllData();

      // Set up polling every 30 seconds to check for status changes (without page refresh)
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        // Only refresh if the user is still logged in
        if (currentUser) {
          loadLeaveRequests();    // refresh leave requests (status may have changed)
          loadAttendanceHistory(); // also refresh attendance if needed
        }
      }, 30000); // every 30 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  // Calendar state (unchanged)
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

  const handleLeaveChange = (e) => {
    setLeaveRequest({ ...leaveRequest, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveRequest.startDate || !leaveRequest.endDate || !leaveRequest.reason) {
      setLeaveError('Please fill all fields');
      return;
    }

    const currentUserData = JSON.parse(localStorage.getItem('currentUser')) || user;
    const employeeId = currentUserData?.id || currentUser?.id;
    const employeeName = currentUserData?.name || currentUser?.name || 'Employee';

    const newRequest = {
      id: Date.now(),
      employeeId: employeeId,
      employeeName: employeeName,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      reason: leaveRequest.reason,
      status: 'Pending'
    };

    const existing = JSON.parse(localStorage.getItem('admin_leave_requests')) || [];
    existing.push(newRequest);
    localStorage.setItem('admin_leave_requests', JSON.stringify(existing));

    setLeaveSuccess('Leave request submitted!');
    setLeaveError('');
    setLeaveRequest({ startDate: '', endDate: '', reason: '' });
    loadLeaveRequests(); // refresh immediately
    setTimeout(() => setLeaveSuccess(''), 3000);
  };

  const handleMarkLoginClick = () => {
    setShowWebcamModal(true);
    setCapturedImage(null);
    setConfirmationChecked(false);
    setLoginMessage('');
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const confirmLogin = () => {
    if (!confirmationChecked) {
      setLoginMessage('Please confirm that this is your photo.');
      return;
    }
    if (!capturedImage) {
      setLoginMessage('Please capture your photo first.');
      return;
    }

    const now = new Date();
    const loginTime = now.toLocaleTimeString();
    const todayDate = now.toISOString().split('T')[0];
    const loginHour = now.getHours();
    const loginMinute = now.getMinutes();

    let status = 'Present';
    if (loginHour > 9 || (loginHour === 9 && loginMinute > 0)) {
      status = 'Late';
    }

    const newRecord = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: todayDate,
      loginTime,
      logoutTime: null,
      hours: null,
      status,
      location: currentUser.location?.address || 'From webcam',
      photo: capturedImage,
    };
    addAttendanceRecord(newRecord);
    loadAttendanceHistory();

    setLoginMessage(`Login recorded at ${loginTime} (${status})`);
    setTimeout(() => {
      setShowWebcamModal(false);
      setLoginMessage('');
    }, 2000);
  };

  if (!currentUser) return <div className="loading">Loading...</div>;

  const pieData = [
    { name: 'Present', value: presentPercentage, color: '#4caf50' },
    { name: 'Absent/Late', value: 100 - presentPercentage, color: '#ff9800' },
  ];

  const statusBadge = (status) => {
    const colors = {
      Pending: '#fef9c3',
      Approved: '#dcfce7',
      Rejected: '#fee2e2'
    };
    const textColors = {
      Pending: '#854d0e',
      Approved: '#166534',
      Rejected: '#991b1b'
    };
    return {
      background: colors[status] || '#e2e8f0',
      color: textColors[status] || '#1e293b',
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };
  };

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
                <p>Address: {currentUser.address || 'Not provided'}</p>
              </div>
            </div>
            <button onClick={handleMarkLoginClick} className="mark-login-btn">Mark Login</button>
          </div>

          <div className="card leave-request">
            <h3>Request Leave</h3>
            {leaveError && <p className="error-message">{leaveError}</p>}
            {leaveSuccess && <p className="success-message">{leaveSuccess}</p>}
            <form onSubmit={handleLeaveSubmit}>
              <div><label>Start Date</label><input type="date" name="startDate" value={leaveRequest.startDate} onChange={handleLeaveChange} required /></div>
              <div><label>End Date</label><input type="date" name="endDate" value={leaveRequest.endDate} onChange={handleLeaveChange} required /></div>
              <div><label>Reason</label><textarea name="reason" value={leaveRequest.reason} onChange={handleLeaveChange} required rows="2"></textarea></div>
              <button type="submit">Submit Request</button>
            </form>
          </div>

          <div className="card leave-requests-list">
            <h3>My Leave Requests</h3>
            {leaveRequests.length === 0 ? (
              <p>No leave requests submitted.</p>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map(req => (
                    <tr key={req.id}>
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>{req.reason}</td>
                      <td><span style={statusBadge(req.status)}>{req.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN – Calendar + Pie Chart */}
        <div className="middle-col">
          <div className="card calendar">
            <div className="calendar-header">
              <button onClick={handlePrevMonth} className="calendar-nav">◀</button>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {months.map((month, idx) => <option key={idx} value={idx}>{month}</option>)}
              </select>
              <select value={selectedYear} onChange={handleYearChange}>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <button onClick={handleNextMonth} className="calendar-nav">▶</button>
            </div>
            <div className="calendar-grid">
              {weekDays.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
              {calendarDays.map((day, idx) => (
                <div key={idx} className={`calendar-day ${day === null ? 'empty' : ''}`}>{day !== null ? day : ''}</div>
              ))}
            </div>
          </div>

          <div className="card pie-chart-card">
            <h3>Present Percentage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
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
                  <th>Date</th>
                  <th>Login</th>
                  <th>Logout</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.date}</td>
                    <td>{record.loginTime || '-'}</td>
                    <td>{record.logoutTime || '-'}</td>
                    <td>{record.hours ? `${record.hours}h` : '-'}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
                {attendanceHistory.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Webcam Modal */}
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
                  <input type="checkbox" checked={confirmationChecked} onChange={(e) => setConfirmationChecked(e.target.checked)} />
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