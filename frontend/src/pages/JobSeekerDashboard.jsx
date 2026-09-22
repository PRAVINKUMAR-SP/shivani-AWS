import React, { useState, useEffect } from 'react';
import { Home, Briefcase, Mail, Bookmark, Bell, Settings, User, LogOut, Search, MapPin, SlidersHorizontal, Bookmark as BookmarkIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

const JobCard = ({ id, title, company, location, salary, type, tags, time, applied, onApply }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
          {company?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-gray-500 text-sm line-clamp-1">{company}</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-blue-600">
        <BookmarkIcon className="w-5 h-5" />
      </button>
    </div>
    
    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
      <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</div>
      <div className="flex items-center gap-1 font-medium">{salary}</div>
      <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {type}</div>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-6">
      {tags && tags.map((tag, i) => (
        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          {tag}
        </span>
      ))}
    </div>
    
    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
      <span className="text-gray-400 text-sm">{time || 'Recently posted'}</span>
      {applied ? (
        <span className="text-green-600 font-semibold text-sm bg-green-50 px-4 py-2 rounded-lg flex items-center gap-1">
          Applied ✓
        </span>
      ) : (
        <button 
          onClick={() => onApply(id)}
          className="bg-blue-50 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Apply Now
        </button>
      )}
    </div>
  </div>
);

const ProfileSettings = () => {
  const [profile, setProfile] = useState({ name: '', phoneNo: '', resumeUrl: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users/profile');
      setProfile({
        name: res.data.name || '',
        phoneNo: res.data.phoneNo || '',
        resumeUrl: res.data.resumeUrl || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8080/api/users/profile', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">{message}</div>}
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input type="tel" value={profile.phoneNo} onChange={e => setProfile({...profile, phoneNo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
          <input type="url" value={profile.resumeUrl} onChange={e => setProfile({...profile, resumeUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://link-to-your-resume.pdf" />
          <p className="text-xs text-gray-500 mt-2">Provide a link to your hosted resume (Google Drive, Dropbox, etc.)</p>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const { logout } = useAuth();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/applications/seeker');
      setAppliedJobs(res.data.map(app => app.job.id));
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:8080/api/applications/${jobId}`);
      setAppliedJobs([...appliedJobs, jobId]);
    } catch (err) {
      alert(err.response?.data || 'Failed to apply');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 hidden lg:flex">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <SidebarItem icon={Briefcase} label="Applied" active={activeTab === 'applied'} onClick={() => setActiveTab('applied')} />
          <SidebarItem icon={User} label="Profile Settings" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
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
        {activeTab === 'profile' ? (
          <ProfileSettings />
        ) : (
          <>
            {/* Search Bar Area */}
            <div className="max-w-4xl mb-8 flex gap-4">
              <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent hidden md:flex">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="City, state, zip code, or 'remote'" 
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-sm whitespace-nowrap">
                Find jobs
              </button>
            </div>

            {/* Recommended Jobs */}
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeTab === 'applied' ? 'Applied Jobs' : 'Recommended Jobs'}</h1>
                <p className="text-gray-500 mt-1">Based on your profile and preferences</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.filter(job => activeTab === 'home' || appliedJobs.includes(job.id)).length === 0 && (
                  <p className="text-gray-500 col-span-full text-center py-12">No jobs found.</p>
                )}
                {jobs
                  .filter(job => activeTab === 'home' || appliedJobs.includes(job.id))
                  .map((job) => (
                    <JobCard 
                      key={job.id} 
                      {...job} 
                      applied={appliedJobs.includes(job.id)}
                      onApply={handleApply}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
