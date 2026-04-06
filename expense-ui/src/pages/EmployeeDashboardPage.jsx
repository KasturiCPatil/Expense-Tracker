import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Receipt } from 'lucide-react';

export default function EmployeeDashboardPage({ activeUser }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeUser?.id) return;
    setLoading(true);
    api.get(`/expenses/employee/${activeUser.id}`)
      .then(res => {
        setExpenses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeUser?.id]);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Authorized Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-700">
           <User className="text-brand-500" /> <span className="font-medium text-lg">My Expenses Dashboard</span>
        </div>
        <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 border border-slate-200 rounded-lg shadow-inner flex items-center gap-2">
            Securely authenticated as <strong>{activeUser.name}</strong>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center animate-pulse text-slate-400">Loading your profile...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-3 bg-brand-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-bold mb-1">Welcome back, {activeUser.name}</h2>
               <p className="text-brand-100 opacity-80 text-sm">Grade {activeUser.grade} Employee</p>
             </div>
             <div className="bg-brand-700/50 px-6 py-4 rounded-xl border border-brand-500/30">
                <p className="text-brand-100 text-sm mb-1">Your Total Spend</p>
                <p className="text-3xl font-bold">Rs. {totalSpent.toFixed(2)}</p>
             </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2"><Receipt size={18}/> My Expense History</h3>
            
            {expenses.length === 0 ? (
               <p className="text-slate-500 text-sm italic">You haven't logged any expenses yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-lg">Date</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 rounded-tr-lg">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.sort((a,b) => new Date(b.date) - new Date(a.date)).map((exp) => (
                       <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50">
                         <td className="px-6 py-4 text-slate-500">{exp.date}</td>
                         <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md text-xs">{exp.category}</span>
                         </td>
                         <td className="px-6 py-4 font-semibold text-slate-800 text-right">Rs. {exp.amount.toFixed(2)}</td>
                         <td className="px-6 py-4 text-slate-400">
                            {exp.receiptData ? (
                               <a href={exp.receiptData} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline text-xs">View Image</a>
                            ) : "No file"}
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-semibold text-slate-800 mb-6">Spend Summary</h3>
             <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.values(expenses.reduce((acc, exp) => {
                    acc[exp.category] = acc[exp.category] || { name: exp.category, amount: 0 };
                    acc[exp.category].amount += exp.amount;
                    return acc;
                  }, {}))}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
