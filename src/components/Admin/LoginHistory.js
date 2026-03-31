import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/admin/login-history');
      setHistory(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load login history');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Login Time</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">IP Address</th>
              <th className="p-2 border">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{record.userId?.name || 'N/A'}</td>
                <td className="p-2 border">{record.userId?.email || 'N/A'}</td>
                <td className="p-2 border">{formatDate(record.loginTime)}</td>
                <td className="p-2 border">
                  {record.location?.lat && record.location?.lng
                    ? `${record.location.lat.toFixed(4)}, ${record.location.lng.toFixed(4)}`
                    : record.location?.address || 'Not captured'}
                </td>
                <td className="p-2 border">{record.ipAddress || 'N/A'}</td>
                <td className="p-2 border" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {record.userAgent || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;