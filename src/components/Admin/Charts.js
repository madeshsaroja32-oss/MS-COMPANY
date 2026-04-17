import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Charts = () => {
  const monthlyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Present', data: [45, 48, 42, 50], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
      { label: 'Absent', data: [5, 2, 8, 0], backgroundColor: 'rgba(255, 99, 132, 0.6)' }
    ]
  };

  const deptData = {
    labels: ['Engineering', 'Sales', 'HR', 'Marketing'],
    datasets: [{ data: [30, 20, 15, 10], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Attendance Analytics</h2>
      <div className="grid grid-cols-2 gap-6">
        <div><h3 className="font-semibold mb-2">Monthly Attendance</h3><Bar data={monthlyData} /></div>
        <div><h3 className="font-semibold mb-2">Department-wise Attendance</h3><Pie data={deptData} /></div>
      </div>
    </div>
  );
};

export default Charts;