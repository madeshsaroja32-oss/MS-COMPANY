import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  getAttendanceRecords,
  getEmployees,
  getLeaveRequests,
  updateLeaveRequestStatus
} from '../../utils/adminDataService';

const Analytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [lateFrequency, setLateFrequency] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const loadAnalytics = useCallback(() => {
    const records = (typeof getAttendanceRecords === 'function' && getAttendanceRecords()) || [];
    const employees = (typeof getEmployees === 'function' && getEmployees()) || [];

    // Attendance trends (last 15 days)
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

    // Department performance
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

    // Late login frequency
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
      .sort((a, b) => a[0] - b[0])
      .map(([hour, count]) => ({ hour: hour.toFixed(2), count }));
    setLateFrequency(freqArray);

    // Leave requests enriched with employee photo
    const allLeaveRequests = (typeof getLeaveRequests === 'function' && getLeaveRequests()) || [];
    const enriched = allLeaveRequests.map(req => {
      const emp = employees.find(e => e.id === req.employeeId || e.name === req.employeeName);
      return { ...req, photo: emp?.photo || null };
    });
    setLeaveRequests(enriched);
  }, []);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = (id, status) => {
    if (typeof updateLeaveRequestStatus === 'function') {
      updateLeaveRequestStatus(id, status);
      loadAnalytics();
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(req =>
    filterStatus === 'all' ? true : req.status === filterStatus
  );

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1400px', margin: '0 auto' },
    splitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' },
    card: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px', height: '100%' },
    cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' },
    deptItem: { marginBottom: '16px' },
    deptHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' },
    progressBar: { background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden' },
    progressFill: (percent) => ({ width: `${percent}%`, background: '#3b82f6', height: '100%' }),
    scrollWrapper: { overflowX: 'auto', width: '100%' },
    chartInner: { minWidth: '600px' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '12px' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
    td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' },
    badge: (status) => ({
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      background: status === 'Approved' ? '#dcfce7' : status === 'Rejected' ? '#fee2e2' : '#fef9c3',
      color: status === 'Approved' ? '#166534' : status === 'Rejected' ? '#991b1b' : '#854d0e',
      display: 'inline-block'
    }),
    filterSelect: { padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', marginLeft: '12px' },
    button: (bg) => ({ background: bg, color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '8px' }),
    photoThumb: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Split screen */}
        <div style={styles.splitGrid}>
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Attendance Trends (Last 15 days)</h3>
              <div style={styles.scrollWrapper}>
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
          </div>
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Department Performance</h3>
              {deptPerformance.length > 0 ? deptPerformance.map((dept, idx) => (
                <div key={idx} style={styles.deptItem}>
                  <div style={styles.deptHeader}>
                    <span>{dept.name}</span>
                    <span>{dept.percentage}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={styles.progressFill(dept.percentage)}></div>
                  </div>
                </div>
              )) : <p>No department attendance data available.</p>}
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Late Login Frequency (hours late)</h3>
              <div style={styles.scrollWrapper}>
                <div style={styles.chartInner}>
                  {lateFrequency.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={lateFrequency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" label={{ value: 'Hours late', position: 'bottom' }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#eab308" name="Employees" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p>No late login data available.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table with Photo */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h3 style={styles.cardTitle}>Leave Requests</h3>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Photo</th>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>End Date</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaveRequests.map(req => (
                  <tr key={req.id}>
                    <td style={styles.td}>
                      {req.photo ? (
                        <img src={req.photo} alt={req.employeeName} style={styles.photoThumb} />
                      ) : (
                        <span style={{ ...styles.photoThumb, display: 'inline-block', textAlign: 'center', lineHeight: '32px' }}>📷</span>
                      )}
                    </td>
                    <td style={styles.td}>{req.employeeName}</td>
                    <td style={styles.td}>{req.startDate}</td>
                    <td style={styles.td}>{req.endDate}</td>
                    <td style={styles.td}>{req.reason}</td>
                    <td style={styles.td}><span style={styles.badge(req.status)}>{req.status}</span></td>
                    <td style={styles.td}>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(req.id, 'Approved')} style={styles.button('#10b981')}>Approve</button>
                          <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} style={styles.button('#ef4444')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredLeaveRequests.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center' }}>No leave requests found</td>
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

export default Analytics;