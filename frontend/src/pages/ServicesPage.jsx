import React from 'react';
import { Users, Award, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, icon: Icon, colorClass, price, actionText, linkTo }) => (
  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 flex flex-col items-start text-left border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 ${colorClass}`}>
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
    </div>
    <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-1 text-sm sm:text-[15px] mb-6 sm:mb-8">{description}</p>
    
    <div className="w-full mt-auto">
      <div className="font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 text-sm">{price}</div>
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
      price: "Free",
      actionText: "Book a Coach",
      linkTo: "/contact?subject=Interview+Preparation"
    },
    { 
      title: "Skill Certifications", 
      description: "Earn certificates to prove your skills and stand out to top employers.", 
      icon: Award, 
      colorClass: "bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      price: "Free",
      actionText: "Explore Courses",
      linkTo: "/contact?subject=Skill+Certifications"
    },
    { 
      title: "Career Counseling", 
      description: "Get personalized 1-on-1 advice from industry veterans and recruiters.", 
      icon: BookOpen, 
      colorClass: "bg-orange-100/80 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      price: "Free",
      actionText: "Find a Mentor",
      linkTo: "/contact?subject=Career+Counseling"
    },
    { 
      title: "Skill Assessments", 
      description: "Take 20-question skill tests in HTML, CSS, and JS to prove your expertise.", 
      icon: FileText, 
      colorClass: "bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      price: "Free",
      actionText: "Take a Test",
      linkTo: "/test"
    },
    { 
      title: "GST REGISTRATION", 
      description: "Professional assistance for your GST registration process quickly and effortlessly.", 
      icon: FileText, 
      colorClass: "bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      price: "Free",
      actionText: "Register Now",
      linkTo: "/contact?subject=GST+REGISTRATION"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0f172a] pt-8 sm:pt-16 pb-16 sm:pb-24 px-4 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Accelerate Your Career</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-[17px]">We offer a premium suite of tools and services designed to help you land your dream job faster.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

