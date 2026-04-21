// adminDataService.js
const STORAGE_KEYS = {
  EMPLOYEES: 'admin_employees',
  DEPARTMENTS: 'admin_departments',
  LEAVE_TYPES: 'admin_leave_types',
  LEAVE_REQUESTS: 'admin_leave_requests',
  SALARY_RECORDS: 'admin_salary_records',
  ATTENDANCE_RECORDS: 'attendance_records',
};

// Initialize mock data (including attendance records for the last 6 months)
export const initAdminData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    const mockEmployees = [
      { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', department: 'Engineering', position: 'Software Engineer', phone: '555-0101' },
      { id: 2, name: 'Marcus Johnson', email: 'marcus@example.com', department: 'Design', position: 'Product Designer', phone: '555-0102' },
      { id: 3, name: 'Emily Rodriguez', email: 'emily@example.com', department: 'Marketing', position: 'Marketing Manager', phone: '555-0103' },
      { id: 4, name: 'James Wilson', email: 'james@example.com', department: 'Engineering', position: 'Backend Developer', phone: '555-0104' },
      { id: 5, name: 'Priya Patel', email: 'priya@example.com', department: 'HR', position: 'HR Specialist', phone: '555-0105' },
      { id: 6, name: 'David Kim', email: 'david@example.com', department: 'Engineering', position: 'Frontend Developer', phone: '555-0106' },
      { id: 7, name: 'Lisa Thompson', email: 'lisa@example.com', department: 'Finance', position: 'Accountant', phone: '555-0107' },
    ];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(mockEmployees));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Design', 'Finance'];
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_TYPES)) {
    const leaveTypes = [
      { id: 1, name: 'Sick Leave', days: 12 },
      { id: 2, name: 'Casual Leave', days: 10 },
      { id: 3, name: 'Annual Leave', days: 20 },
    ];
    localStorage.setItem(STORAGE_KEYS.LEAVE_TYPES, JSON.stringify(leaveTypes));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) {
    const leaveRequests = [
      { id: 1, employeeId: 1, employeeName: 'Sarah Chen', startDate: '2025-05-10', endDate: '2025-05-12', reason: 'Sick', status: 'Pending' },
      { id: 2, employeeId: 2, employeeName: 'Marcus Johnson', startDate: '2025-05-15', endDate: '2025-05-20', reason: 'Vacation', status: 'Approved' },
      { id: 3, employeeId: 3, employeeName: 'Emily Rodriguez', startDate: '2025-06-01', endDate: '2025-06-03', reason: 'Personal', status: 'Pending' },
    ];
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(leaveRequests));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALARY_RECORDS)) {
    const salaryRecords = [
      { id: 1, employeeId: 1, employeeName: 'Sarah Chen', basic: 50000, allowance: 10000, deduction: 5000, net: 55000 },
      { id: 2, employeeId: 2, employeeName: 'Marcus Johnson', basic: 60000, allowance: 12000, deduction: 6000, net: 66000 },
    ];
    localStorage.setItem(STORAGE_KEYS.SALARY_RECORDS, JSON.stringify(salaryRecords));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)) {
    const employees = getEmployees();
    const today = new Date();
    const records = [];
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      employees.forEach(emp => {
        const rand = Math.random();
        let status = 'Present';
        if (rand < 0.1) status = 'Absent';
        else if (rand < 0.2) status = 'Late';
        let loginTime = null, logoutTime = null, hours = null;
        if (status !== 'Absent') {
          const hour = status === 'Late' ? 9 + Math.floor(Math.random() * 2) : 9;
          const minute = Math.floor(Math.random() * 60);
          loginTime = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;
          logoutTime = '17:30';
          hours = 8 + (Math.random() * 0.5).toFixed(2);
        }
        records.push({
          id: records.length + 1,
          employeeId: emp.id,
          employeeName: emp.name,
          date: dateStr,
          loginTime,
          logoutTime,
          hours: hours ? parseFloat(hours) : null,
          status,
          location: 'San Francisco, CA'
        });
      });
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(records));
  }
};

