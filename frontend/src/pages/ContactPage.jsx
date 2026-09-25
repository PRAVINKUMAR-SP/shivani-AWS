import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactInfo = ({ icon: Icon, title, content }) => (
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-sm">{content}</p>
    </div>
  </div>
);

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-20 px-4 flex justify-center items-center transition-colors duration-300">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Get in <span className="text-indigo-600 dark:text-indigo-400">Touch</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
              Have a question about our platform, pricing, or looking to partner with us? Our dedicated support team is here to help you every step of the way. Fill out the form or give us a call.
            </p>
          </div>
          
          <div className="space-y-8 pt-4">
            <ContactInfo 
              icon={MapPin} 
              title="Our Location" 
              content="Shivani Technologies, old No.36, New No.109, Third Floor, No.3C MTH Road, DL Complex, Villivakkam, Chennai-600 049" 
            />
            <ContactInfo 
              icon={Mail} 
              title="Email Us" 
              content="Hr@shivanitech.in" 
            />
            <ContactInfo 
              icon={Phone} 
              title="Call Support" 
              content="+91 97907 04999" 
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="card p-8 sm:p-10 shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Your Name *</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
              <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="9876543210" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="Business Inquiry" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message *</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:text-white" placeholder="Tell us about your project requirements..."></textarea>
            </div>
            
            <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors">
              Send Message
              <Send className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ContactPage;

