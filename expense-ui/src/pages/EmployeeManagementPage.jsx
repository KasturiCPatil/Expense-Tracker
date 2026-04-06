import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Trash2, Edit2, Plus, X, Check } from 'lucide-react';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('1');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await api.post('/employees', { name: newName, grade: parseInt(newGrade) });
      setNewName('');
      setNewGrade('1');
      fetchEmployees();
    } catch (err) {
      alert("Failed to add employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert("Failed to delete. Ensure they have no active expenses.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-brand-900 rounded-2xl p-6 text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><Users /> Employee Management</h2>
          <p className="text-brand-100 opacity-80 text-sm">Add, Update, or Delete organization employees.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         {/* Add New form */}
         <div className="p-6 border-b border-slate-100 bg-slate-50">
           <form onSubmit={handleAdd} className="flex gap-4 items-end">
             <div className="space-y-2 flex-1">
               <label className="text-sm font-medium text-slate-600 block">Employee Name</label>
               <input 
                 type="text" 
                 value={newName}
                 onChange={e => setNewName(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-brand-500" 
                 placeholder="e.g. John Doe"
                 required
               />
             </div>
             <div className="space-y-2 w-32">
               <label className="text-sm font-medium text-slate-600 block">Grade</label>
               <input 
                 type="number" 
                 min="1"
                 max="20"
                 value={newGrade}
                 onChange={e => setNewGrade(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-brand-500" 
                 required
               />
             </div>
             <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 h-[42px] rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <Plus size={18} /> Add
             </button>
           </form>
         </div>

         {/* Table */}
         <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && employees.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : employees.map(emp => (
                 <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">#{emp.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{emp.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-semibold">Grade {emp.grade}</span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                       <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </td>
                 </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
