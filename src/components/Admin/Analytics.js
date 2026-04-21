import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAttendanceRecords, getEmployees } from '../../utils/adminDataService';

const Analytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [lateFrequency, setLateFrequency] = useState([]);
  const [dailyBreakdown, setDailyBreakdown] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const records = getAttendanceRecords();
    const employees = getEmployees();

    // 1. Attendance trends (last 30 days)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      const present = dayRecords.filter(r => r.status === 'Present').length;
      const absent = dayRecords.filter(r => r.status === 'Absent').length;
      last30Days.push({ date: dateStr, present, absent });
    }
    setTrendData(last30Days.slice(0, 15)); // show last 15 days for readability

    // 2. Department performance (attendance %)
    const deptMap = new Map();
    employees.forEach(emp => {
      if (!deptMap.has(emp.department)) {
        deptMap.set(emp.department, { total: 0, present: 0 });
      }
    });
    records.forEach(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (emp) {
        const dept = deptMap.get(emp.department);
        if (dept) {
          dept.total++;
          if (rec.status === 'Present') dept.present++;
        }
      }
    });
    const deptArray = Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      percentage: data.total === 0 ? 0 : Math.round((data.present / data.total) * 100)
    }));
    setDeptPerformance(deptArray);

    // 3. Late login frequency (hours late distribution)
    const lateRecords = records.filter(r => r.status === 'Late' && r.loginTime);
    const lateHours = lateRecords.map(r => {
      const hour = parseInt(r.loginTime.split(':')[0]);
      const minute = parseInt(r.loginTime.split(':')[1]);
      return hour + minute / 60 - 9; // hours after 9:00
    }).filter(h => h > 0);
    const freqMap = new Map();
    lateHours.forEach(h => {
      const bucket = Math.floor(h * 4) / 4; // 0.25 hour buckets
      freqMap.set(bucket, (freqMap.get(bucket) || 0) + 1);
    });
    const freqArray = Array.from(freqMap.entries())
      .sort((a,b) => a[0] - b[0])
      .map(([hour, count]) => ({ hour: hour.toFixed(2), count }));
    setLateFrequency(freqArray);

    // 4. Daily breakdown (by department for today)
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);
    const deptDaily = new Map();
    employees.forEach(emp => {
      if (!deptDaily.has(emp.department)) {
        deptDaily.set(emp.department, { total: 0, present: 0 });
      }
    });
    todayRecords.forEach(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (emp) {
        const dept = deptDaily.get(emp.department);
        if (dept) {
          dept.total++;
          if (rec.status === 'Present') dept.present++;
        }
      }
    });
    const dailyArray = Array.from(deptDaily.entries()).map(([name, data]) => ({
      department: name,
      attendance: data.total === 0 ? 0 : Math.round((data.present / data.total) * 100)
    }));
    setDailyBreakdown(dailyArray);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">In-depth attendance and workforce insights</p>
        </div>

        {/* Attendance Trends */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends (Last 15 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#3b82f6" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
            <div className="space-y-4">
              {deptPerformance.map((dept, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dept.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {deptPerformance.length === 0 && <p className="text-gray-500 text-center py-4">No data</p>}
            </div>
          </div>

          {/* Late Login Frequency */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Late Login Frequency (hours late)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={lateFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hours late', position: 'bottom' }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#eab308" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance by Department</h3>
          <div className="space-y-4">
            {dailyBreakdown.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{dept.department}</span>
                  <span>{dept.attendance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${dept.attendance}%` }}></div>
                </div>
              </div>
            ))}
            {dailyBreakdown.length === 0 && <p className="text-gray-500 text-center py-4">No attendance records for today.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;