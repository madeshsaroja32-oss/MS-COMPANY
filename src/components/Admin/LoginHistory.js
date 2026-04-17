import React, { useState, useEffect } from 'react';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock login history
    const mockHistory = [
      { _id: 1, userId: { name: 'Sarah Chen', email: 'sarah@example.com' }, loginTime: '2024-04-17T09:05:00Z', location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' }, ipAddress: '192.168.1.1', userAgent: 'Chrome/120.0' },
      { _id: 2, userId: { name: 'Marcus Johnson', email: 'marcus@example.com' }, loginTime: '2024-04-17T09:45:00Z', location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' }, ipAddress: '192.168.1.2', userAgent: 'Firefox/115.0' },
    ];
    setHistory(mockHistory);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead><tr className="bg-gray-200"><th className="p-2 border">User</th><th className="p-2 border">Email</th><th className="p-2 border">Login Time</th><th className="p-2 border">Location</th><th className="p-2 border">IP Address</th><th className="p-2 border">User Agent</th></tr></thead>
          <tbody>
            {history.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{record.userId.name}</td>
                <td className="p-2 border">{record.userId.email}</td>
                <td className="p-2 border">{formatDate(record.loginTime)}</td>
                <td className="p-2 border">{record.location?.address || `${record.location?.lat}, ${record.location?.lng}`}</td>
                <td className="p-2 border">{record.ipAddress}</td>
                <td className="p-2 border">{record.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;