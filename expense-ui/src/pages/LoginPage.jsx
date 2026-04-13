import React, { useState } from 'react';
import api from '../api';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const res = await api.post('/auth/login', { username, password });

    console.log("Login success:", res.data); // debug

    onLoginSuccess(res.data);

    if (res.data.role === "ADMIN") {
      navigate("/");
    } else {
      navigate("/my-expenses");
    }

  } catch (err) {
    if (!err.response) {
      setError("Cannot connect to server. Ensure Backend is running!");
    } else {
      setError(err.response.data || "Invalid credentials.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-brand-100/50 border border-slate-100 overflow-hidden">
        <div className="bg-brand-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-3">
             <span className="text-4xl">💸</span> Expensify
          </h1>
          <p className="opacity-80 mt-2 text-sm">Sign in to your global workspace account</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Username (e.g. admin or Alice Smith)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-slate-700 font-medium"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-slate-700 font-medium"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-brand-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
