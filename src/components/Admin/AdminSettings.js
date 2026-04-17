import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('adminCredentials');
    if (stored) {
      const creds = JSON.parse(stored);
      setAdminEmail(creds.email);
      setAdminPassword(creds.password);
    } else {
      // Defaults
      setAdminEmail('admin@mscompany.com');
      setAdminPassword('admin123');
    }
  }, []);

  const handleSave = () => {
    if (!adminEmail || !adminPassword) {
      setMessage('Email and password cannot be empty');
      return;
    }
    localStorage.setItem('adminCredentials', JSON.stringify({ email: adminEmail, password: adminPassword }));
    setMessage('Admin credentials saved!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
      <p className="text-gray-600 mb-4">Change the admin email and password used to log in to the admin panel.</p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Admin Email</label>
        <input
          type="email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="border rounded p-2 w-full max-w-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Admin Password</label>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="border rounded p-2 w-full max-w-md"
        />
      </div>
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default AdminSettings;