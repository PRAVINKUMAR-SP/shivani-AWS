import React, { useState, useEffect } from 'react';
import { Home, Briefcase, Mail, Bookmark, Bell, Settings, User, LogOut, Search, MapPin, SlidersHorizontal, Bookmark as BookmarkIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MailOpen, BellRing, Eye, Check, X, FileText } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const JobCard = ({ id, title, company, location, salary, type, tags, time, applied, appStatus, saved, onApply, onSave }) => (
  <div className="card p-6 flex flex-col">
    <div className="flex justify-between items-start mb-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
          {company?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{title}</h3>
          <p className="text-slate-500 text-sm line-clamp-1 flex items-center gap-1 mt-0.5">
            {company}
          </p>
        </div>
      </div>
      <button 
        onClick={() => onSave(id)}
        className={`transition-colors ${saved ? 'text-blue-600 fill-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
      >
        <BookmarkIcon className={`w-5 h-5 ${saved ? 'fill-blue-600' : ''}`} />
      </button>
    </div>
    
    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-5 pb-5 border-b border-slate-50">
      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {location}</div>
      <div className="flex items-center gap-1.5 font-medium text-slate-700">{salary}</div>
      <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {type}</div>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-6 mt-1">
      {tags && tags.map((tag, i) => (
        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          {tag}
        </span>
      ))}
    </div>
    
    <div className="flex justify-between items-center mt-auto pt-2">
      <span className="text-slate-400 text-sm font-medium">{time || 'Recently posted'}</span>
      {applied ? (
        <span className={`font-semibold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 ${
          appStatus === 'PENDING' || !appStatus ? 'bg-yellow-50 text-yellow-600' :
          appStatus === 'RESUME VIEWED' ? 'bg-blue-50 text-blue-700' :
          appStatus === 'CONTACT VIEWED' ? 'bg-purple-50 text-purple-700' :
          appStatus === 'SHORTLISTED' ? 'bg-green-50 text-green-700' :
          appStatus === 'REJECTED' ? 'bg-red-50 text-red-600' :
          'bg-gray-100 text-gray-700'
        }`}>
          {appStatus || 'Applied'} {appStatus === 'REJECTED' ? '✕' : (appStatus && appStatus !== 'PENDING' ? '✓' : '')}
        </span>
      ) : (
        <button 
          onClick={() => onApply(id)}
          className="bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 py-2 px-5 rounded-lg transition-colors text-sm"
        >
          Apply Now
        </button>
      )}
    </div>
  </div>
);

const ProfileSettings = ({ profile, setProfile, onSave, message, loading }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await axios.post('/api/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({...profile, resumeUrl: res.data.url});
    } catch (err) {
      alert(err.response?.data || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave();
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl w-full card p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
      {message && <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">{message}</div>}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input type="tel" value={profile.phoneNo} onChange={e => setProfile({...profile, phoneNo: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Document (PDF, DOC)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            />
            {uploading && <span className="text-sm text-blue-600 font-medium">Uploading...</span>}
          </div>
          {profile.resumeUrl && (
            <div className="mt-3 text-sm">
              <span className="text-slate-500">Current Resume: </span>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">View File</a>
            </div>
          )}
          <p className="text-[13px] text-slate-500 mt-2">Max file size: 5MB.</p>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Job Matching Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Desired Job Role</label>
              <input type="text" value={profile.jobRole} onChange={e => setProfile({...profile, jobRole: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Java Developer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Chennai" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Skills (comma separated)</label>
              <input type="text" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. React, Java, SQL" />
              <p className="text-[13px] text-slate-500 mt-2">These skills will be used to automatically find matching jobs for you.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Education Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">College Name</label>
              <input type="text" value={profile.collegeName} onChange={e => setProfile({...profile, collegeName: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. ABC Institute of Technology" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
              <input type="text" value={profile.course} onChange={e => setProfile({...profile, course: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. B.Tech" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <input type="text" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">CGPA</label>
              <input type="text" value={profile.cgpa} onChange={e => setProfile({...profile, cgpa: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 8.5" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">About Me</h3>
          <div>
            <textarea 
              value={profile.aboutMe} 
              onChange={e => setProfile({...profile, aboutMe: e.target.value})} 
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Write a brief summary about yourself, your goals, and what you're looking for..." 
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <button type="submit" className="btn-primary w-full sm:w-auto mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

const ApplicationsTrackerSection = ({ applications }) => (
  <div className="max-w-4xl space-y-6">
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Status</h1>
        <p className="text-slate-500 mt-1">Track the progress of your job applications</p>
      </div>
    </div>
    
    {applications.length === 0 ? (
      <div className="card p-12 text-center text-slate-500">You haven't applied to any jobs yet.</div>
    ) : (
      applications.map(app => (
        <div key={app.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
              {app.job?.company?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{app.job?.title}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{app.job?.company} • {app.job?.location}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-slate-400" /> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-xs font-bold ${
              app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              app.status === 'RESUME VIEWED' ? 'bg-blue-100 text-blue-700' :
              app.status === 'CONTACT VIEWED' ? 'bg-purple-100 text-purple-700' :
              app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
              app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {app.status || 'PENDING'}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);


const NotificationsSection = ({ notifications }) => (
  <div className="max-w-4xl space-y-6">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
      <p className="text-slate-500 mt-1">Stay updated on your job applications</p>
    </div>
    
    <div className="card divide-y divide-slate-100">
      {notifications.length === 0 ? (
        <div className="p-12 text-center text-slate-500">No new notifications.</div>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="p-6 flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              notif.type === 'UPDATE' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {notif.type === 'UPDATE' ? <Check className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{notif.type === 'UPDATE' ? 'Application Update' : 'Application Viewed'}</h4>
              <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
              <span className="text-xs text-slate-400 mt-2 block">Recently</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ViewProfileSection = ({ profile, user, onEdit }) => {
  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U');
  
  return (
  <div className="max-w-4xl space-y-6">
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 mt-1">How employers see your profile</p>
      </div>
      <button onClick={onEdit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm">
        Edit Profile
      </button>
    </div>
    
    <div className="card p-8">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-4xl shadow-sm">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{profile?.name || 'Your Name'}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{profile?.jobRole || 'Your Job Role'}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
            {profile?.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>}
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills ? profile.skills.split(',').map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg">{skill.trim()}</span>
              )) : (
                <span className="text-slate-400 italic">No skills added yet.</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Education</h3>
            {(profile?.collegeName || profile?.course) ? (
              <div className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                {profile?.collegeName && <p><span className="font-medium text-slate-700 dark:text-slate-300">College:</span> {profile.collegeName}</p>}
                {profile?.course && <p><span className="font-medium text-slate-700 dark:text-slate-300">Course:</span> {profile.course}</p>}
                {profile?.department && <p><span className="font-medium text-slate-700 dark:text-slate-300">Department:</span> {profile.department}</p>}
                {profile?.cgpa && <p><span className="font-medium text-slate-700 dark:text-slate-300">CGPA:</span> {profile.cgpa}</p>}
              </div>
            ) : (
              <span className="text-slate-400 italic">No education details added yet.</span>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">About</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
              {profile?.aboutMe ? (
                <>
                  {profile.aboutMe}
                  {profile.resumeUrl && (
                    <span className="block mt-2">
                      <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">View my resume here.</a>
                    </span>
                  )}
                </>
              ) : profile?.resumeUrl ? (
                <span>
                  Ready to work and actively seeking opportunities. 
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">View my resume here.</a>
                </span>
              ) : (
                <span className="text-slate-400 italic">Add your summary and resume in settings to display your about section.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState(() => JSON.parse(sessionStorage.getItem('js_jobs')) || []);
  const [appliedJobs, setAppliedJobs] = useState(() => JSON.parse(sessionStorage.getItem('js_applied')) || []);
  const [applicationsList, setApplicationsList] = useState(() => JSON.parse(sessionStorage.getItem('js_appList')) || []);
  const [applicationStatuses, setApplicationStatuses] = useState(() => JSON.parse(sessionStorage.getItem('js_appStatus')) || {});
  const [savedJobs, setSavedJobs] = useState(() => JSON.parse(sessionStorage.getItem('js_saved')) || []);
  const [notifications, setNotifications] = useState(() => JSON.parse(sessionStorage.getItem('js_notifs')) || []);
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('js_jobs'));
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterSalary, setFilterSalary] = useState('All');
  const [stats, setStats] = useState(() => JSON.parse(sessionStorage.getItem('js_stats')) || { appliedCount: 0, shortlistedCount: 0, matchingCount: 0 });
  const { logout, user } = useAuth();
  
  // Profile state for completeness tracking
  const [profile, setProfile] = useState({ name: '', phoneNo: '', resumeUrl: '', jobRole: '', location: '', skills: '', collegeName: '', course: '', department: '', cgpa: '', aboutMe: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchSavedJobs();
    fetchNotifications();
    fetchStats();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setProfile({
        name: res.data.name || '',
        phoneNo: res.data.phoneNo || '',
        resumeUrl: res.data.resumeUrl || '',
        jobRole: res.data.jobRole || '',
        location: res.data.location || '',
        skills: res.data.skills || '',
        collegeName: res.data.collegeName || '',
        course: res.data.course || '',
        department: res.data.department || '',
        cgpa: res.data.cgpa || '',
        aboutMe: res.data.aboutMe || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/users/profile', profile);
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
      fetchStats(); // Update stats in case job matches changed
    } catch (err) {
      setProfileMessage('Failed to update profile.');
    }
  };


  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
      sessionStorage.setItem('js_jobs', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications/seeker');
      setApplicationsList(res.data);
      sessionStorage.setItem('js_appList', JSON.stringify(res.data));
      const appliedIds = res.data.map(app => app.job?.id);
      setAppliedJobs(appliedIds);
      sessionStorage.setItem('js_applied', JSON.stringify(appliedIds));
      const statuses = {};
      res.data.forEach(app => {
        if (app.job) statuses[app.job.id] = app.status;
      });
      setApplicationStatuses(statuses);
      sessionStorage.setItem('js_appStatus', JSON.stringify(statuses));
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get('/api/seeker/saved-jobs');
      const ids = res.data.map(sj => sj.job.id);
      setSavedJobs(ids);
      sessionStorage.setItem('js_saved', JSON.stringify(ids));
    } catch (err) {
      console.error('Failed to fetch saved jobs', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/seeker/notifications');
      setNotifications(res.data);
      sessionStorage.setItem('js_notifs', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/seeker/stats');
      setStats(res.data);
      sessionStorage.setItem('js_stats', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleApply = async (jobId) => {
    // Validate profile before applying
    if (!profile.name || !profile.phoneNo || !profile.resumeUrl) {
      alert("Please complete your profile (Full Name, Phone Number, and Resume URL) before applying to jobs.");
      setActiveTab('profile');
      return;
    }
    
    try {
      await axios.post(`/api/applications/${jobId}`);
      setAppliedJobs([...appliedJobs, jobId]);
      fetchStats(); // Update applied count stats
    } catch (err) {
      alert(err.response?.data || 'Failed to apply');
    }
  };

  const handleSave = async (jobId) => {
    try {
      await axios.post(`/api/seeker/save-job/${jobId}`);
      if (savedJobs.includes(jobId)) {
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Failed to save job', err);
    }
  };


  const calculateCompletion = () => {
    let filled = 0;
    if (user?.email) filled++;
    if (profile.name) filled++;
    if (profile.phoneNo) filled++;
    if (profile.resumeUrl) filled++;
    if (profile.skills) filled++;
    if (profile.jobRole) filled++;
    if (profile.location) filled++;
    if (profile.collegeName) filled++;
    if (profile.course) filled++;
    if (profile.department) filled++;
    if (profile.cgpa) filled++;
    if (profile.aboutMe) filled++;
    return Math.round((filled / 12) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 hidden lg:flex overflow-y-auto transition-colors duration-300">
        <div className="space-y-1 mb-8">
          <SidebarItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <SidebarItem icon={Briefcase} label="Applied" active={activeTab === 'applied'} onClick={() => setActiveTab('applied')} />
          <SidebarItem icon={FileText} label="Track Applications" active={activeTab === 'applications_tracker'} onClick={() => setActiveTab('applications_tracker')} />
          <SidebarItem icon={BookmarkIcon} label="Saved Jobs" active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
          <SidebarItem icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SidebarItem icon={Settings} label="Profile Settings" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarItem icon={User} label="Profile" active={activeTab === 'view_profile'} onClick={() => setActiveTab('view_profile')} />
        </div>
        
        <div className="mt-auto">
          <div className="mb-6 px-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Status</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            {completionPercentage < 100 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">Complete your profile to stand out to employers.</p>
            )}
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
          <button onClick={() => setActiveTab('home')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Home</button>
          <button onClick={() => setActiveTab('applied')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'applied' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Applied</button>
          <button onClick={() => setActiveTab('applications_tracker')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'applications_tracker' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Tracker</button>
          <button onClick={() => setActiveTab('saved')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Saved Jobs</button>
          <button onClick={() => setActiveTab('notifications')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Notifications</button>
          <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Settings</button>
          <button onClick={() => setActiveTab('view_profile')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'view_profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>Profile</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : activeTab === 'profile' ? (
          <ProfileSettings 
            profile={profile} 
            setProfile={setProfile} 
            onSave={handleSaveProfile} 
            message={profileMessage} 
            loading={profileLoading} 
          />
        ) : activeTab === 'view_profile' ? (
          <ViewProfileSection profile={profile} user={user} onEdit={() => setActiveTab('profile')} />
        ) : activeTab === 'applications_tracker' ? (
          <ApplicationsTrackerSection applications={applicationsList} />
        ) : activeTab === 'notifications' ? (
          <NotificationsSection notifications={notifications} />
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card p-6 flex items-center justify-between border-l-4 border-blue-500">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Applied Jobs</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.appliedCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="card p-6 flex items-center justify-between border-l-4 border-green-500">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Shortlisted Jobs</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.shortlistedCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="card p-6 flex items-center justify-between border-l-4 border-purple-500">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Matching Jobs</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.matchingCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Search className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Search Bar Area */}
                <div className="max-w-4xl mb-8 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-full pl-6 pr-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Job title..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 w-20 outline-none text-slate-700 bg-transparent text-sm sm:text-base"
                    />
                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0 hidden sm:block" />
                    <input 
                      type="text" 
                      placeholder="Location" 
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="flex-1 w-20 outline-none text-slate-700 bg-transparent text-sm sm:text-base hidden sm:block"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-8 rounded-full transition-colors whitespace-nowrap ml-2 text-sm sm:text-base">
                      Search
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`border font-semibold py-3 px-6 rounded-full transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap h-fit mt-1 ${
                      showFilters || filterType !== 'All' || filterSalary !== 'All' 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(filterType !== 'All' || filterSalary !== 'All') && (
                      <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                        {(filterType !== 'All' ? 1 : 0) + (filterSalary !== 'All' ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Extended Filters Panel */}
                {showFilters && (
                  <div className="max-w-4xl mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900">Advanced Filters</h3>
                      <button 
                        onClick={() => { setFilterType('All'); setFilterSalary('All'); }}
                        className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                        <select 
                          value={filterType}
                          onChange={e => setFilterType(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-700"
                        >
                          <option value="All">All Types</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Salary</label>
                        <select 
                          value={filterSalary}
                          onChange={e => setFilterSalary(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-700"
                        >
                          <option value="All">Any Salary</option>
                          <option value="50000">₹50,000+</option>
                          <option value="100000">₹1,00,000+</option>
                          <option value="200000">₹2,00,000+</option>
                          <option value="500000">₹5,00,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Recommended Jobs */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {activeTab === 'applied' ? 'Applied Jobs' : activeTab === 'saved' ? 'Saved Jobs' : 'Recommended Jobs'}
                </h1>
                <p className="text-slate-500 mt-1">
                  {activeTab === 'applied' ? 'Jobs you have submitted applications for' : activeTab === 'saved' ? 'Jobs you have bookmarked for later' : 'Based on your profile and preferences'}
                </p>
              </div>
              <button className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                View all
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.filter(job => 
                  (activeTab === 'home' || 
                  (activeTab === 'applied' && appliedJobs.includes(job.id)) ||
                  (activeTab === 'saved' && savedJobs.includes(job.id))) &&
                  (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   job.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (job.location?.toLowerCase().includes(locationQuery.toLowerCase())) &&
                  (filterType === 'All' || job.type === filterType) &&
                  (filterSalary === 'All' || (job.salary && parseInt(job.salary.replace(/[^0-9]/g, '')) >= parseInt(filterSalary)))
                ).length === 0 && (
                  <p className="text-slate-500 col-span-full text-center py-12">No jobs found.</p>
                )}
                {jobs
                  .filter(job => 
                    (activeTab === 'home' || 
                    (activeTab === 'applied' && appliedJobs.includes(job.id)) ||
                    (activeTab === 'saved' && savedJobs.includes(job.id))) &&
                    (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     job.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    (job.location?.toLowerCase().includes(locationQuery.toLowerCase())) &&
                    (filterType === 'All' || job.type === filterType) &&
                    (filterSalary === 'All' || (job.salary && parseInt(job.salary.replace(/[^0-9]/g, '')) >= parseInt(filterSalary)))
                  )
                  .map((job) => (
                    <JobCard 
                      key={job.id} 
                      {...job} 
                      applied={appliedJobs.includes(job.id)}
                      appStatus={applicationStatuses[job.id]}
                      saved={savedJobs.includes(job.id)}
                      onApply={handleApply}
                      onSave={handleSave}
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

