import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, FileText, MessageSquare, Settings, LogOut, CheckCircle, Plus, Edit, Trash2, Download, Star } from 'lucide-react';
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
  <div className="card p-6 flex items-center gap-6">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${bgColor} ${iconColor}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-slate-500 font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-900">{count}</div>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [jobs, setJobs] = useState(() => JSON.parse(sessionStorage.getItem('emp_jobs')) || []);
  const [applications, setApplications] = useState(() => JSON.parse(sessionStorage.getItem('emp_apps')) || []);
  const [stats, setStats] = useState(() => JSON.parse(sessionStorage.getItem('emp_stats')) || { activeListings: 0, totalApplications: 0 });
  
  // New Job Form State
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '', company: user?.companyName || '', location: 'Chennai', salaryAmount: '', salaryType: 'LPA', type: 'Full-time', tags: ''
  });
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('emp_jobs'));

  useEffect(() => {
    const loadData = async () => {
      if (!sessionStorage.getItem('emp_jobs')) setIsLoading(true);
      await Promise.all([
        fetchJobs(),
        fetchStats(),
        fetchApplications()
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications/employer');
      setApplications(res.data);
      sessionStorage.setItem('emp_apps', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/employer');
      setJobs(res.data);
      sessionStorage.setItem('emp_jobs', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/jobs/employer/stats');
      setStats(res.data);
      sessionStorage.setItem('emp_stats', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        title: newJob.title,
        company: newJob.company || user?.companyName || 'Unknown',
        location: newJob.location,
        salary: `${newJob.salaryAmount} ${newJob.salaryType}`,
        type: newJob.type,
        tags: newJob.tags ? newJob.tags.split(',').map(tag => tag.trim()) : []
      };
      
      if (editingJobId) {
        await axios.put(`/api/jobs/${editingJobId}`, jobData);
      } else {
        await axios.post('/api/jobs', jobData);
      }
      
      setShowForm(false);
      setEditingJobId(null);
      setNewJob({ title: '', company: user?.companyName || '', location: 'Chennai', salaryAmount: '', salaryType: 'LPA', type: 'Full-time', tags: '' });
      fetchJobs();
      fetchStats();
      setActiveTab('My Listings');
    } catch (err) {
      alert('Failed to post/update job. Make sure you are logged in as an Employer.');
    }
  };

  const handleEditJob = (job) => {
    const salaryParts = job.salary ? job.salary.split(' ') : [];
    const amount = salaryParts[0] || '';
    const type = salaryParts[1] || 'LPA';
    
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      salaryAmount: amount,
      salaryType: type,
      type: job.type,
      tags: job.tags ? job.tags.join(', ') : ''
    });
    setEditingJobId(job.id);
    setShowForm(true);
    setActiveTab('Post a Job');
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      fetchJobs();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job.");
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await axios.put(`/api/applications/${appId}/status?status=${status}`);
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const exportToExcel = () => {
    const headers = ['NO', 'Name', 'Email', 'Mobile No', 'Place', 'Job Title', 'Resume Link'];
    const csvRows = [headers.join(',')];

    applications.forEach((app, index) => {
      const row = [
        index + 1,
        `"${app.seeker?.name || ''}"`,
        `"${app.seeker?.email || ''}"`,
        `"${app.seeker?.phoneNo || ''}"`,
        `"${app.seeker?.location || ''}"`,
        `"${app.job?.title || ''}"`,
        `"${app.seeker?.resumeUrl ? '' + app.seeker.resumeUrl : ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employer_applicants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 hidden lg:flex overflow-y-auto transition-colors duration-300">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setShowForm(false); }} />
          <SidebarItem icon={Plus} label="Post a Job" active={activeTab === 'Post a Job'} onClick={() => { setEditingJobId(null); setNewJob({ title: '', company: user?.companyName || '', location: 'Chennai', salaryAmount: '', salaryType: 'LPA', type: 'Full-time', tags: '' }); setActiveTab('Post a Job'); }} />
          <SidebarItem icon={Briefcase} label="My Listings" active={activeTab === 'My Listings'} onClick={() => setActiveTab('My Listings')} />
          <SidebarItem icon={Users} label="Applicants" active={activeTab === 'Applicants'} onClick={() => setActiveTab('Applicants')} />
          <SidebarItem icon={Settings} label="Profile Settings" active={activeTab === 'Profile Settings'} onClick={() => setActiveTab('Profile Settings')} />
        </div>
        
        <div className="mt-auto">
          <button onClick={logout} className="flex items-center gap-3 text-red-600 dark:text-red-400 font-semibold px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Employer Dashboard</h1>
            </div>
            <p className="text-slate-500">Welcome back, {user?.name || user?.email?.split('@')[0]}. Manage your job listings.</p>
          </div>
          <button 
            onClick={() => {
              setEditingJobId(null);
              setNewJob({ title: '', company: user?.companyName || '', location: 'Chennai', salaryAmount: '', salaryType: 'LPA', type: 'Full-time', tags: '' });
              setActiveTab('Post a Job');
            }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>

        {activeTab === 'Dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Active Listings" count={stats.activeListings} icon={Briefcase} bgColor="bg-purple-50 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
              <StatCard title="Total Applicants" count={stats.totalApplications} icon={Users} bgColor="bg-blue-50 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
              <StatCard title="Shortlisted" count={stats.shortlisted || 0} icon={Star} bgColor="bg-orange-50 dark:bg-orange-900/30" iconColor="text-orange-600 dark:text-orange-400" />
            </div>

            {jobs.length === 0 ? (
              <div className="card p-12 flex flex-col items-center justify-center text-center mt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to hire?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">You haven't posted any jobs yet. Create your first listing to start receiving applications.</p>
                <button 
                  onClick={() => {
                    setEditingJobId(null);
                    setNewJob({ title: '', company: user?.companyName || '', location: 'Chennai', salaryAmount: '', salaryType: 'LPA', type: 'Full-time', tags: '' });
                    setActiveTab('Post a Job');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Job Listing
                </button>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Job Listings</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{job.title}</h3>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex gap-4">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{job.salary}</div>
                        <div className="flex gap-2">
                          <button onClick={() => { handleEditJob(job); setActiveTab('Post a Job'); }} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit Job"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Job"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'Post a Job' && (
          <>
            {/* Post Job Form */}
              <div className="card p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">{editingJobId ? 'Edit Job Listing' : 'Create a New Job Listing'}</h2>
                <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                    <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                    <input type="text" required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Your Company Name" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <select required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <optgroup label="Tamil Nadu">
                        <option value="Chennai">Chennai</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Trichy">Trichy</option>
                      </optgroup>
                      <optgroup label="Other IT Hubs">
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Noida">Noida</option>
                        <option value="Gurgaon">Gurgaon</option>
                      </optgroup>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
                    <div className="flex gap-2">
                      <input type="number" required value={newJob.salaryAmount} onChange={e => setNewJob({...newJob, salaryAmount: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 5" />
                      <select value={newJob.salaryType} onChange={e => setNewJob({...newJob, salaryType: e.target.value})} className="px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all w-32 shrink-0">
                        <option value="LPA">LPA</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                    <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
                    <input type="text" value={newJob.tags} onChange={e => setNewJob({...newJob, tags: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="React, Java, Full Stack" />
                  </div>
                  <div className="col-span-2 mt-4">
                    <button type="submit" className="btn-primary px-8">
                      {editingJobId ? 'Update Job' : 'Publish Job'}
                    </button>
                  </div>
                </form>
              </div>
          </>
        )}

        {activeTab === 'My Listings' && (
          <>
              <div className="card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">All Job Listings</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {jobs.map(job => (
                    <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                        <div className="text-sm text-slate-500 mt-1 flex gap-4">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-slate-900">{job.salary}</div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditJob(job)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Job"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && <div className="p-8 text-center text-slate-500">No jobs posted yet.</div>}
                </div>
              </div>
          </>
        )}

        {activeTab === 'Applicants' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
              <button 
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {applications.map(app => (
                <div key={app.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{app.seeker?.name || 'Applicant'}</h3>
                    <div className="text-sm text-slate-500 mt-1">Applied for: <span className="font-medium text-blue-600">{app.job?.title}</span></div>
                    <div className="text-sm text-slate-500 mt-1">Email: {app.seeker?.email}</div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <select 
                      value={app.status || 'PENDING'} 
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border-r-8 border-transparent ${
                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'RESUME VIEWED' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'CONTACT VIEWED' ? 'bg-purple-100 text-purple-700' :
                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="PENDING" className="bg-white text-slate-900">PENDING</option>
                      <option value="RESUME VIEWED" className="bg-white text-slate-900">RESUME VIEWED</option>
                      <option value="CONTACT VIEWED" className="bg-white text-slate-900">CONTACT VIEWED</option>
                      <option value="SHORTLISTED" className="bg-white text-slate-900">SHORTLISTED</option>
                      <option value="REJECTED" className="bg-white text-slate-900">REJECTED</option>
                    </select>
                    {app.seeker?.resumeUrl && (
                      <a 
                        href={`${app.seeker.resumeUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2 font-medium"
                      >
                        <FileText className="w-3 h-3" /> Download Resume
                      </a>
                    )}
                    <div className="text-xs text-slate-400 mt-2">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                </div>
              ))}
              {applications.length === 0 && <div className="p-8 text-center text-slate-500">No applications received yet.</div>}
            </div>
          </div>
        )}

        {activeTab === 'Profile Settings' && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Company Settings</h2>
            <p className="text-slate-500">Settings functionality coming soon.</p>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default EmployerDashboard;

