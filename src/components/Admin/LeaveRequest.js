import React from 'react';
import styles from './LeaveRequests.module.css';

const LeaveRequests = () => {
  // Mock data – replace with API later
  const requests = [
    { id: 1, employee: 'John Doe', start: '2024-05-10', end: '2024-05-12', reason: 'Sick leave', status: 'Pending' },
    { id: 2, employee: 'Jane Smith', start: '2024-05-15', end: '2024-05-20', reason: 'Vacation', status: 'Approved' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Leave Requests Management</h1>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.employee}</td>
                <td>{req.start}</td>
                <td>{req.end}</td>
                <td>{req.reason}</td>
                <td><span className={req.status === 'Approved' ? styles.approved : styles.pending}>{req.status}</span></td>
                <td>
                  <button className={styles.approveBtn}>Approve</button>
                  <button className={styles.rejectBtn}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;