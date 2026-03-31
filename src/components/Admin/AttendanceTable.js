import React, { useState, useEffect, useCallback } from 'react';
import API from '../../utils/api';

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const fetchAttendance = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterDate) params.append('date', filterDate);
    if (filterDept) params.append('department', filterDept);
    const { data } = await API.get(`/admin/attendance?${params.toString()}`);
    setRecords(data);
  }, [filterDate, filterDept]); // Recreate only when filters change

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]); // Now depends on the stable function

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Department"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border p-2"
        />
        <button onClick={fetchAttendance} className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Login</th>
            <th className="p-2 border">Logout</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Location</th>
          </tr>
        </thead>
        <tbody>
          {records.map(rec => (
            <tr key={rec._id}>
              <td className="p-2 border">{rec.userId?.name} ({rec.userId?.department})</td>
              <td className="p-2 border">{rec.date}</td>
              <td className="p-2 border">{rec.loginTime || '-'}</td>
              <td className="p-2 border">{rec.logoutTime || '-'}</td>
              <td className="p-2 border">{rec.workHours || '-'}</td>
              <td className="p-2 border">{rec.status}</td>
              <td className="p-2 border">{rec.loginLocation?.address || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;