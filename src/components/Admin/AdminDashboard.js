import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import API from '../../utils/api';
import EmployeeTable from './EmployeeTable';
import AttendanceTable from './AttendanceTable';
import Charts from './Charts';
import LoginHistory from './LoginHistory';   // import the new component

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>

      {/* Stats Cards – now using the stats variable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Present Today</p>
          <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Late Today</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.lateToday}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Absent Today</p>
          <p className="text-3xl font-bold text-red-600">{stats.absentToday}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mb-4 flex flex-wrap gap-2">
        <Link to="/admin/employees" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Employees
        </Link>
        <Link to="/admin/attendance" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Attendance
        </Link>
        <Link to="/admin/charts" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Charts
        </Link>
        <Link to="/admin/login-history" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login History
        </Link>
      </nav>

      {/* Nested Routes */}
      <Routes>
        <Route path="employees" element={<EmployeeTable />} />
        <Route path="attendance" element={<AttendanceTable />} />
        <Route path="charts" element={<Charts />} />
        <Route path="login-history" element={<LoginHistory />} />
        <Route index element={<div className="text-gray-500">Select a section from above</div>} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;