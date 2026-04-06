import React, { useState, useEffect } from 'react';
import api from '../api';
import { Camera, Check, AlertCircle } from 'lucide-react';

export default function ExpenseCapturePage({ activeUser }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    receiptFileName: '',
    receiptData: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          receiptFileName: file.name,
          receiptData: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic frontend validation
    if (!activeUser || !activeUser.id) {
      setError("Active user session not found. Please log in again.");
      setLoading(false);
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      setLoading(false);
      return;
    }

    try {
      await api.post('/expenses', {
        ...formData,
        employeeId: activeUser.id,
        amount: parseFloat(formData.amount)
      });
      setSuccess(true);
      setFormData({ ...formData, amount: '' }); // reset amount
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Capture New Expense</h2>
      
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200">
          <Check className="text-green-500" />
          <span>Expense captured successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
          <AlertCircle className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">Filing As</label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 font-medium cursor-not-allowed">
                 {activeUser.name} (Grade {activeUser.grade})
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-slate-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">Amount (Rs)</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 500.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-slate-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-slate-700"
              >
                <option value="Food">Food & Dining</option>
                <option value="Travel">Travel & Transport</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 block">Receipt Image (Optional)</label>
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-brand-300 transition-all cursor-pointer relative overflow-hidden group">
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
              
              {formData.receiptData ? (
                <>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-sm font-medium px-3 py-1 rounded-full shadow-sm text-slate-700">Change Photo</span>
                  </div>
                  <img src={formData.receiptData} alt="Receipt preview" className="absolute inset-0 w-full h-full object-cover" />
                </>
              ) : (
                <>
                  <Camera size={32} className="text-slate-400 mb-3" />
                  <p className="text-sm">{formData.receiptFileName || "Click to upload receipt photo"}</p>
                  <p className="text-xs text-slate-400 mt-1">supports JPG, PNG (Max 2MB)</p>
                </>
              )}
            </label>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm shadow-brand-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? "Submitting..." : "Submit Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
