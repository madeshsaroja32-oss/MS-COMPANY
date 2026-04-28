import React, { useState, useEffect } from 'react';
import { getAttendanceRecords, getEmployees } from '../../utils/adminDataService';
import api from '../../utils/api';   // add this line at the top
const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll event listener to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          address: user.address || 'Not provided',
          location: user.location || { lat: null, lng: null, address: 'Not captured' }
        };
        return [...adminEmps, newEmp];
      } else {
        const updated = adminEmps.map(emp => {
          if (emp.email === user.email && (!emp.address || !emp.location)) {
            return {
              ...emp,
              address: emp.address || user.address,
              location: emp.location || user.location
            };
          }
          return emp;
        });
        return updated;
      }
    }
    return adminEmps;
  };

  const loadAttendance = () => {
    const records = getAttendanceRecords();
    const employees = getAllEmployees();
    const enriched = records.map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      return {
        ...rec,
        employeeName: emp ? emp.name : 'Unknown',
        department: emp ? emp.department : 'Unknown',
        employeeAddress: emp ? (emp.address || 'Not provided') : 'Unknown',
      };
    });
    enriched.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceRecords(enriched);
  };

  useEffect(() => {
    loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = attendanceRecords.filter(rec => {
    const matchesSearch = (rec.employeeName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (rec.department?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (rec.status?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesDate = filterDate ? rec.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const openPhotoModal = (photo) => {
    if (photo) {
      setSelectedPhoto(photo);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPhoto(null);
  };

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1180px', margin: '0 auto' },
    tableCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
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
    photoThumb: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0', cursor: 'pointer' },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto',
    },
    modalImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      borderRadius: '8px',
    },
    closeBtn: {
      marginTop: '12px',
      padding: '8px 16px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    scrollButton: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#3b82f6',
      color: 'white',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      border: 'none',
      fontSize: '24px',
      zIndex: 100,
      transition: 'opacity 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      {showScrollButton && (
        <button style={styles.scrollButton} onClick={scrollToTop} title="Scroll to top">
          ↑
        </button>
      )}
      <div style={styles.wrapper}>
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
                  <th style={styles.th}>Photo</th>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Employee Address</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Login Time</th>
                  <th style={styles.th}>Logout Time</th>
                  <th style={styles.th}>Hours</th>
                  <th style={styles.th}>Login Location</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(rec => (
                  <tr key={rec.id}>
                    <td style={styles.td}>
                      {rec.photo ? (
                        <img
                          src={rec.photo}
                          alt="attendance"
                          style={styles.photoThumb}
                          onClick={() => openPhotoModal(rec.photo)}
                          title="Click to enlarge"
                        />
                      ) : (
                        <span style={{ ...styles.photoThumb, display: 'inline-block', textAlign: 'center', lineHeight: '40px', cursor: 'default' }}>📷</span>
                      )}
                    </td>
                    <td style={styles.td}>{rec.employeeName}</td>
                    <td style={styles.td}>{rec.department}</td>
                    <td style={styles.td}>{rec.employeeAddress || '—'}</td>
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
                    <td colSpan="10" style={{ ...styles.td, textAlign: 'center' }}>No attendance records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for enlarged photo */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Captured attendance" style={styles.modalImage} />
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={closeModal} style={styles.closeBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;