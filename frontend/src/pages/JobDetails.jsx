import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Briefcase, DollarSign, Calendar, Building2, 
  ArrowLeft, Share2, Bookmark, CheckCircle, Send, Clock, 
  ShieldCheck, ExternalLink, Sparkles 
} from 'lucide-react';
import Seo from '../components/Seo';
import { getInitials } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function JobDetails({ onLoginClick }) {
  const { id } = useParams();
  const numericId = id ? id.split('-')[0] : null;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    if (!numericId) return;
    fetchJobDetails();
  }, [numericId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/jobs/${numericId}`);
      setJob(res.data);

      // Fetch related jobs
      try {
        const allRes = await axios.get('/api/jobs');
        const others = allRes.data.filter(j => j.id !== Number(numericId)).slice(0, 3);
        setRelatedJobs(others);
      } catch (e) {
        console.error('Failed to load related jobs', e);
      }

      // Check if user has applied/saved
      if (user && user.role === 'SEEKER') {
        try {
          const appRes = await axios.get('/api/applications/my-applications');
          const applied = appRes.data?.some(app => app.job?.id === Number(numericId));
          setHasApplied(applied);
        } catch (e) {}

        try {
          const savedRes = await axios.get('/api/saved-jobs');
          const saved = savedRes.data?.some(sj => sj.job?.id === Number(numericId));
          setIsSaved(saved);
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error fetching job details', err);
      setError('This job posting could not be found or has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      if (onLoginClick) onLoginClick();
      else toast.info('Please sign in to apply for this job');
      return;
    }
    if (user.role !== 'SEEKER') {
      toast.warning('Only Job Seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await axios.post(`/api/applications/apply/${numericId}`);
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      if (onLoginClick) onLoginClick();
      return;
    }
    try {
      if (isSaved) {
        await axios.delete(`/api/saved-jobs/${numericId}`);
        setIsSaved(false);
        toast.info('Job removed from saved list');
      } else {
        await axios.post(`/api/saved-jobs/${numericId}`);
        setIsSaved(true);
        toast.success('Job saved successfully!');
      }
    } catch (e) {
      toast.error('Failed to update saved jobs');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job opening on Shivani Technologies: ${job.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-[#0f172a] text-center">
        <Seo title="Job Not Found | Shivani Technologies" description="This vacancy may have expired or is no longer accepting applications." noindex={true} />
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">Job Listing Expired or Unavailable</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error || 'The requested job posting is no longer available.'}</p>
        <Link to="/jobs" className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Browse Active Jobs
        </Link>
      </div>
    );
  }

  // Schema formatting for Google JobPosting
  const datePostedStr = job.postedAt ? job.postedAt.substring(0, 10) : new Date().toISOString().substring(0, 10);
  // Default valid through 30 days after posting
  const validThroughDate = new Date(new Date(datePostedStr).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const jobDescriptionHtml = job.description 
    ? `<p>${job.description}</p>`
    : `<p>Exciting career opportunity for <strong>${job.title}</strong> at <strong>${job.company}</strong> in ${job.location || 'Chennai, India'}. Key competencies include: ${job.tags && job.tags.length > 0 ? job.tags.join(', ') : 'Software, IT'}. Join a dynamic workforce and advance your professional journey on Shivani Technologies.</p>`;

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": jobDescriptionHtml,
    "datePosted": datePostedStr,
    "validThrough": validThroughDate,
    "employmentType": job.type?.toUpperCase().includes('PART') ? 'PART_TIME' : job.type?.toUpperCase().includes('INTERN') ? 'INTERN' : 'FULL_TIME',
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company || "Shivani Technologies Partner",
      "sameAs": "https://shivanitech.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Chennai",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary || "Best in Industry",
        "unitText": "YEAR"
      }
    }
  };

  const seoTitle = `${job.title} at ${job.company} - ${job.location || 'Chennai'} | Shivani Technologies`;
  const seoDesc = `Apply for ${job.title} vacancy at ${job.company} in ${job.location || 'Chennai, India'}. Salary: ${job.salary || 'Competitive'}. Employment Type: ${job.type || 'Full-time'}. Apply now on Shivani Technologies.`;

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] min-h-[calc(100vh-80px)] py-8 sm:py-12 px-4 transition-colors duration-300">
      <Seo 
        title={seoTitle} 
        description={seoDesc} 
        path={`/jobs/${job.id}`}
        jsonLd={jobPostingSchema} 
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
        </nav>

        {/* Main Job Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 sm:pb-8 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
                {getInitials(job.company) || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Employer
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {datePostedStr}
                  </span>
                </div>
                {/* H1 Heading for Google */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {job.title}
                </h1>
                <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="capitalize">{job.company}</span>
                </p>
              </div>
            </div>

            {/* Actions: Save & Share & Apply */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button 
                onClick={handleSaveToggle}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-400' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-white'
                }`}
                title={isSaved ? "Saved" : "Save Job"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={handleShare}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Share Job"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleApply}
                disabled={hasApplied || applying}
                className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-sm sm:text-base shadow-md transition-all ${
                  hasApplied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'btn-primary'
                }`}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Applied
                  </>
                ) : applying ? (
                  'Submitting...'
                ) : (
                  <>
                    Apply Now <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Key Job Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 sm:pt-8 text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 block font-medium mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Location
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{job.location || 'Multiple Locations'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 block font-medium mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Salary
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{job.salary || 'Not Disclosed'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 block font-medium mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Job Type
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{job.type || 'Full-time'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 block font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Posted Date
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{datePostedStr}</span>
            </div>
          </div>
        </div>

        {/* Content Section: Description & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Job Description
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
                {job.description ? (
                  <p className="whitespace-pre-line">{job.description}</p>
                ) : (
                  <>
                    <p>
                      <strong>{job.company}</strong> is currently looking for an energetic and qualified <strong>{job.title}</strong> to join their team in <strong>{job.location || 'India'}</strong>.
                    </p>
                    <p>
                      In this position, you will collaborate with cross-functional teams, contribute to high-impact projects, and help build world-class products. We are looking for candidates who are passionate about learning, problem-solving, and driving organizational success.
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Key Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Deliver reliable and maintainable solutions aligned with business standards.</li>
                      <li>Collaborate effectively with team members and key stakeholders.</li>
                      <li>Participate in code reviews, technical planning, and continuous improvement.</li>
                      <li>Troubleshoot, debug, and optimize performance for existing systems.</li>
                    </ul>
                  </>
                )}
              </div>

              {/* Skills and Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Required Skills &amp; Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 text-xs sm:text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: About Company & Safety Tips */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About {job.company}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {job.employer?.companyDescription || `${job.company} is a verified hiring partner on Shivani Technologies.`}
              </p>
              <Link 
                to={`/jobs?company=${encodeURIComponent(job.company)}`}
                className="text-blue-600 dark:text-blue-400 font-semibold text-sm inline-flex items-center hover:underline"
              >
                View all jobs at {job.company} <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Similar Opportunities</h3>
                <div className="space-y-3">
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj.id}
                      to={`/jobs/${rj.id}`}
                      className="block p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    >
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{rj.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rj.company} • {rj.location}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
