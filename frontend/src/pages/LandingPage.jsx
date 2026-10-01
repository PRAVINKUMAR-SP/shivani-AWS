import React from 'react';
import { Home, Building2, BarChart2, Award, User, Settings, Search, GraduationCap, Monitor, CheckCircle, ArrowRight, Server, Download, Globe, Smartphone, TrendingUp, Code } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

const ServiceCard = ({ title, description, icon: Icon, colorClass, bgLight, bgDark }) => (
  <div className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
    <div className={`absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full opacity-20 dark:opacity-10 transition-transform duration-700 group-hover:scale-[2.5] ${bgLight} ${bgDark}`}></div>
    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${bgLight} ${bgDark} ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="relative text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
    <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
      {description}
    </p>
    <div className="relative mt-8 flex items-center text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
      Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
    </div>
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
    <div className="bg-slate-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-16 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium text-sm border border-blue-200 dark:border-blue-800/50">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>Over 10,000+ jobs available</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Discover your <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">dream career</span> today
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Join thousands of professionals finding great jobs, building connections, and growing their careers with Shivani Tech.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-2 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button onClick={onLoginClick} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 font-bold" />
              </button>
              <a href="/shivani-app.apk" download className="inline-flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg hover:-translate-y-1">
                Download App
                <Download className="w-5 h-5 ml-2 font-bold" />
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[3rem] transform rotate-3 opacity-20 dark:opacity-30"></div>
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80" 
              alt="Professional Job Seeker" 
              className="relative z-10 rounded-[3rem] w-full h-[600px] object-cover shadow-2xl border-8 border-white dark:border-slate-800 hover:scale-105 transition-transform duration-500"
            />
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 -left-10 z-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Profile Matched</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Senior Developer</p>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -right-10 z-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Interview Invite</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tech Corp Inc.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-[1100px] mx-auto mt-16 relative z-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <CategoryChip key={index} icon={category.icon} label={category.label} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0f172a] px-4 transition-colors duration-300 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 dark:from-blue-600/20 dark:to-purple-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-sm border border-indigo-200 dark:border-indigo-800/50 uppercase tracking-wider">
              Our Services
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Transforming Ideas into <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Digital Reality</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
              We offer end-to-end development and digital solutions to scale your business and establish a powerful online presence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              title="Website Development" 
              description="Crafting responsive, high-performance, and visually stunning websites tailored to your brand identity."
              icon={Globe}
              bgLight="bg-blue-100"
              bgDark="dark:bg-blue-900/40"
              colorClass="text-blue-600 dark:text-blue-400"
            />
            <ServiceCard 
              title="App Development" 
              description="Building intuitive and scalable mobile applications for iOS and Android platforms."
              icon={Smartphone}
              bgLight="bg-purple-100"
              bgDark="dark:bg-purple-900/40"
              colorClass="text-purple-600 dark:text-purple-400"
            />
            <ServiceCard 
              title="SEO Deployment" 
              description="Data-driven SEO strategies to boost your search rankings and drive organic traffic."
              icon={TrendingUp}
              bgLight="bg-emerald-100"
              bgDark="dark:bg-emerald-900/40"
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
            <ServiceCard 
              title="Full Stack Development" 
              description="Robust front-end and back-end solutions using the latest technologies and frameworks."
              icon={Code}
              bgLight="bg-orange-100"
              bgDark="dark:bg-orange-900/40"
              colorClass="text-orange-600 dark:text-orange-400"
            />
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

