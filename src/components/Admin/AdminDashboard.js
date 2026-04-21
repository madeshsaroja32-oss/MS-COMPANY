import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  initAdminData,
  getDashboardStats,
  getEmployees,
  deleteEmployee,
  getLeaveRequests,
  updateLeaveRequestStatus,
  getMonthlyAttendance,
  getDepartmentAttendancePercentage,
  getOverallAttendanceDistribution
} from '../../utils/adminDataService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    registeredEmployees: 0,
    listedDepartments: 0,
    listedLeaveTypes: 0,
    leavesApplied: 0,
    newLeaveRequests: 0,
    rejectedLeaveRequests: 0,
    approvedLeaveRequests: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchLeave, setSearchLeave] = useState('');

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyData, setMonthlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const loadAttendanceData = useCallback(() => {
    const monthly = getMonthlyAttendance(selectedYear, selectedMonth);
    setMonthlyData(monthly);
    const dept = getDepartmentAttendancePercentage();
    setDepartmentData(dept);
    const pie = getOverallAttendanceDistribution();
    setPieData(pie);
  }, [selectedYear, selectedMonth]);

  const loadData = useCallback(() => {
    setStats(getDashboardStats());
    setEmployees(getEmployees());
    setLeaveRequests(getLeaveRequests());
    loadAttendanceData();
  }, [loadAttendanceData]);

  useEffect(() => {
    initAdminData();
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Delete this employee?')) {
      deleteEmployee(id);
      loadData();
    }
  };

  const handleUpdateLeaveStatus = (id, status) => {
    updateLeaveRequestStatus(id, status);
    loadData();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  const filteredLeaveRequests = leaveRequests.filter(req =>
    req.employeeName.toLowerCase().includes(searchLeave.toLowerCase()) ||
    req.reason.toLowerCase().includes(searchLeave.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page header (not a box) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of workforce, attendance, and requests</p>
        </div>

        {/* ========== STATS CARDS (each is a separate box) ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Registered Employees</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.registeredEmployees}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
            <div className="text-3xl mb-2">🏢</div>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Listed Departments</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.listedDepartments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Listed Leave Types</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.listedLeaveTypes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
            <div className="text-3xl mb-2">📬</div>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Leave Requests</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.leavesApplied}</p>
          </div>
        </div>

        {/* ========== CHARTS SECTION: two separate boxes side by side ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Box 1: Monthly Attendance (with horizontal scroll) */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Attendance</h3>
              <div className="flex gap-2">
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div style={{ minWidth: '800px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Day of month', position: 'bottom' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#3b82f6" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Box 2: Department Attendance % */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Attendance %</h3>
            <div className="space-y-4">
              {departmentData.map((dept, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{dept.name}</span>
                    <span className="text-gray-600">{dept.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dept.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {departmentData.length === 0 && <p className="text-gray-500 text-center py-4">No attendance data yet.</p>}
            </div>
          </div>
        </div>

        {/* ========== Box 3: Pie Chart ========== */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ========== Box 4: Leave Requests Table ========== */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-xl font-semibold text-gray-800">Leave Requests</h3>
            <input
              type="text"
              placeholder="Search leave requests..."
              value={searchLeave}
              onChange={(e) => setSearchLeave(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaveRequests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdateLeaveStatus(req.id, 'Approved')} className="text-green-600 hover:text-green-800 mr-3 text-sm">Approve</button>
                          <button onClick={() => handleUpdateLeaveStatus(req.id, 'Rejected')} className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredLeaveRequests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">No leave requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== Box 5: Employee Details Table ========== */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-xl font-semibold text-gray-800">Employee Details</h3>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 mr-3 text-sm">✏️ Edit</button>
                      <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;