import React from 'react';
import { Home, Building2, BarChart2, Award, User, Settings, Search, GraduationCap, Monitor, CheckCircle, ArrowRight, Server } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CategoryChip = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm transition-all duration-200 group w-full text-left">
    <div className="p-2 bg-[#f4f7fa] dark:bg-slate-700/50 rounded-full text-slate-500 dark:text-slate-400">
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-medium text-[13px] text-slate-700 dark:text-slate-200 truncate flex-1">{label}</span>
    <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </span>
  </button>
);

const FeatureCard = ({ title, description, icon: Icon, colorClass }) => (
  <div className="card p-8 group hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClass}`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const LandingPage = ({ onLoginClick }) => {
  const { user } = useAuth();
  
  if (user) {
    if (user.role === 'SEEKER') return <Navigate to="/seeker-dashboard" />;
    if (user.role === 'EMPLOYER') return <Navigate to="/employer-dashboard" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" />;
  }
  const categories = [
    { icon: Home, label: "Remote" },
    { icon: Building2, label: "MNC" },
    { icon: BarChart2, label: "Data Science" },
    { icon: Award, label: "Internship" },
    { icon: User, label: "HR" },
    { icon: Settings, label: "Engineering" },
    { icon: Search, label: "Analytics" },
    { icon: GraduationCap, label: "Fresher" },
    { icon: Monitor, label: "Software & IT" },
    { icon: CheckCircle, label: "Project Mgmt" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h1 className="text-[2.5rem] md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your next job starts here
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-[17px]">
            Create an account or sign in to see your personalised job recommendations.
          </p>
          <div className="pt-4 flex justify-center">
            <button onClick={onLoginClick} className="inline-flex items-center justify-center bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 font-bold" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <CategoryChip key={index} icon={category.icon} label={category.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why choose Shivani Tech?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">We provide the best tools and connections to accelerate your career growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Verified Companies" 
              description="Every employer on our platform is strictly verified to ensure safe, legitimate, and high-quality job opportunities."
              icon={CheckCircle}
              colorClass="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            />
            <FeatureCard 
              title="Smart Matching" 
              description="Our AI-driven matching algorithm pairs your unique skills and experience with the perfect job requirements."
              icon={Server}
              colorClass="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
            <FeatureCard 
              title="Direct Communication" 
              description="Skip the middleman and communicate directly with hiring managers and recruiters through our built-in platform."
              icon={User}
              colorClass="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm mb-2 border border-blue-200 dark:border-blue-800/50">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Empowering careers through <span className="text-blue-600 dark:text-blue-400">innovation</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              At Shivani Technologies, we believe that the right opportunity can change a life, and the right talent can transform a business. Since our inception, we have been dedicated to bridging the gap between top-tier professionals and world-class organizations.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Our state-of-the-art matching platform doesn't just look at keywords—it understands context, culture fit, and career trajectories to make connections that last. Whether you are a fresher taking your first steps or an experienced leader, we are here to support your journey.
            </p>
            
            <div className="pt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-3xl font-black text-blue-600 dark:text-blue-400">10K+</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Active Jobs</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-blue-600 dark:text-blue-400">95%</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Placement Rate</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-blue-600 rounded-[2rem] transform translate-x-4 translate-y-4 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Shivani Technologies Team" 
              className="rounded-[2rem] w-full h-[400px] object-cover relative z-10 shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

