import React from 'react';
import styles from './LeaveType.module.css';

const LeaveType = () => {
  const leaveTypes = [
    { id: 1, name: 'Sick Leave', days: 12 },
    { id: 2, name: 'Casual Leave', days: 10 },
    { id: 3, name: 'Annual Leave', days: 20 },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Leave Type Management</h1>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>Leave Type</th><th>Allowed Days</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leaveTypes.map(type => (
              <tr key={type.id}>
                <td>{type.name}</td>
                <td>{type.days}</td>
                <td><button className={styles.editBtn}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.addBtn}>+ Add Leave Type</button>
      </div>
    </div>
  );
};

export default LeaveType;