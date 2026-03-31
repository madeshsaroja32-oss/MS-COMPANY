import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">EMS</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li><Link to="/admin" className="block p-2 rounded hover:bg-blue-50 text-gray-700">Dashboard</Link></li>
            <li><Link to="/admin/employees" className="block p-2 rounded hover:bg-blue-50 text-gray-700">Employees</Link></li>
            <li><Link to="/admin/attendance" className="block p-2 rounded hover:bg-blue-50 text-gray-700">Attendance</Link></li>
            <li><Link to="/admin/analytics" className="block p-2 rounded hover:bg-blue-50 text-gray-700">Analytics</Link></li>
            <li><Link to="/admin/leaves" className="block p-2 rounded hover:bg-blue-50 text-gray-700">Leave Requests</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name} ({user?.email})</span>
            <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Sign Out</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <footer className="bg-white border-t p-4 text-sm text-gray-500 flex justify-between">
          <span>Admin User • {user?.email}</span>
          <button onClick={handleLogout} className="text-blue-600 hover:underline">Sign Out</button>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;