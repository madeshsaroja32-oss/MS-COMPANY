import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAttendanceRecords, getEmployees } from '../../utils/adminDataService';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [todayStats, setTodayStats] = useState({ present: 0, late: 0, absent: 0 });

  // Chart state
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [chartMonth, setChartMonth] = useState(new Date().getMonth());
  const [chartData, setChartData] = useState([]);

  // Helper to get all employees (including registered user)
  const getAllEmployees = () => {
    const adminEmps = getEmployees();
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
      const user = JSON.parse(registeredUser);
      const exists = adminEmps.some(emp => emp.email === user.email);
      if (!exists) {
        const newEmp = {
          id: adminEmps.length + 1,
          name: user.name,
          email: user.email,
          department: user.department || 'Not specified',
          position: user.position || 'Employee',
          phone: user.phone || '',
        };
        return [...adminEmps, newEmp];
      }
    }
    return adminEmps;
  };

  // Load attendance records and compute today's stats + chart data for selected month/year
  const loadAttendance = () => {
    const records = getAttendanceRecords();
    const employees = getAllEmployees();
    const enriched = records.map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      return {
        ...rec,
        employeeName: emp ? emp.name : 'Unknown',
        department: emp ? emp.department : 'Unknown',
      };
    });
    enriched.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceRecords(enriched);

    // Today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = enriched.filter(r => r.date === today);
    setTodayStats({
      present: todayRecords.filter(r => r.status === 'Present').length,
      late: todayRecords.filter(r => r.status === 'Late').length,
      absent: todayRecords.filter(r => r.status === 'Absent').length,
    });

    // Chart data for selected month/year
    updateChartData(enriched);
  };

  const updateChartData = (enrichedRecords) => {
    const filtered = enrichedRecords.filter(rec => {
      const [year, month] = rec.date.split('-');
      return parseInt(year) === chartYear && parseInt(month) === chartMonth + 1;
    });
    const dateMap = new Map();
    filtered.forEach(rec => {
      if (!dateMap.has(rec.date)) {
        dateMap.set(rec.date, { date: rec.date, present: 0, late: 0, absent: 0 });
      }
      const entry = dateMap.get(rec.date);
      if (rec.status === 'Present') entry.present++;
      else if (rec.status === 'Late') entry.late++;
      else if (rec.status === 'Absent') entry.absent++;
    });
    const data = Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    setChartData(data);
  };

  useEffect(() => {
    loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When chart year/month changes, recompute chart data from current attendanceRecords
    const employees = getAllEmployees();
    const enriched = attendanceRecords.length ? attendanceRecords : (() => {
      const records = getAttendanceRecords();
      return records.map(rec => {
        const emp = employees.find(e => e.id === rec.employeeId);
        return {
          ...rec,
          employeeName: emp ? emp.name : 'Unknown',
          department: emp ? emp.department : 'Unknown',
        };
      });
    })();
    updateChartData(enriched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartYear, chartMonth]);

  const filteredRecords = attendanceRecords.filter(rec => {
    const matchesSearch = rec.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      rec.department.toLowerCase().includes(search.toLowerCase()) ||
      rec.status.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filterDate ? rec.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1400px', margin: '0 auto' },
    splitGrid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' },
    tableCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
    summaryCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', height: 'fit-content' },
    title: { fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' },
    subtitle: { fontSize: '14px', color: '#475569', marginBottom: '24px' },
    search: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%', maxWidth: '300px', marginBottom: '20px', fontSize: '14px' },
    filter: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%', fontSize: '14px', marginBottom: '20px' },
    tableWrapper: { overflowX: 'auto', marginBottom: '24px' },
    table: { width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '12px' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
    td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' },
    badge: (status) => ({
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      background: status === 'Present' ? '#dcfce7' : status === 'Late' ? '#fef9c3' : '#fee2e2',
      color: status === 'Present' ? '#166534' : status === 'Late' ? '#854d0e' : '#991b1b',
      display: 'inline-block'
    }),
    statItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e2e8f0' },
    statValue: { fontSize: '24px', fontWeight: '700' },
    statLabel: { fontSize: '14px', fontWeight: '500', color: '#475569' },
    chartContainer: { marginTop: '24px' },
    chartTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' },
    chartControls: { display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' },
    select: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.splitGrid}>
          {/* LEFT COLUMN: Attendance Table */}
          <div style={styles.tableCard}>
            <h1 style={styles.title}>Attendance Overview</h1>
            <p style={styles.subtitle}>Daily attendance records</p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by employee, department or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.search}
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={styles.filter}
              />
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Login</th>
                    <th style={styles.th}>Logout</th>
                    <th style={styles.th}>Hours</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(rec => (
                    <tr key={rec.id}>
                      <td style={styles.td}>{rec.employeeName}</td>
                      <td style={styles.td}>{rec.department}</td>
                      <td style={styles.td}>{rec.date}</td>
                      <td style={styles.td}>{rec.loginTime || '—'}</td>
                      <td style={styles.td}>{rec.logoutTime || '—'}</td>
                      <td style={styles.td}>{rec.hours ? `${rec.hours}h` : '—'}</td>
                      <td style={styles.td}>{rec.location || 'N/A'}</td>
                      <td style={styles.td}><span style={styles.badge(rec.status)}>{rec.status}</span></td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ ...styles.td, textAlign: 'center' }}>No attendance records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Today's Summary + Chart */}
          <div style={styles.summaryCard}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Today's Summary</h3>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>✅ Present</span>
              <span style={{ ...styles.statValue, color: '#166534' }}>{todayStats.present}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>⏰ Late</span>
              <span style={{ ...styles.statValue, color: '#854d0e' }}>{todayStats.late}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>❌ Absent</span>
              <span style={{ ...styles.statValue, color: '#991b1b' }}>{todayStats.absent}</span>
            </div>

            {/* Chart with month/year selector */}
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Monthly Attendance</h3>
              <div style={styles.chartControls}>
                <select value={chartYear} onChange={(e) => setChartYear(parseInt(e.target.value))} style={styles.select}>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={chartMonth} onChange={(e) => setChartMonth(parseInt(e.target.value))} style={styles.select}>
                  {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
                </select>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#22c55e" name="Present" />
                    <Bar dataKey="late" fill="#eab308" name="Late" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>No data for selected month</p>
              )}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Total employees: {(() => {
                const adminEmps = getEmployees();
                const regUser = localStorage.getItem('registeredUser');
                let total = adminEmps.length;
                if (regUser) {
                  const user = JSON.parse(regUser);
                  if (!adminEmps.some(e => e.email === user.email)) total++;
                }
                return total;
              })()}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Date: {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;