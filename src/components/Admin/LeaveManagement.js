import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get('/leave/all');
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leave/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Leave Requests</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td className="p-2 border">{l.employee?.name}</td>
              <td className="p-2 border">{l.employee?.department}</td>
              <td className="p-2 border">{new Date(l.startDate).toLocaleDateString()}</td>
              <td className="p-2 border">{new Date(l.endDate).toLocaleDateString()}</td>
              <td className="p-2 border">{l.reason}</td>
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded text-xs ${
                  l.status === 'approved' ? 'bg-green-100 text-green-800' :
                  l.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {l.status}
                </span>
              </td>
              <td className="p-2 border">
                {l.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(l._id, 'approved')} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Approve</button>
                    <button onClick={() => updateStatus(l._id, 'rejected')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {leaves.length === 0 && <tr><td colSpan="7" className="text-center p-4">No leave requests</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;