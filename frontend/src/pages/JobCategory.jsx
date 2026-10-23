import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Briefcase, ArrowLeft, Search } from 'lucide-react';
import Seo from '../components/Seo';
import { getInitials } from '../utils/helpers';

const CATEGORY_CONFIG = {
  'chennai': {
    title: 'IT & Software Jobs in Chennai | Shivani Technologies',
    heading: 'IT & Software Developer Jobs in Chennai',
    description: 'Explore the latest IT jobs, fresher vacancies, and tech career opportunities in Chennai on Shivani Technologies Job Portal.',
    filterKey: 'location',
    filterValue: 'chennai',
    introText: 'Find top software development, engineering, and tech roles with verified companies across Chennai, Tamil Nadu.'
  },
  'fresher': {
    title: 'IT Jobs for Freshers in Chennai & India | Shivani Technologies',
    heading: 'Top IT Jobs for Freshers & Entry-Level Graduates',
    description: 'Kickstart your career with the best entry-level and fresher IT jobs in software development, QA, testing, and support on Shivani Technologies.',
    filterKey: 'tag',
    filterValue: 'fresher',
    introText: 'Browse entry-level tech opportunities designed for recent graduates and freshers looking for their first breakthrough.'
  },
  'software-developer': {
    title: 'Software Developer Jobs in India | Shivani Technologies',
    heading: 'Software Developer & Engineering Careers',
    description: 'Find verified Software Developer job openings in frontend, backend, full stack, and mobile app development on Shivani Technologies.',
    filterKey: 'title',
    filterValue: 'developer',
    introText: 'High-growth opportunities for software developers with leading product companies and IT service providers.'
  },
  'java-developer': {
    title: 'Java Developer Jobs in Chennai & India | Shivani Technologies',
    heading: 'Java Developer & Spring Boot Vacancies',
    description: 'Explore Java Developer, Spring Boot, and Full Stack Java vacancies in Chennai and India on Shivani Technologies Job Portal.',
    filterKey: 'title',
    filterValue: 'java',
    introText: 'Exciting openings for Core Java, Spring Boot, and microservices developers across top IT enterprises.'
  }
};

export default function JobCategory() {
  const { category } = useParams();
  const config = CATEGORY_CONFIG[category?.toLowerCase()] || {
    title: `${category?.replace(/-/g, ' ')} Jobs | Shivani Technologies`,
    heading: `${category?.replace(/-/g, ' ')} Jobs`,
    description: `Discover top ${category?.replace(/-/g, ' ')} vacancies and career opportunities on Shivani Technologies.`,
    filterKey: 'title',
    filterValue: category?.replace(/-/g, ' ') || '',
    introText: `Browse matching job openings for ${category?.replace(/-/g, ' ')}.`
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [category]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/jobs');
      const allJobs = res.data;
      
      const filtered = allJobs.filter(job => {
        const val = config.filterValue.toLowerCase();
        if (config.filterKey === 'location') {
          return job.location?.toLowerCase().includes(val);
        }
        if (config.filterKey === 'tag') {
          return job.tags?.some(t => t.toLowerCase().includes(val)) ||
                 job.title?.toLowerCase().includes(val);
        }
        return job.title?.toLowerCase().includes(val) ||
               job.tags?.some(t => t.toLowerCase().includes(val));
      });

      setJobs(filtered.length > 0 ? filtered : allJobs.slice(0, 6));
    } catch (e) {
      console.error('Failed to load category jobs', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] min-h-[calc(100vh-80px)] py-10 px-4 transition-colors duration-300">
      <Seo 
        title={config.title}
        description={config.description}
        path={`/jobs/${category}`}
      />

      <div className="max-w-6xl mx-auto">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all jobs
        </Link>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {config.heading}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {config.introText}
          </p>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No matching vacancies found for this category right now.</p>
            <Link to="/jobs" className="btn-primary py-2 px-6 text-sm font-semibold inline-block">
              Explore All Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link 
                key={job.id} 
                to={`/jobs/${job.id}`}
                className="card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                      {getInitials(job.company) || 'C'}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">{job.title}</h2>
                      <p className="text-xs text-slate-500 capitalize">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">{job.salary}</span>
                  </div>

                  {job.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{job.type || 'Full-time'}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
