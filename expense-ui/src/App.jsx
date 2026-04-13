import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, PlusCircle, MessageCircle, User, Users, LogOut } from 'lucide-react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import ExpenseCapturePage from './pages/ExpenseCapturePage';
import ChatInterfacePage from './pages/ChatInterfacePage';

// NavLink Component
function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isActive
          ? 'bg-brand-50 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
      {children}
    </Link>
  );
}

// Sidebar Component
function Sidebar({ user, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-600 flex items-center gap-2">
          <span className="text-2xl">💸</span> Expensify
        </h1>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
          Logged In As
        </span>
        <span className="font-semibold text-slate-800">{user.name}</span>
        <span className="text-xs text-brand-600 font-medium bg-brand-50 rounded px-2 py-0.5 self-start mt-1">
          {user.role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {user.role === 'ADMIN' && (
          <>
            <div className="px-4 py-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Admin Portal
            </div>
            <NavLink to="/" icon={Home}>Organization Dash</NavLink>
            <NavLink to="/manage-employees" icon={Users}>Manage Employees</NavLink>
          </>
        )}

        {user.role === 'EMPLOYEE' && (
          <>
            <div className="px-4 py-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Employee Portal
            </div>
            <NavLink to="/my-expenses" icon={User}>My Expenses</NavLink>
            <NavLink to="/add" icon={PlusCircle}>Capture Expense</NavLink>
            <NavLink to="/chat" icon={MessageCircle}>HR Support Bot</NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// Main App Content (inside Router)
function AppContent() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginPage onLoginSuccess={setUser} />
      ) : (
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar user={user} onLogout={handleLogout} />

          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Mobile Header */}
            <header className="bg-white p-4 shadow-sm border-b border-slate-200 md:hidden flex justify-between items-center">
              <h1 className="font-bold text-brand-600">💸 Expensify</h1>
              <button onClick={handleLogout} className="text-red-500">
                <LogOut size={20} />
              </button>
            </header>

            {/* Routes */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <Routes>
                {user.role === 'ADMIN' ? (
                  <>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/manage-employees" element={<EmployeeManagementPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </>
                ) : (
                  <>
                    <Route path="/my-expenses" element={<EmployeeDashboardPage activeUser={user} />} />
                    <Route path="/add" element={<ExpenseCapturePage activeUser={user} />} />
                    <Route path="/chat" element={<ChatInterfacePage />} />
                    <Route path="*" element={<Navigate to="/my-expenses" replace />} />
                  </>
                )}
              </Routes>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

// Root App with Router
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}