import React from 'react';

const Attendance = () => {
  const records = [
    { id: 1, employee: 'Sarah Chen', dept: 'Engineering', login: '09:05', logout: '17:30', hours: 8.42, status: 'Present' },
    { id: 2, employee: 'Marcus Johnson', dept: 'Design', login: '09:45', logout: '—', hours: '—', status: 'Late' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Attendance Overview</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logout</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {records.map(rec => (
              <tr key={rec.id}><td className="px-6 py-4 whitespace-nowrap">{rec.employee}</td><td className="px-6 py-4 whitespace-nowrap">{rec.dept}</td><td className="px-6 py-4 whitespace-nowrap">{rec.login}</td><td className="px-6 py-4 whitespace-nowrap">{rec.logout}</td><td className="px-6 py-4 whitespace-nowrap">{rec.hours}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded text-xs ${rec.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{rec.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;