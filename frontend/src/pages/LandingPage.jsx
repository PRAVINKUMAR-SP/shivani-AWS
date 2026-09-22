import React from 'react';
import { Briefcase, Building2, LineChart, GraduationCap, Code, Server, User, Search } from 'lucide-react';

const CategoryChip = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
      <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
    </div>
    <span className="font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
    <span className="text-gray-400 ml-auto">&gt;</span>
  </button>
);

const LandingPage = () => {
  const categories = [
    { icon: Briefcase, label: "Remote" },
    { icon: Building2, label: "MNC" },
    { icon: LineChart, label: "Data Science" },
    { icon: GraduationCap, label: "Internship" },
    { icon: User, label: "HR" },
    { icon: Server, label: "Engineering" },
    { icon: Search, label: "Analytics" },
    { icon: GraduationCap, label: "Fresher" },
    { icon: Code, label: "Software & IT" },
    { icon: Briefcase, label: "Project Mgmt" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Your next job starts here
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create an account or sign in to see your personalised job recommendations.
        </p>
        <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto text-lg">
          Get Started
          <span className="text-xl leading-none">&rarr;</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {categories.map((category, index) => (
          <CategoryChip key={index} icon={category.icon} label={category.label} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
