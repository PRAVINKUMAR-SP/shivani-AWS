import React, { useState, useEffect } from 'react';
import { Star, Building2, MapPin, Users } from 'lucide-react';
import { getInitials } from '../utils/helpers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company, onClick }) => (
  <div onClick={onClick} className="card p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-blue-600 bg-blue-50 border border-slate-100 overflow-hidden shadow-sm">
        {company.profilePicUrl ? (
          <img src={company.profilePicUrl.replace(/^https?:\/\/localhost:\d+/, '').replace(/^\/uploads\//, '/api/uploads/')} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          getInitials(company.companyName || company.name || 'C')
        )}
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-sm font-semibold">
        <Star className="w-4 h-4 fill-current" /> 4.5
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 capitalize">{company.companyName || company.name || 'Unknown Company'}</h3>
    <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3">{company.companyDescription || 'A great company looking for top talent.'}</p>
    
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="w-4 h-4 text-slate-400" /> {company.location || 'Multiple Locations'}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Users className="w-4 h-4 text-slate-400" /> 100+ Employees
      </div>
    </div>
    
    <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200">
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
    <div className="bg-slate-50 pt-12 pb-20 px-4 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Top Companies Hiring Now</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover great places to work. Explore company cultures and open roles at the world's best companies.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No companies found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
