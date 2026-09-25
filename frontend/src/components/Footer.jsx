import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Phone, Mail } from 'lucide-react';

const XIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedinIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const FacebookIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-8 pb-6 px-4 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Brand & About */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Shivani Technologies Logo" className="h-10 w-auto" />
            <span className="text-[1.3rem] font-black text-white tracking-tight">SHIVANI TECHNOLOGIES</span>
          </Link>
          <p className="text-[14px] leading-relaxed text-slate-400">
            Empowering careers and connecting top talent with industry-leading companies globally. Your dream job is just a click away.
          </p>
          <div className="flex gap-3">
            {[XIcon, LinkedinIcon, FacebookIcon, InstagramIcon].map((Icon, idx) => (
              <a key={idx} href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#3b82f6] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300">
                <Icon width="15" height="15" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:ml-8">
          <h4 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Quick Links</h4>
          <ul className="space-y-2 text-[14px] text-slate-400">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/companies" className="hover:text-white transition-colors">Top Companies</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
            <li><Link to="/financial" className="hover:text-white transition-colors">Financial Tools</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Support</h4>
          <ul className="space-y-2 text-[14px] text-slate-400">
            <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Trust & Safety</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider text-sm uppercase">Contact Us</h4>
          <ul className="space-y-2 text-[14px] text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">Shivani Technologies, old No.36, New No.109, Third Floor, No.3C MTH Road, DL Complex, Villivakkam, Chennai - 600049</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>+91 97907 04999</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Hr@shivanitech.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-center gap-3 text-[13px] text-slate-500 uppercase tracking-wider">
        <p>© 2026 Shivani Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

