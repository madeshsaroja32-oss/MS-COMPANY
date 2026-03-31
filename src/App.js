import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import Employees from './components/Admin/Employees';
import Attendance from './components/Admin/Attendance';
import Analytics from './components/Admin/Analytics';
import LeaveManagement from './components/Admin/LeaveManagement';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  const { loading } = useAuth();
  console.log("Loading:",loading);
  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['employee', 'admin']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leaves" element={<LeaveManagement />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;