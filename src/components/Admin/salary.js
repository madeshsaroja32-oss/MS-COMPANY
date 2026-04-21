import React from 'react';
import styles from './Salary.module.css';

const Salary = () => {
  const salaryData = [
    { id: 1, employee: 'John Doe', basic: 50000, allowance: 10000, deduction: 5000, net: 55000 },
    { id: 2, employee: 'Jane Smith', basic: 60000, allowance: 12000, deduction: 6000, net: 66000 },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Salary Management</h1>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>Employee</th><th>Basic</th><th>Allowance</th><th>Deduction</th><th>Net Salary</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {salaryData.map(emp => (
              <tr key={emp.id}>
                <td>{emp.employee}</td>
                <td>₹{emp.basic}</td>
                <td>₹{emp.allowance}</td>
                <td>₹{emp.deduction}</td>
                <td>₹{emp.net}</td>
                <td><button className={styles.editBtn}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.addBtn}>+ Process Payroll</button>
      </div>
    </div>
  );
};

export default Salary;