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
      {/* Sidebar - corporate dark blue */}
      <aside className="w-72 bg-slate-800 shadow-xl flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Employee MS</h2>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 py-6">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-4">Main Navigation</p>
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className="flex items-center px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition">
                <span className="mr-3">📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/analytics" className="flex items-center px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition">
                <span className="mr-3">📈</span> Analytics
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.email || 'admin@mscompany.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;