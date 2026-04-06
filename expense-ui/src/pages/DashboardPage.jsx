import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/expenses')
      .then(res => {
        setExpenses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load expenses dashboard data", err);
        setLoading(false);
      });
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category for pie chart
  const categoryData = Object.values(expenses.reduce((acc, exp) => {
    acc[exp.category] = acc[exp.category] || { name: exp.category, value: 0 };
    acc[exp.category].value += exp.amount;
    return acc;
  }, {}));

  const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-brand-600 rounded-2xl p-6 text-white shadow-lg shadow-brand-200">
        <div>
          <h2 className="text-3xl font-bold mb-1">Company Dashboard</h2>
          <p className="text-brand-100 flex-opacity-80">Admin overview of all employee expenses</p>
        </div>
        <div className="bg-brand-700/50 px-6 py-4 rounded-xl border border-brand-500/30">
          <p className="text-brand-100 text-sm mb-1">Total Organization Spend</p>
          <p className="text-3xl font-bold">Rs. {totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><p className="text-slate-400 animate-pulse">Loading analytics...</p></div>
      ) : expenses.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-200 text-slate-500">No expenses recorded yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">Recent Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Employee ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map((exp) => (
                     <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium text-slate-700">Emp #{exp.employeeId}</td>
                       <td className="px-6 py-4 text-slate-500">{exp.date}</td>
                       <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md text-xs">{exp.category}</span>
                       </td>
                       <td className="px-6 py-4 font-semibold text-slate-800">Rs. {exp.amount.toFixed(2)}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6">Spend by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs. ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
