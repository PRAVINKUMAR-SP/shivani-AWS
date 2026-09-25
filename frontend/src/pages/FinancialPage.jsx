import React from 'react';
import { DollarSign, PieChart, CreditCard, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

const FinanceFeature = ({ title, description, icon: Icon }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 mt-1">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  </div>
);

const FinancialPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Financial & Payroll Solutions</h1>
          <p className="text-slate-500 text-lg">Streamline your compensation processes with our integrated payroll, benefits management, and financial reporting tools.</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-12">
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <div className="card p-6 bg-blue-600 text-white border-none shadow-xl">
              <TrendingUp className="w-8 h-8 mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-1">$2.4M</div>
              <div className="text-blue-100 text-sm">Payroll Processed</div>
            </div>
            <div className="card p-6">
              <Activity className="w-8 h-8 mb-4 text-indigo-600" />
              <div className="text-3xl font-bold text-slate-900 mb-1">99.9%</div>
              <div className="text-slate-500 text-sm">Uptime Reliability</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <ShieldCheck className="w-8 h-8 mb-4 text-emerald-600" />
              <div className="text-3xl font-bold text-slate-900 mb-1">SOC 2</div>
              <div className="text-slate-500 text-sm">Certified Security</div>
            </div>
            <div className="card p-6 bg-slate-900 text-white border-none shadow-xl">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-xl font-bold mb-1">All Systems</div>
              <div className="text-slate-400 text-sm">Operational</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 pb-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Ready to simplify your finances?</h2>
        <button className="btn-primary py-4 px-10 text-lg shadow-md mx-auto">
          Schedule a Demo
        </button>
      </div>
    </div>
  );
};

export default FinancialPage;

