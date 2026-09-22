import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, FileText, MessageSquare, Settings, LogOut, CheckCircle, Plus } from 'lucide-react';
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
  const [jobs, setJobs] = useState([]);
  
  // New Job Form State
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', salary: '', type: 'Full-time', tags: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        tags: newJob.tags.split(',').map(tag => tag.trim())
      };
      await axios.post('http://localhost:8080/api/jobs', jobData);
      setShowForm(false);
      setNewJob({ title: '', company: '', location: '', salary: '', type: 'Full-time', tags: '' });
      fetchJobs();
    } catch (err) {
      alert('Failed to post job. Make sure you are logged in as an Employer.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 hidden lg:flex">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Dashboard" active />
          <SidebarItem icon={Users} label="Users" />
          <SidebarItem icon={Briefcase} label="My Jobs" />
          <SidebarItem icon={FileText} label="Applications" />
          <SidebarItem icon={Settings} label="Settings" />
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
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            </div>
            <p className="text-gray-500">Welcome back, {user?.name || user?.email?.split('@')[0]}. Manage your job listings.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Listings" count={jobs.length} icon={Briefcase} bgColor="bg-purple-50" iconColor="text-purple-600" />
          <StatCard title="Total Applications" count="0" icon={FileText} bgColor="bg-pink-50" iconColor="text-pink-600" />
          <StatCard title="Profile Views" count="128" icon={Users} bgColor="bg-blue-50" iconColor="text-blue-600" />
          <StatCard title="Messages" count="5" icon={MessageSquare} bgColor="bg-green-50" iconColor="text-green-600" />
        </div>

        {/* Post Job Form */}
        {showForm ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create a New Job Listing</h2>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Remote, New York" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input type="text" required value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. ₹100,000 - ₹120,000" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input type="text" value={newJob.tags} onChange={e => setNewJob({...newJob, tags: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="React, Java, Full Stack" />
              </div>
              <div className="col-span-2 mt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md">
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Recent Job Listings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {jobs.map(job => (
                <div key={job.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{job.salary}</div>
                    <div className="text-xs text-gray-400 mt-1">Posted recently</div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <div className="p-8 text-center text-gray-500">No jobs posted yet.</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
