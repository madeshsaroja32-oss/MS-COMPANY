import React, { useState, useEffect } from 'react';

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('');

  useEffect(() => {
    // Mock attendance data
    const mockRecords = [
      { _id: 1, userId: { name: 'Sarah Chen', department: 'Engineering' }, date: '2024-04-17', loginTime: '09:05', logoutTime: '17:30', workHours: 8.42, status: 'Present', loginLocation: { address: 'Office, NYC' } },
      { _id: 2, userId: { name: 'Marcus Johnson', department: 'Design' }, date: '2024-04-17', loginTime: '09:45', logoutTime: '18:00', workHours: 8.25, status: 'Late', loginLocation: { address: 'Home Office' } },
      { _id: 3, userId: { name: 'Emily Rodriguez', department: 'Marketing' }, date: '2024-04-16', loginTime: '09:00', logoutTime: '17:30', workHours: 8.5, status: 'Present', loginLocation: { address: 'Office, Chicago' } },
    ];
    setRecords(mockRecords);
  }, []);

  const filteredRecords = records.filter(rec => {
    if (filterDate && rec.date !== filterDate) return false;
    if (filterDept && rec.userId.department !== filterDept) return false;
    return true;
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
      <div className="flex gap-4 mb-4">
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Department" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border p-2 rounded" />
        <button onClick={() => {}} className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </div>
      <table className="w-full border">
        <thead><tr className="bg-gray-200"><th className="p-2 border">Employee</th><th className="p-2 border">Date</th><th className="p-2 border">Login</th><th className="p-2 border">Logout</th><th className="p-2 border">Hours</th><th className="p-2 border">Status</th><th className="p-2 border">Location</th></tr></thead>
        <tbody>
          {filteredRecords.map(rec => (
            <tr key={rec._id}>
              <td className="p-2 border">{rec.userId.name} ({rec.userId.department})</td>
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