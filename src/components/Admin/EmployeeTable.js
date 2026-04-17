import React, { useState, useEffect } from 'react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: ''
  });

  // Load mock employees from localStorage or default
  useEffect(() => {
    const stored = localStorage.getItem('adminEmployees');
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      const defaultEmployees = [
        { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', department: 'Engineering', position: 'Software Engineer', phone: '555-0101' },
        { id: 2, name: 'Marcus Johnson', email: 'marcus@example.com', department: 'Design', position: 'Product Designer', phone: '555-0102' },
        { id: 3, name: 'Emily Rodriguez', email: 'emily@example.com', department: 'Marketing', position: 'Marketing Manager', phone: '555-0103' },
        { id: 4, name: 'James Wilson', email: 'james@example.com', department: 'Engineering', position: 'Backend Developer', phone: '555-0104' },
        { id: 5, name: 'Priya Patel', email: 'priya@example.com', department: 'HR', position: 'HR Specialist', phone: '555-0105' },
        { id: 6, name: 'David Kim', email: 'david@example.com', department: 'Engineering', position: 'Frontend Developer', phone: '555-0106' },
        { id: 7, name: 'Lisa Thompson', email: 'lisa@example.com', department: 'Finance', position: 'Accountant', phone: '555-0107' },
      ];
      setEmployees(defaultEmployees);
      localStorage.setItem('adminEmployees', JSON.stringify(defaultEmployees));
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    if (employees.length) localStorage.setItem('adminEmployees', JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', department: '', position: '', phone: '' });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp.id);
    setFormData({ ...emp });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(employees.map(emp =>
        emp.id === editingEmployee ? { ...formData, id: editingEmployee } : emp
      ));
    } else {
      const newId = Math.max(...employees.map(e => e.id), 0) + 1;
      setEmployees([...employees, { ...formData, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Employee
        </button>
      </div>
      <p className="text-gray-600 mb-4">{employees.length} total employees</p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-64"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => openEditModal(emp)} className="text-blue-600 hover:text-blue-800 mr-3">✏️</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded p-2" required /></div>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded p-2" required /></div>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Department</label><input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full border rounded p-2" required /></div>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Position</label><input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full border rounded p-2" required /></div>
              <div className="mb-6"><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded p-2" /></div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingEmployee ? 'Update' : 'Add'} Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;