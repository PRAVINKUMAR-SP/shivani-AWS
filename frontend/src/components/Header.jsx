import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, User as UserIcon, LogOut, Shield, Briefcase, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getAdminViewText = () => {
    if (location.pathname.includes('employer')) return 'Employer';
    if (location.pathname.includes('seeker')) return 'Seeker';
    return 'Admin';
  };

  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to get initials
  const getInitials = () => {
    if (user.name && user.name.length >= 2) return user.name.substring(0, 2).toUpperCase();
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="glass-header sticky top-0 z-50 w-full transition-all duration-200">
      <div className="px-4 sm:px-6 lg:px-8 w-full h-20 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Shivani Technologies Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tight hidden sm:block transition-colors">Shivani Technologies</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:ml-10 lg:flex lg:space-x-8">
            <Link to="/companies" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white inline-flex items-center text-base font-semibold transition-colors">
              Companies
            </Link>
            <Link to="/services" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white inline-flex items-center text-base font-semibold transition-colors">
              Services
            </Link>
            <Link to="/financial" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white inline-flex items-center text-base font-semibold transition-colors">
              Financial
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white inline-flex items-center text-base font-semibold transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'ADMIN' && (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setRoleMenuOpen(!roleMenuOpen)} className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm shadow-sm transition-all duration-300">
                    <Shield className="w-4 h-4" /> {getAdminViewText()}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  {roleMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-xl border border-slate-100 overflow-hidden w-48 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch View</div>
                      <Link to="/admin-dashboard" onClick={() => setRoleMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">Admin Dashboard</Link>
                      <Link to="/employer-dashboard" onClick={() => setRoleMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium">Employer Dashboard</Link>
                      <Link to="/seeker-dashboard" onClick={() => setRoleMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium">Seeker Dashboard</Link>
                    </div>
                  )}
                </div>
              )}
              {user.role === 'EMPLOYER' && (
                <Link to="/employer-dashboard" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors">
                  <Briefcase className="w-4 h-4" /> Employer
                </Link>
              )}
              
              <Link to={user.role === 'SEEKER' ? '/seeker-dashboard' : user.role === 'EMPLOYER' ? '/employer-dashboard' : '/admin-dashboard'} className="text-slate-700 font-medium hover:text-blue-600 flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white/20 dark:ring-slate-800">
                  {getInitials()}
                </div>
              </Link>
              <button onClick={logout} className="text-slate-400 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors p-2" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="text-blue-600 font-bold text-base hover:text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign in
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col space-y-4">
          <Link to="/companies" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-base font-semibold">Companies</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-base font-semibold">Services</Link>
          <Link to="/financial" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-base font-semibold">Financial</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-base font-semibold">Contact Us</Link>
          
          {user && user.role === 'ADMIN' && (
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch View</div>
              <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" /> Admin Dashboard
              </Link>
              <Link to="/employer-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Employer Dashboard
              </Link>
              <Link to="/seeker-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-green-600 hover:text-green-700 dark:text-green-400 text-base font-semibold flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Seeker Dashboard
              </Link>
            </div>
          )}
          
          {user && user.role === 'EMPLOYER' && (
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-4">
              <Link to="/employer-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Employer Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

