import React from 'react';
import { Star, Building2, MapPin, Users } from 'lucide-react';

const CompanyCard = ({ name, description, location, employees, rating, logoColor }) => (
  <div className="card p-6 flex flex-col hover:-translate-y-1 transition-transform">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white ${logoColor}`}>
        {name.charAt(0)}
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-sm font-semibold">
        <Star className="w-4 h-4 fill-current" /> {rating}
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{name}</h3>
    <p className="text-slate-500 text-sm mb-6 flex-1">{description}</p>
    
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="w-4 h-4 text-slate-400" /> {location}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Users className="w-4 h-4 text-slate-400" /> {employees} Employees
      </div>
    </div>
    
    <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200">
      View Open Jobs
    </button>
  </div>
);

const CompaniesPage = () => {
  const companies = [
    { name: "TechNova", description: "Leading provider of cloud infrastructure and enterprise AI solutions.", location: "San Francisco, CA", employees: "10,000+", rating: "4.8", logoColor: "bg-blue-600" },
    { name: "GlobalFin", description: "Modernizing financial services for the digital generation.", location: "New York, NY", employees: "5,000+", rating: "4.5", logoColor: "bg-emerald-600" },
    { name: "HealthPlus", description: "Innovative healthcare tech improving patient outcomes.", location: "Boston, MA", employees: "2,500+", rating: "4.9", logoColor: "bg-rose-500" },
    { name: "NexusRetail", description: "E-commerce platform powering millions of small businesses.", location: "Austin, TX", employees: "8,000+", rating: "4.3", logoColor: "bg-purple-600" },
    { name: "AutoDrive", description: "Pioneering the future of autonomous vehicles and smart transit.", location: "Detroit, MI", employees: "4,000+", rating: "4.6", logoColor: "bg-slate-800" },
    { name: "EduTech", description: "Making education accessible to everyone, everywhere.", location: "Remote", employees: "1,200+", rating: "4.7", logoColor: "bg-amber-500" },
    { name: "CyberShield", description: "Enterprise security solutions protecting the world's data.", location: "Washington, DC", employees: "3,500+", rating: "4.8", logoColor: "bg-indigo-600" },
    { name: "EcoEnergy", description: "Renewable energy tech for a sustainable future.", location: "Denver, CO", employees: "1,800+", rating: "4.4", logoColor: "bg-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Top Companies Hiring Now</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover great places to work. Explore company cultures, employee reviews, and open roles at the world's best companies.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <CompanyCard key={index} {...company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;

