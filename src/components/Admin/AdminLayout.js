import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    container: { display: 'flex', height: '100vh', background: '#f1f5f9' },
    sidebar: { width: '280px', background: '#1e293b', color: '#cbd5e1', display: 'flex', flexDirection: 'column' },
    sidebarHeader: { padding: '24px', borderBottom: '1px solid #334155' },
    sidebarTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 },
    sidebarSub: { fontSize: '12px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase' },
    nav: { flex: 1, padding: '16px' },
    navLabel: { fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' },
    navLink: { display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '8px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '4px' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { background: 'white', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    headerLeft: { fontSize: '20px', fontWeight: '600', color: '#1e293b' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' },
    userDetails: { textAlign: 'right' },
    userName: { fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 },
    userEmail: { fontSize: '12px', color: '#64748b', margin: 0 },
    logoutBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    content: { flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Employee MS</h2>
          <p style={styles.sidebarSub}>Admin Panel</p>
        </div>
        <nav style={styles.nav}>
          <p style={styles.navLabel}>Main Navigation</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><Link to="/admin" style={styles.navLink} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><span style={{ marginRight: '12px' }}>📊</span> Dashboard</Link></li>
            <li><Link to="/admin/attendance" style={styles.navLink} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><span style={{ marginRight: '12px' }}>📆</span> Attendance</Link></li>
            <li><Link to="/admin/employees" style={styles.navLink} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><span style={{ marginRight: '12px' }}>👥</span> Employees</Link></li>
            <li><Link to="/admin/analytics" style={styles.navLink} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><span style={{ marginRight: '12px' }}>📈</span> Analytics</Link></li>
          </ul>
        </nav>
      </aside>
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>Admin</div>
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userDetails}>
                <p style={styles.userName}>{user?.name || 'Administrator'}</p>
                <p style={styles.userEmail}>{user?.email || 'admin@mscompany.com'}</p>
              </div>
              <div style={styles.avatar}>A</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </header>
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;