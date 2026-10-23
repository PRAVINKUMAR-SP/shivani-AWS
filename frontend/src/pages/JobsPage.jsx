import React, { useState, useEffect } from 'react';
import { getInitials } from '../utils/helpers';
import { Search, MapPin, Briefcase, Bookmark as BookmarkIcon } from 'lucide-react';
import axios from 'axios';

const JobCard = ({ id, title, company, location, salary, type, tags, time, postedAt, employer }) => {
  const getRelativeTime = () => {
    if (time) return time;
    if (!postedAt) return 'Recently posted';
    const diff = Math.floor((new Date() - new Date(postedAt)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Recently posted';
    if (diff === 1) return '1d ago';
    return `${diff}d ago`;
  };

  return (
    <div className="card p-4 sm:p-6 flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-start mb-4 sm:mb-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl uppercase shadow-sm overflow-hidden flex-shrink-0">
            {employer?.profilePicUrl ? (
              <img src={employer.profilePicUrl.replace(/^https?:\/\/localhost:\d+/, '').replace(/^\/uploads\//, '/api/uploads/')} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              getInitials(company) || 'C'
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-1">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-1 flex items-center gap-1 mt-0.5">
              <span className="capitalize">{company}</span>
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1">
          <BookmarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}</div>
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">{salary}</div>
        <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {type}</div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6 mt-1">
        {tags && tags.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600 text-xs font-medium rounded-lg">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="text-slate-400 text-xs sm:text-sm font-medium">{getRelativeTime()}</span>
        <button className="btn-primary py-1.5 sm:py-2 px-4 sm:px-5 text-xs sm:text-sm">
          View Job
        </button>
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [freshnessFilter, setFreshnessFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !locationTerm || 
      job.location?.toLowerCase().includes(locationTerm.toLowerCase());
    
    let matchesFreshness = true;
    if (freshnessFilter !== 'all') {
      if (!job.postedAt) {
        matchesFreshness = true;
      } else {
        const diff = Math.floor((new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24));
        if (freshnessFilter === '1' && diff > 1) matchesFreshness = false;
        if (freshnessFilter === '3' && diff > 3) matchesFreshness = false;
        if (freshnessFilter === '7' && diff > 7) matchesFreshness = false;
        if (freshnessFilter === '14' && diff > 14) matchesFreshness = false;
      }
    }

    return matchesSearch && matchesLocation && matchesFreshness;
  });

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] pt-8 sm:pt-12 pb-20 px-4 min-h-[calc(100vh-80px)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Explore Top Roles on <span className="text-blue-600 dark:text-blue-400">Shivani Technologies Job Portal</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Discover exciting career opportunities and verified jobs on shivanitech that match your skills and aspirations.
          </p>
        </div>

        {/* Search Bar Area */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-12 flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="flex-1 min-w-0 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 bg-transparent text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Location or 'remote'" 
              className="flex-1 min-w-0 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 bg-transparent text-sm sm:text-base"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 sm:py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <select 
              value={freshnessFilter}
              onChange={(e) => setFreshnessFilter(e.target.value)}
              className="outline-none text-slate-700 dark:text-slate-200 bg-transparent cursor-pointer font-medium text-sm sm:text-base w-full"
            >
              <option value="all" className="dark:bg-slate-800">Any time</option>
              <option value="1" className="dark:bg-slate-800">Past 24 hours</option>
              <option value="3" className="dark:bg-slate-800">Past 3 days</option>
              <option value="7" className="dark:bg-slate-800">Past 7 days</option>
              <option value="14" className="dark:bg-slate-800">Past 14 days</option>
            </select>
          </div>
          <button className="btn-primary py-3.5 sm:py-4 px-8 sm:px-10 whitespace-nowrap shadow-md text-base sm:text-lg w-full md:w-auto">
            Search
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.length === 0 && (
              <p className="text-slate-500 col-span-full text-center py-20">No jobs found.</p>
            )}
            {filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
