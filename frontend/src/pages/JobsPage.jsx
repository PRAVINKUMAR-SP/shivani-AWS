import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Bookmark as BookmarkIcon } from 'lucide-react';
import axios from 'axios';

const JobCard = ({ id, title, company, location, salary, type, tags, time }) => (
  <div className="card p-6 flex flex-col h-full">
    <div className="flex justify-between items-start mb-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl flex items-center justify-center font-bold text-2xl uppercase shadow-sm">
          {company?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{title}</h3>
          <p className="text-slate-500 text-sm line-clamp-1 flex items-center gap-1 mt-0.5">
            {company}
          </p>
        </div>
      </div>
      <button className="text-slate-400 hover:text-blue-600 transition-colors">
        <BookmarkIcon className="w-5 h-5" />
      </button>
    </div>
    
    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-5 pb-5 border-b border-slate-50">
      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {location}</div>
      <div className="flex items-center gap-1.5 font-medium text-slate-700">{salary}</div>
      <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {type}</div>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-6 mt-1">
      {tags && tags.map((tag, i) => (
        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 text-xs font-medium rounded-lg">
          {tag}
        </span>
      ))}
    </div>
    
    <div className="flex justify-between items-center mt-auto pt-2">
      <span className="text-slate-400 text-sm font-medium">{time || 'Recently posted'}</span>
      <button className="btn-primary py-2 px-5 text-sm">
        View Job
      </button>
    </div>
  </div>
);

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Explore Open Roles</h1>
          <p className="text-slate-500 text-lg">Find the perfect job that matches your skills and career goals.</p>
        </div>

        {/* Search Bar Area */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="flex-1 outline-none text-slate-700 bg-transparent"
            />
          </div>
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent hidden md:flex">
            <MapPin className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="City, state, zip code, or 'remote'" 
              className="flex-1 outline-none text-slate-700 bg-transparent"
            />
          </div>
          <button className="btn-primary py-4 px-10 whitespace-nowrap shadow-md text-lg">
            Search
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.length === 0 && (
              <p className="text-slate-500 col-span-full text-center py-20">No jobs found.</p>
            )}
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;

