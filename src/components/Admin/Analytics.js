import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAttendanceRecords, getEmployees } from '../../utils/adminDataService';

const Analytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [lateFrequency, setLateFrequency] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const records = getAttendanceRecords();
    const employees = getEmployees();

    // 1. Attendance trends (last 15 days)
    const last15Days = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      const present = dayRecords.filter(r => r.status === 'Present').length;
      const absent = dayRecords.filter(r => r.status === 'Absent').length;
      last15Days.push({ date: dateStr, present, absent });
    }
    setTrendData(last15Days);

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
      return hour + minute / 60 - 9;
    }).filter(h => h > 0);
    const freqMap = new Map();
    lateHours.forEach(h => {
      const bucket = Math.floor(h * 4) / 4;
      freqMap.set(bucket, (freqMap.get(bucket) || 0) + 1);
    });
    const freqArray = Array.from(freqMap.entries())
      .sort((a,b) => a[0] - b[0])
      .map(([hour, count]) => ({ hour: hour.toFixed(2), count }));
    setLateFrequency(freqArray);
  };

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
    subtitle: { color: '#475569' },
    splitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    card: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' },
    cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' },
    deptItem: { marginBottom: '16px' },
    deptHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' },
    progressBar: { background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden' },
    progressFill: (percent) => ({ width: `${percent}%`, background: '#3b82f6', height: '100%' }),
    chartScrollWrapper: { overflowX: 'auto', width: '100%' },
    chartInner: { minWidth: '600px' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Analytics</h1>
          <p style={styles.subtitle}>In-depth attendance and workforce insights</p>
        </div>

        <div style={styles.splitGrid}>
          {/* Left Column: Attendance Trends */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Attendance Trends (Last 15 days)</h3>
            <div style={styles.chartScrollWrapper}>
              <div style={styles.chartInner}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#22c55e" name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Department Performance + Late Frequency */}
          <div>
            {/* Department Performance */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Department Performance</h3>
              {deptPerformance.map((dept, idx) => (
                <div key={idx} style={styles.deptItem}>
                  <div style={styles.deptHeader}>
                    <span>{dept.name}</span>
                    <span>{dept.percentage}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={styles.progressFill(dept.percentage)}></div>
                  </div>
                </div>
              ))}
              {deptPerformance.length === 0 && <p>No data available.</p>}
            </div>

            {/* Late Login Frequency */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Late Login Frequency (hours late)</h3>
              <div style={styles.chartScrollWrapper}>
                <div style={{ minWidth: '300px' }}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;