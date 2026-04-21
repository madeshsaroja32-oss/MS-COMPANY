import React from 'react';
import styles from './Report.module.css';

const Report = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reports</h1>
      <div className={styles.card}>
        <p>Generate and download reports:</p>
        <div className={styles.buttonGroup}>
          <button className={styles.reportBtn}>📊 Employee Attendance Report</button>
          <button className={styles.reportBtn}>💰 Salary Report</button>
          <button className={styles.reportBtn}>📋 Leave Report</button>
        </div>
      </div>
    </div>
  );
};

export default Report;