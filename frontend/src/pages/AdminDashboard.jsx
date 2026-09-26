import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, FileText, MessageSquare, Settings, LogOut, CheckCircle, Shield, Trash2, Edit2, Download, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, count, icon: Icon, iconColor, bgColor }) => (
  <div className="card p-6 flex items-center gap-6">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${bgColor} ${iconColor} dark:opacity-90`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{count}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(() => JSON.parse(sessionStorage.getItem('admin_stats')) || {
    totalUsers: 0,
    totalSeekers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [usersList, setUsersList] = useState(() => JSON.parse(sessionStorage.getItem('admin_users')) || []);
  const [employersList, setEmployersList] = useState(() => JSON.parse(sessionStorage.getItem('admin_employers')) || []);
  const [jobsList, setJobsList] = useState(() => JSON.parse(sessionStorage.getItem('admin_jobs')) || []);
  const [applicantsList, setApplicantsList] = useState(() => JSON.parse(sessionStorage.getItem('admin_applicants')) || []);
  const [testResults, setTestResults] = useState(() => JSON.parse(sessionStorage.getItem('admin_tests')) || []);
  const [systemHealth, setSystemHealth] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [timeRange, setTimeRange] = useState('Monthly');
  const [chartData, setChartData] = useState(() => JSON.parse(sessionStorage.getItem('admin_chart')) || {
    'Daily': [],
    'Monthly': [],
    'Yearly': []
  });
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('admin_stats'));

  const processGraphData = (data) => {
    const now = new Date();
    
    // Initialize Daily (last 7 days)
    const dailyMap = {};
    const dailyOrder = [];
    for(let i=6; i>=0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      dailyMap[label] = { name: label, jobs: 0, applications: 0, users: 0, dateKey: d.toDateString() };
      dailyOrder.push(label);
    }
  
    // Initialize Monthly (last 7 months)
    const monthlyMap = {};
    const monthlyOrder = [];
    for(let i=6; i>=0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      monthlyMap[label] = { name: label, jobs: 0, applications: 0, users: 0, monthKey: `${d.getFullYear()}-${d.getMonth()}` };
      monthlyOrder.push(label);
    }
  
    // Initialize Yearly (last 5 years)
    const yearlyMap = {};
    const yearlyOrder = [];
    for(let i=4; i>=0; i--) {
      const year = now.getFullYear() - i;
      yearlyMap[year] = { name: year.toString(), jobs: 0, applications: 0, users: 0 };
      yearlyOrder.push(year);
    }
  
    // Helper to process arrays
    const addCounts = (array, type) => {
      if (!array) return;
      array.forEach(dateStr => {
        const d = new Date(dateStr);
        
        // Daily Match
        const diffDays = Math.floor((now.setHours(23,59,59,999) - d) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          const label = d.toLocaleDateString('en-US', { weekday: 'short' });
          if(dailyMap[label]) dailyMap[label][type]++;
        }
        
        // Monthly Match
        const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
        if (monthDiff >= 0 && monthDiff < 7) {
          const label = d.toLocaleDateString('en-US', { month: 'short' });
          if(monthlyMap[label]) monthlyMap[label][type]++;
        }
  
        // Yearly Match
        const year = d.getFullYear();
        if (yearlyMap[year]) {
          yearlyMap[year][type]++;
        }
      });
    };
  
    addCounts(data.jobs, 'jobs');
    addCounts(data.applications, 'applications');
    addCounts(data.users, 'users');
  
    return {
      'Daily': dailyOrder.map(k => dailyMap[k]),
      'Monthly': monthlyOrder.map(k => monthlyMap[k]),
      'Yearly': yearlyOrder.map(k => yearlyMap[k])
    };
  };
  
  useEffect(() => {
    const loadData = async () => {
      const needsLoading = 
        (activeTab === 'overview' && stats.totalUsers === 0) ||
        (activeTab === 'users' && usersList.length === 0) ||
        (activeTab === 'jobs' && jobsList.length === 0) ||
        (activeTab === 'applicants' && applicantsList.length === 0) ||
        (activeTab === 'test_results' && testResults.length === 0);

      if (needsLoading) {
        setIsLoading(true);
      }

      await Promise.all([
        (activeTab === 'overview') ? Promise.all([fetchStats(), fetchGraphStats()]) : Promise.resolve(),
        activeTab === 'users' ? fetchUsers() : Promise.resolve(),
        activeTab === 'employers' ? fetchEmployers() : Promise.resolve(),
        activeTab === 'jobs' ? fetchJobs() : Promise.resolve(),
        activeTab === 'applicants' ? fetchApplicants() : Promise.resolve(),
        activeTab === 'test_results' ? fetchTestResults() : Promise.resolve(),
        activeTab === 'settings' ? fetchSystemSettings() : Promise.resolve()
      ]);
      
      setIsLoading(false);
    };
    loadData();
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/admin/jobs');
      setJobsList(res.data);
      sessionStorage.setItem('admin_jobs', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchApplicants = async () => {
    try {
      const res = await axios.get('/api/admin/applications');
      setApplicantsList(res.data);
      sessionStorage.setItem('admin_applicants', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  const fetchTestResults = async () => {
    try {
      const res = await axios.get('/api/test/results');
      setTestResults(res.data);
      sessionStorage.setItem('admin_tests', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching test results:", err);
    }
  };

  const fetchGraphStats = async () => {
    try {
      const res = await axios.get('/api/admin/graph-stats');
      const processed = processGraphData(res.data);
      setChartData(processed);
      sessionStorage.setItem('admin_chart', JSON.stringify(processed));
    } catch (err) {
      console.error("Error fetching graph stats:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
      sessionStorage.setItem('admin_stats', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsersList(res.data);
      sessionStorage.setItem('admin_users', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchEmployers = async () => {
    try {
      const res = await axios.get('/api/admin/employers');
      setEmployersList(res.data);
      sessionStorage.setItem('admin_employers', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching employers:", err);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const res = await axios.get('/api/admin/settings/health');
      setSystemHealth(res.data);
      setMaintenanceMode(res.data.maintenanceMode);
    } catch (err) {
      console.error("Error fetching system health:", err);
    }
  };

  const toggleMaintenance = async () => {
    try {
      const res = await axios.post('/api/admin/settings/maintenance', { enabled: !maintenanceMode });
      setMaintenanceMode(res.data.maintenanceMode);
      fetchSystemSettings(); // refresh health status
    } catch (err) {
      console.error("Error toggling maintenance mode:", err);
      alert("Failed to update maintenance mode");
    }
  };

  const exportToExcel = () => {
    const headers = ['NO', 'Name', 'Email', 'Mobile No', 'Place', 'Job Title', 'Resume Link'];
    const csvRows = [headers.join(',')];

    applicantsList.forEach((app, index) => {
      const row = [
        index + 1,
        `"${app.seekerName || ''}"`,
        `"${app.seekerEmail || ''}"`,
        `"${app.seekerPhone || ''}"`,
        `"${app.seekerLocation || ''}"`,
        `"${app.jobTitle || ''}"`,
        `"${app.resumeUrl ? '' + app.resumeUrl : ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportUsersToExcel = async () => {
    let currentTestResults = testResults;
    if (currentTestResults.length === 0) {
      try {
        const res = await axios.get('/api/test/results');
        currentTestResults = res.data;
        setTestResults(res.data);
        sessionStorage.setItem('admin_tests', JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching test results for export:", err);
      }
    }

    const headers = ['NO', 'Name', 'Email', 'Phone', 'Role', 'Test Result', 'Resume URL'];
    const csvRows = [headers.join(',')];

    const usersToExport = selectedUsers.length > 0 ? usersList.filter(u => selectedUsers.includes(u.id)) : usersList;

    usersToExport.forEach((u, index) => {
      // Find the most recent test result or all of them. Let's find the best one or just the first one.
      const userTests = currentTestResults.filter(tr => tr.email === u.email);
      let testScoreStr = 'N/A';
      if (userTests.length > 0) {
        // Just show the most recent or highest? Let's just show the first one found (most recent usually)
        testScoreStr = `${userTests[0].score}/${userTests[0].totalQuestions}`;
      }
      
      const phoneStr = u.phoneNo ? `="${u.phoneNo}"` : 'N/A';
      
      const row = [
        index + 1,
        `"${u.name || ''}"`,
        `"${u.email || ''}"`,
        `"${phoneStr}"`,
        `"${u.role || ''}"`,
        `"${testScoreStr}"`,
        `"${u.resumeUrl ? '' + u.resumeUrl : ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 hidden lg:flex overflow-y-auto transition-colors duration-300">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Admin Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={Users} label="Manage Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={Briefcase} label="Employers" active={activeTab === 'employers'} onClick={() => setActiveTab('employers')} />
          <SidebarItem icon={Briefcase} label="Platform Jobs" active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
          <SidebarItem icon={FileText} label="Applicants" active={activeTab === 'applicants'} onClick={() => setActiveTab('applicants')} />
          <SidebarItem icon={CheckCircle} label="Test Results" active={activeTab === 'test_results'} onClick={() => setActiveTab('test_results')} />
          <SidebarItem icon={Settings} label="System Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
        
        <div className="mt-auto">
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Users</button>
          <button onClick={() => setActiveTab('employers')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'employers' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Employers</button>
          <button onClick={() => setActiveTab('jobs')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Jobs</button>
          <button onClick={() => setActiveTab('applicants')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'applicants' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Applicants</button>
          <button onClick={() => setActiveTab('test_results')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'test_results' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Tests</button>
          <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}>Settings</button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Welcome, System Administrator. Manage the platform ecosystem.</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard title="Total Users" count={stats.totalUsers} icon={Users} bgColor="bg-blue-50" iconColor="text-blue-600" />
              <StatCard title="Job Seekers" count={stats.totalSeekers} icon={Users} bgColor="bg-yellow-50" iconColor="text-yellow-600" />
              <StatCard title="Employers" count={stats.totalEmployers} icon={Briefcase} bgColor="bg-green-50" iconColor="text-green-600" />
              <StatCard title="Job Listings" count={stats.totalJobs} icon={Briefcase} bgColor="bg-purple-50" iconColor="text-purple-600" />
              <StatCard title="Applications" count={stats.totalApplications} icon={FileText} bgColor="bg-pink-50" iconColor="text-pink-600" />
            </div>
            
            <div className="card p-6 min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Growth</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Visualizing user registrations and applications.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
                  {['Daily', 'Monthly', 'Yearly'].map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        timeRange === range ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="applications" name="Applications" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    <Area type="monotone" dataKey="users" name="New Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="jobs" name="Job Postings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">View and manage all registered users.</p>
              </div>
              <button 
                onClick={exportUsersToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={usersList.length > 0 && selectedUsers.length === usersList.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(usersList.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {usersList.map((u) => {
                    const initials = (u.name || "User").substring(0, 2).toUpperCase();
                    const bgColors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600'];
                    const avatarColor = bgColors[u.id % bgColors.length];
                    
                    return (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors group ${selectedUsers.includes(u.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(prev => [...prev, u.id]);
                            } else {
                              setSelectedUsers(prev => prev.filter(id => id !== u.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColor}`}>
                            {initials}
                          </div>
                          <span className="font-semibold text-slate-900">{u.name || "Anonymous User"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {u.phoneNo || <span className="text-slate-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`text-xs font-bold px-3 py-1.5 rounded-md outline-none border cursor-pointer appearance-none ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            u.role === 'EMPLOYER' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                          value={u.role}
                          onChange={async (e) => {
                            try {
                              await axios.put(`/api/admin/users/${u.id}/role?newRole=${e.target.value}`);
                              fetchUsers(); // Refresh the list
                            } catch (error) {
                              alert("Failed to update user role.");
                            }
                          }}
                        >
                          <option value="SEEKER">SEEKER</option>
                          <option value="EMPLOYER">EMPLOYER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="Edit Role">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-slate-400 hover:text-red-600 transition-colors p-1" 
                            title="Delete User"
                            onClick={async () => {
                              if(window.confirm(`Are you sure you want to delete user ${u.email}?`)) {
                                try {
                                  await axios.delete(`/api/admin/users/${u.id}`);
                                  fetchUsers();
                                  fetchStats();
                                  fetchGraphStats();
                                } catch (error) {
                                  alert("Failed to delete user.");
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employers' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Employer Approvals & Management</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">Review pending employers and manage registered companies.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Employer Details</th>
                    <th className="px-6 py-4">Company Info</th>
                    <th className="px-6 py-4 text-center">Jobs Posted</th>
                    <th className="px-6 py-4 text-center">Shortlisted</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {employersList.map((emp) => {
                    return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{emp.name || "N/A"}</div>
                        <div className="text-xs text-slate-500 mt-1">{emp.email}</div>
                        <div className="text-xs text-slate-500">{emp.phoneNo || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{emp.companyName || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-blue-600">
                        {emp.totalJobs}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-green-600">
                        {emp.shortlistedCount}
                      </td>
                      <td className="px-6 py-4">
                        {emp.isApproved ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Approved</span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!emp.isApproved && (
                            <button 
                              onClick={async () => {
                                try {
                                  await axios.put(`/api/admin/employers/${emp.id}/approve`);
                                  fetchEmployers();
                                } catch (e) {
                                  alert("Failed to approve employer");
                                }
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={async () => {
                              if(window.confirm(`Are you sure you want to remove employer ${emp.companyName}?`)) {
                                try {
                                  await axios.delete(`/api/admin/users/${emp.id}`);
                                  fetchEmployers();
                                } catch (e) {
                                  alert("Failed to remove employer");
                                }
                              }
                            }}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {employersList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No employers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'settings') && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              System Settings & Health
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Health */}
              <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  API Health Status
                </h3>
                {systemHealth ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-sm font-medium text-slate-600">Overall Status</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${systemHealth.status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {systemHealth.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-sm font-medium text-slate-600">Database Connection</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${systemHealth.database === 'CONNECTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {systemHealth.database}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-sm font-medium text-slate-600">System Uptime</span>
                      <span className="text-sm font-mono text-slate-700">
                        {Math.floor(systemHealth.uptimeMillis / 60000)} minutes
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 flex items-center justify-center h-24">Loading health data...</div>
                )}
              </div>

              {/* Maintenance Mode */}
              <div className="border border-slate-100 rounded-xl p-6 bg-slate-50 flex flex-col">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  Maintenance Mode
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-1">
                  Enable maintenance mode to temporarily disable login and registration for all users except administrators. Use this during system upgrades or to halt API access during critical errors.
                </p>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <div>
                    <div className="font-medium text-slate-800">Status</div>
                    <div className={`text-sm mt-1 ${maintenanceMode ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}`}>
                      {maintenanceMode ? 'ACTIVE - Access Restricted' : 'ONLINE - Normal Operation'}
                    </div>
                  </div>
                  <button 
                    onClick={toggleMaintenance}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                      maintenanceMode 
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
                    }`}
                  >
                    {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === 'jobs' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Platform Jobs</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">Manage and monitor all active job postings.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Employer</th>
                    <th className="px-6 py-4">Date Posted</th>
                    <th className="px-6 py-4">Applicants</th>
                    <th className="px-6 py-4">Selected</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {jobsList.map((job) => {
                    const dateObj = job.postedAt ? new Date(job.postedAt) : new Date();
                    return (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{job.title}</div>
                          <div className="text-sm text-slate-500">{job.company}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{job.employerName}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{dateObj.toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {job.applicantsCount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            {job.selectedCount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="text-slate-400 hover:text-red-600 transition-colors p-1" 
                              title="Delete Job"
                              onClick={async () => {
                                if(window.confirm(`Are you sure you want to delete the job: ${job.title}?`)) {
                                  try {
                                    await axios.delete(`/api/admin/jobs/${job.id}`);
                                    fetchJobs();
                                    fetchStats();
                                    fetchGraphStats();
                                  } catch (error) {
                                    alert("Failed to delete job.");
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {jobsList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No jobs posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Platform Applicants</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">View all job applications and applicant details.</p>
              </div>
              <button 
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Job Info</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Skills / Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {applicantsList.map((app) => {
                    const initials = (app.seekerName || "User").substring(0, 2).toUpperCase();
                    const bgColors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600'];
                    const avatarColor = bgColors[app.id % bgColors.length];
                    
                    return (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColor}`}>
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-900">{app.seekerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                          <div className="text-sm text-slate-500">{app.jobCompany}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          <div>{app.seekerEmail}</div>
                          <div>{app.seekerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          <div className="truncate max-w-[200px]" title={app.seekerSkills}>{app.seekerSkills || 'N/A'}</div>
                          <div className="text-xs mt-1">{app.seekerLocation || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'RESUME VIEWED' ? 'bg-blue-100 text-blue-700' :
                            app.status === 'CONTACT VIEWED' ? 'bg-purple-100 text-purple-700' :
                            app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {app.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app.resumeUrl ? (
                            <a 
                              href={app.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Resume
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No Resume</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {applicantsList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'test_results' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Skill Test Results</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">View the performance of users who have taken the skill assessment test.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Date Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {testResults.map((result) => {
                    const initials = (result.name || "User").substring(0, 2).toUpperCase();
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);
                    return (
                      <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-600">
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-900">{result.name || "Anonymous User"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          <div>{result.email}</div>
                          <div>{result.phoneNo || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.score} / {result.totalQuestions} ({percentage}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {new Date(result.completedAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {testResults.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No test results found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

