import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee, addEmployee } from '../../utils/adminDataService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
  });

  const getAllEmployees = () => {
    let adminEmps = getEmployees();
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
      const user = JSON.parse(registeredUser);
      const existsIndex = adminEmps.findIndex(emp => emp.email === user.email);
      if (existsIndex === -1) {
        const newEmp = {
          id: adminEmps.length + 1,
          name: user.name,
          email: user.email,
          department: user.department || 'Not specified',
          position: user.position || 'Employee',
          phone: user.phone || '',
          address: user.address || '',
          photo: user.photo || '',        // 👈 store photo
          location: user.location || { lat: null, lng: null, address: 'Not captured' }
        };
        adminEmps.push(newEmp);
        localStorage.setItem('admin_employees', JSON.stringify(adminEmps));
      } else {
        const existing = adminEmps[existsIndex];
        // update missing fields
        let updated = false;
        if (!existing.address && user.address) {
          existing.address = user.address;
          updated = true;
        }
        if (!existing.photo && user.photo) {
          existing.photo = user.photo;
          updated = true;
        }
        if (updated) {
          localStorage.setItem('admin_employees', JSON.stringify(adminEmps));
        }
      }
    }
    return adminEmps;
  };

  const loadEmployees = () => {
    const allEmps = getAllEmployees();
    setEmployees(allEmps);
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      loadEmployees();
    }
  };

  const handleAddEmployee = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', department: '', position: '', phone: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }
    addEmployee(formData);
    handleModalClose();
    loadEmployees();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const deptCount = {};
  employees.forEach(emp => {
    deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
  });
  const deptBreakdown = Object.entries(deptCount).slice(0, 5);

  const formatLocation = (location) => {
    if (!location) return '—';
    if (location.address && location.address !== 'Not captured') return location.address;
    if (location.lat && location.lng) return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    return 'Not captured';
  };

  const styles = {
    container: { background: '#f8fafc', minHeight: '100vh', padding: '24px' },
    wrapper: { maxWidth: '1400px', margin: '0 auto' },
    splitGrid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' },
    tableCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
    summaryCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', height: 'fit-content' },
    title: { fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' },
    subtitle: { fontSize: '14px', color: '#475569', marginBottom: '24px' },
    search: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%', maxWidth: '300px', marginBottom: '20px', fontSize: '14px' },
    addBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginLeft: 'auto' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '12px' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
    td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' },
    deleteBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    statItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' },
    modalTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' },
    modalButtons: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' },
    cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    saveBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    photoThumb: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.splitGrid}>
          {/* LEFT COLUMN: Employee Table */}
          <div style={styles.tableCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <h1 style={styles.title}>Employees</h1>
              <button onClick={handleAddEmployee} style={styles.addBtn}>+ Add Employee</button>
            </div>
            <p style={styles.subtitle}>{employees.length} total employees</p>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Photo</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Position</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td style={styles.td}>
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.name} style={styles.photoThumb} />
                        ) : (
                          <span style={{ ...styles.photoThumb, display: 'inline-block', textAlign: 'center', lineHeight: '40px' }}>📷</span>
                        )}
                      </td>
                      <td style={styles.td}>{emp.name}</td>
                      <td style={styles.td}>{emp.email}</td>
                      <td style={styles.td}>{emp.department}</td>
                      <td style={styles.td}>{emp.position}</td>
                      <td style={styles.td}>{emp.phone}</td>
                      <td style={styles.td}>{emp.address || '—'}</td>
                      <td style={styles.td}>{formatLocation(emp.location)}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleDelete(emp.id)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ ...styles.td, textAlign: 'center' }}>No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary Card (unchanged) */}
          <div style={styles.summaryCard}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Summary</h3>
            <div style={styles.statItem}>
              <span>Total Employees</span>
              <span style={{ fontWeight: '700' }}>{employees.length}</span>
            </div>
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Department Breakdown</h4>
              {deptBreakdown.map(([dept, count]) => (
                <div key={dept} style={styles.statItem}>
                  <span>{dept}</span>
                  <span>{count}</span>
                </div>
              ))}
              {deptBreakdown.length === 0 && <p style={{ fontSize: '12px', color: '#64748b' }}>No departments</p>}
            </div>
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add Employee (unchanged) */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Add New Employee</h3>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} style={styles.input} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={styles.input} required />
            <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} style={styles.input} />
            <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} style={styles.input} />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={handleModalClose} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSaveEmployee} style={styles.saveBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;