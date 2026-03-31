import React, { useState } from 'react';
import API from '../../utils/api';

const LeaveRequest = ({ onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/leave', formData);
      setMessage('Leave request submitted successfully');
      setFormData({ startDate: '', endDate: '', reason: '' });
      if (onRequestSubmitted) onRequestSubmitted();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Request Leave</h2>
      {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
            rows="3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequest;