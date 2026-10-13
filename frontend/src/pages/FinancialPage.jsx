import React from 'react';
import { DollarSign, PieChart, CreditCard, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

const FinanceFeature = ({ title, description, icon: Icon }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 mt-1">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  </div>
);

const FinancialPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] min-h-[calc(100vh-80px)] transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Financial & Payroll Solutions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">Streamline your compensation processes with our integrated payroll, benefits management, and financial reporting tools.</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div className="space-y-8 sm:space-y-12">
          <FinanceFeature 
            title="Automated Payroll" 
            description="Run global payroll with a single click. We handle tax calculations, deductions, and direct deposits automatically." 
            icon={DollarSign} 
          />
          <FinanceFeature 
            title="Benefits Administration" 
            description="Manage health insurance, retirement plans, and custom perks through our unified dashboard." 
            icon={PieChart} 
          />
          <FinanceFeature 
            title="Expense Management" 
            description="Allow employees to submit expenses easily. Approve, reimburse, and sync with your accounting software seamlessly." 
            icon={CreditCard} 
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-3 sm:space-y-4 sm:pt-12">
            <div className="card p-5 sm:p-6 bg-blue-600 text-white border-none shadow-xl">
              <TrendingUp className="w-8 h-8 mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-1">$2.4M</div>
              <div className="text-blue-100 text-sm">Payroll Processed</div>
            </div>
            <div className="card p-5 sm:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <Activity className="w-8 h-8 mb-4 text-indigo-600 dark:text-indigo-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">99.9%</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">Uptime Reliability</div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="card p-5 sm:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <ShieldCheck className="w-8 h-8 mb-4 text-emerald-600 dark:text-emerald-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">SOC 2</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">Certified Security</div>
            </div>
            <div className="card p-5 sm:p-6 bg-slate-900 text-white border-none shadow-xl">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-xl font-bold mb-1">All Systems</div>
              <div className="text-slate-400 text-sm">Operational</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to simplify your finances?</h2>
        <a href="/contact" className="inline-block btn-primary py-3.5 sm:py-4 px-8 sm:px-10 text-base sm:text-lg shadow-md mx-auto rounded-xl">
          Schedule a Demo
        </a>
      </div>
    </div>
  );
};

export default FinancialPage;

