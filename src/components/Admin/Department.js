import React from 'react';
import styles from './Department.module.css';

const Department = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Department Management</h1>
      <div className={styles.card}>
        <p className="text-gray-500">List of departments will appear here.</p>
      </div>
    </div>
  );
};

export default Department;