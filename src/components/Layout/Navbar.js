import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div>
          {user ? (
            <>
              <span className="mr-4">Hello, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="mr-4">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;