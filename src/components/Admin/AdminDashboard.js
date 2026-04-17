import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalDepartments: 0,
    totalDesignations: 0,
    totalUsers: 0,
    totalEmployees: 0,
    totalEvaluators: 0,
    totalTasks: 0
  });

  useEffect(() => {
    // Mock data – replace with API call later
    setMetrics({
      totalDepartments: 5,
      totalDesignations: 12,
      totalUsers: 24,
      totalEmployees: 18,
      totalEvaluators: 6,
      totalTasks: 34
    });
  }, []);

  const cardData = [
    { label: 'TOTAL DEPARTAMENTS', value: metrics.totalDepartments, icon: '🏢', color: 'from-blue-500 to-blue-600' },
    { label: 'TOTAL DESIGNATIONS', value: metrics.totalDesignations, icon: '📌', color: 'from-purple-500 to-purple-600' },
    { label: 'TOTAL USERS', value: metrics.totalUsers, icon: '👥', color: 'from-green-500 to-green-600' },
    { label: 'TOTAL EMPLOYEES', value: metrics.totalEmployees, icon: '👨‍💼', color: 'from-orange-500 to-orange-600' },
    { label: 'TOTAL EVALUATORS', value: metrics.totalEvaluators, icon: '📋', color: 'from-red-500 to-red-600' },
    { label: 'TOTAL TASKS', value: metrics.totalTasks, icon: '✅', color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, Administrator</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className={`bg-gradient-to-r ${card.color} p-4 text-white`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold tracking-wider opacity-90">{card.label}</span>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className="text-4xl font-bold mt-2">{card.value}</div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-xs text-gray-500">Updated just now</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
        <p className="text-gray-500">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;