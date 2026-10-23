import React, { useState, useEffect } from 'react';
import { Star, Building2, MapPin, Users } from 'lucide-react';
import { getInitials } from '../utils/helpers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company, onClick }) => (
  <div onClick={onClick} className="card p-5 sm:p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
    <div className="flex items-start justify-between mb-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm flex-shrink-0">
        {company.profilePicUrl ? (
          <img src={company.profilePicUrl.replace(/^https?:\/\/localhost:\d+/, '').replace(/^\/uploads\//, '/api/uploads/')} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          getInitials(company.companyName || company.name || 'C')
        )}
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold">
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> 4.5
      </div>
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 capitalize">{company.companyName || company.name || 'Unknown Company'}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 sm:mb-6 flex-1 line-clamp-3">{company.companyDescription || 'A great company looking for top talent.'}</p>
    
    <div className="space-y-2 mb-5 sm:mb-6">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {company.location || 'Multiple Locations'}
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <Users className="w-4 h-4 text-slate-400 shrink-0" /> 100+ Employees
      </div>
    </div>
    
    <button className="w-full py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-600 text-xs sm:text-sm">
      View Open Jobs
    </button>
  </div>
);

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/public/employers');
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 min-h-[calc(100vh-80px)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Top Companies Hiring on <span className="text-blue-600 dark:text-blue-400">Shivani Technologies</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Discover verified employers and open job opportunities on the Shivani Technologies job portal (shivanitech.in).
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-10">No companies found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {companies.map((company, index) => (
              <CompanyCard key={index} company={company} onClick={() => navigate('/jobs?company=' + encodeURIComponent(company.companyName || company.name))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
