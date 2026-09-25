import React from 'react';
import { Users, Award, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, icon: Icon, colorClass, price, actionText, linkTo }) => (
  <div className="bg-white dark:bg-slate-800 p-8 flex flex-col items-start text-left border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClass}`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-[19px] font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-1 text-[15px] mb-8">{description}</p>
    
    <div className="w-full mt-auto">
      <div className="font-bold text-slate-900 dark:text-white mb-6 text-sm">{price}</div>
      <div className="flex justify-center w-full">
        {linkTo ? (
          <Link to={linkTo} className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {actionText} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        ) : (
          <button className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {actionText} <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        )}
      </div>
    </div>
  </div>
);

const ServicesPage = () => {
  const services = [
    { 
      title: "Interview Preparation", 
      description: "Practice with AI and expert coaches to nail your next interview.", 
      icon: Users, 
      colorClass: "bg-emerald-100/80 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      price: "₹49/session",
      actionText: "Book a Coach",
      linkTo: "/contact"
    },
    { 
      title: "Skill Certifications", 
      description: "Earn certificates to prove your skills and stand out to top employers.", 
      icon: Award, 
      colorClass: "bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      price: "From ₹19",
      actionText: "Explore Courses",
      linkTo: "/contact"
    },
    { 
      title: "Career Counseling", 
      description: "Get personalized 1-on-1 advice from industry veterans and recruiters.", 
      icon: BookOpen, 
      colorClass: "bg-orange-100/80 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      price: "₹79/session",
      actionText: "Find a Mentor",
      linkTo: "/contact"
    },
    { 
      title: "Skill Assessments", 
      description: "Take 20-question skill tests in HTML, CSS, and JS to prove your expertise.", 
      icon: FileText, 
      colorClass: "bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      price: "Free",
      actionText: "Take a Test",
      linkTo: "/test"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] pt-16 pb-24 px-4 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Accelerate Your Career</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[17px]">We offer a premium suite of tools and services designed to help you land your dream job faster.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