// Employees
export const getEmployees = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
export const addEmployee = (employee) => {
  const employees = getEmployees();
  const newId = Math.max(...employees.map(e => e.id), 0) + 1;
  employees.push({ ...employee, id: newId });
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return newId;
};
export const updateEmployee = (id, updatedData) => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }
};
export const deleteEmployee = (id) => {
  const employees = getEmployees().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

// Departments
export const getDepartments = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) || [];

// Leave Types
export const getLeaveTypes = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVE_TYPES)) || [];

// Leave Requests
export const getLeaveRequests = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) || [];
export const addLeaveRequest = (request) => {
  const requests = getLeaveRequests();
  const newId = Math.max(...requests.map(r => r.id), 0) + 1;
  requests.push({ ...request, id: newId, status: 'Pending' });
  localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
};
export const updateLeaveRequestStatus = (id, status) => {
  const requests = getLeaveRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
  }
};

// Attendance Records
export const getAttendanceRecords = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)) || [];

// Dashboard stats
export const getDashboardStats = () => {
  const employees = getEmployees();
  const departments = getDepartments();
  const leaveTypes = getLeaveTypes();
  const leaveRequests = getLeaveRequests();
  const leavesApplied = leaveRequests.length;
  const newLeaveRequests = leaveRequests.filter(r => r.status === 'Pending').length;
  const rejectedLeaveRequests = leaveRequests.filter(r => r.status === 'Rejected').length;
  const approvedLeaveRequests = leaveRequests.filter(r => r.status === 'Approved').length;
  return {
    registeredEmployees: employees.length,
    listedDepartments: departments.length,
    listedLeaveTypes: leaveTypes.length,
    leavesApplied,
    newLeaveRequests,
    rejectedLeaveRequests,
    approvedLeaveRequests,
  };
};

// Monthly attendance data (real)
export const getMonthlyAttendance = (year, month) => {
  const records = getAttendanceRecords();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const presentCountByDay = Array(daysInMonth).fill(0);
  const absentCountByDay = Array(daysInMonth).fill(0);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayRecords = records.filter(r => r.date === dateStr);
    if (dayRecords.length === 0) continue;
    const present = dayRecords.filter(r => r.status === 'Present').length;
    const absent = dayRecords.filter(r => r.status === 'Absent').length;
    presentCountByDay[day-1] = present;
    absentCountByDay[day-1] = absent;
  }
  const chartData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    chartData.push({
      name: `${day}`,
      present: presentCountByDay[day-1],
      absent: absentCountByDay[day-1],
    });
  }
  return chartData;
};

// Department attendance percentages (real) – FIXED: removed unused 'employees' variable
export const getDepartmentAttendancePercentage = () => {
  const employees = getEmployees(); // actually used below for department mapping
  const records = getAttendanceRecords();
  const deptMap = new Map();
  employees.forEach(emp => {
    if (!deptMap.has(emp.department)) {
      deptMap.set(emp.department, { totalDays: 0, presentDays: 0 });
    }
  });
  records.forEach(rec => {
    const emp = employees.find(e => e.id === rec.employeeId);
    if (emp) {
      const deptStats = deptMap.get(emp.department);
      if (deptStats) {
        deptStats.totalDays++;
        if (rec.status === 'Present') deptStats.presentDays++;
      }
    }
  });
  const result = [];
  for (let [dept, stats] of deptMap.entries()) {
    const percentage = stats.totalDays === 0 ? 0 : (stats.presentDays / stats.totalDays) * 100;
    result.push({ name: dept, percentage: Math.round(percentage) });
  }
  return result;
};

// Overall attendance distribution
export const getOverallAttendanceDistribution = () => {
  const records = getAttendanceRecords();
  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const late = records.filter(r => r.status === 'Late').length;
  const total = present + absent + late;
  if (total === 0) return [{ name: 'Present', value: 0, color: '#3b82f6' }, { name: 'Absent', value: 0, color: '#ef4444' }, { name: 'Late', value: 0, color: '#eab308' }];
  return [
    { name: 'Present', value: (present / total) * 100, color: '#3b82f6' },
    { name: 'Absent', value: (absent / total) * 100, color: '#ef4444' },
    { name: 'Late', value: (late / total) * 100, color: '#eab308' },
  ];
};