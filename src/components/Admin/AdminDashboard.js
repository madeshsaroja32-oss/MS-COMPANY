/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  initAdminData,
  getEmployees,
  getAttendanceRecords,
  getMonthlyAttendanceWithLate,
  getDepartmentAttendancePercentage
} from '../../utils/adminDataService';

const AdminDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [lateToday, setLateToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyData, setMonthlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const loadDashboardData = useCallback(() => {
    const employees = getEmployees();
    setTotalEmployees(employees.length);

    const today = new Date().toISOString().split('T')[0];
    const allRecords = getAttendanceRecords();
    const todayRecords = allRecords.filter(r => r.date === today);
    setPresentToday(todayRecords.filter(r => r.status === 'Present').length);
    setLateToday(todayRecords.filter(r => r.status === 'Late').length);
    setAbsentToday(todayRecords.filter(r => r.status === 'Absent').length);

    const monthly = getMonthlyAttendanceWithLate(selectedYear, selectedMonth);
    setMonthlyData(monthly);

    setDepartmentData(getDepartmentAttendancePercentage());
  }, [selectedYear, selectedMonth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    initAdminData();
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [selectedYear, selectedMonth]);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
    subtitle: { color: '#475569' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' },
    metricCard: (color) => ({
      background: color,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
      color: 'white',
    }),
    metricValue: { fontSize: '32px', fontWeight: '700', marginTop: '8px' },
    metricLabel: { fontSize: '14px', fontWeight: '500', opacity: 0.9 },
    splitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    chartCard: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
    chartTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' },
    deptItem: { marginBottom: '16px' },
    deptHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' },
    progressBar: { background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden' },
    progressFill: (percent) => ({ width: `${percent}%`, background: '#3b82f6', height: '100%' }),
    chartScrollWrapper: { overflowX: 'auto', width: '100%' },
    chartInner: { minWidth: '800px' },
    scrollButton: {
      display: 'block',
      margin: '0 auto 32px auto',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'background 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Overview of workforce and attendance</p>
        </div>

        <div style={styles.metricsGrid}>
          <div style={styles.metricCard('#3b82f6')}><div style={styles.metricLabel}>Total Employees</div><div style={styles.metricValue}>{totalEmployees}</div></div>
          <div style={styles.metricCard('#22c55e')}><div style={styles.metricLabel}>Present Today</div><div style={styles.metricValue}>{presentToday}</div></div>
          <div style={styles.metricCard('#eab308')}><div style={styles.metricLabel}>Late Arrivals</div><div style={styles.metricValue}>{lateToday}</div></div>
          <div style={styles.metricCard('#ef4444')}><div style={styles.metricLabel}>Absent</div><div style={styles.metricValue}>{absentToday}</div></div>
        </div>

        <button onClick={scrollToBottom} style={styles.scrollButton}>
          ↓ Scroll Down to Charts & Department Data
        </button>

        <div style={styles.splitGrid}>
          <div style={styles.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <h3 style={styles.chartTitle}>Monthly Attendance</h3>
              <div>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ padding: '4px 8px', borderRadius: '6px', marginRight: '8px' }}>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} style={{ padding: '4px 8px', borderRadius: '6px' }}>
                  {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.chartScrollWrapper}>
              <div style={styles.chartInner}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Day of month', position: 'bottom' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#22c55e" name="Present" />
                    <Bar dataKey="late" fill="#eab308" name="Late" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Department Attendance %</h3>
            {departmentData.map((dept, idx) => (
              <div key={idx} style={styles.deptItem}>
                <div style={styles.deptHeader}><span>{dept.name}</span><span>{dept.percentage}%</span></div>
                <div style={styles.progressBar}><div style={styles.progressFill(dept.percentage)}></div></div>
              </div>
            ))}
            {departmentData.length === 0 && <p>No attendance data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;