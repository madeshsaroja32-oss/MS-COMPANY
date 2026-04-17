import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - modern dark/light mix */}
      <aside className="w-72 bg-white shadow-xl flex flex-col z-10">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-700 tracking-tight">ADMIN</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Control Panel</p>
        </div>
        <nav className="flex-1 px-4 py-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Navigation</p>
          <ul className="space-y-1">
            <li><Link to="/admin" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">📊</span> Dashboard</Link></li>
            <li><Link to="/admin/departments" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">🏢</span> Departaments</Link></li>
            <li><Link to="/admin/tasks" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">✅</span> Tasks</Link></li>
            <li><Link to="/admin/evaluation" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">⭐</span> Evaluation</Link></li>
            <li><Link to="/admin/designation" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">📌</span> Designation</Link></li>
            <li><Link to="/admin/employees" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">👥</span> Employees</Link></li>
            <li><Link to="/admin/evaluator" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">📋</span> Evaluator</Link></li>
            <li><Link to="/admin/users" className="flex items-center px-4 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"><span className="mr-3 text-lg">👤</span> Users</Link></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">A</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@mscompany.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-light text-gray-800">Dashboard</h1>
          <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700 transition">Logout</button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;