import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, FileText, MessageSquare, Settings, LogOut, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, count, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${bgColor} ${iconColor}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{count}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSeekers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 hidden lg:flex">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Admin Overview" active />
          <SidebarItem icon={Users} label="Manage Users" />
          <SidebarItem icon={Briefcase} label="Platform Jobs" />
          <SidebarItem icon={Settings} label="System Settings" />
        </div>
        
        <div className="mt-auto">
          <button onClick={logout} className="flex items-center gap-3 text-red-600 font-semibold px-4 py-3 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-500">Welcome, System Administrator. Manage the platform ecosystem.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Users" count={stats.totalUsers} icon={Users} bgColor="bg-blue-50" iconColor="text-blue-600" />
          <StatCard title="Job Seekers" count={stats.totalSeekers} icon={Users} bgColor="bg-yellow-50" iconColor="text-yellow-600" />
          <StatCard title="Employers" count={stats.totalEmployers} icon={Briefcase} bgColor="bg-green-50" iconColor="text-green-600" />
          <StatCard title="Job Listings" count={stats.totalJobs} icon={Briefcase} bgColor="bg-purple-50" iconColor="text-purple-600" />
          <StatCard title="Applications" count={stats.totalApplications} icon={FileText} bgColor="bg-pink-50" iconColor="text-pink-600" />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Controls</h2>
          <p className="text-gray-500 max-w-md">Additional administrative features and user management tools will appear here in future updates.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
