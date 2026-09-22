import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative flex items-center justify-center">
                {/* Simplified Logo representation */}
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-blue-600 border-r-[12px] border-r-transparent absolute top-0"></div>
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-red-500 border-r-[12px] border-r-transparent absolute -bottom-1 -left-2 rotate-180"></div>
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-yellow-400 border-r-[12px] border-r-transparent absolute -bottom-1 -right-2 rotate-180"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full z-10"></div>
              </div>
              <span className="text-xl font-bold text-blue-700 uppercase tracking-tight">Shivani Technologies</span>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/jobs" className="border-b-2 border-blue-600 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Jobs
              </Link>
              <Link to="/companies" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Companies
              </Link>
              <Link to="/services" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Services
              </Link>
              <Link to="/financial" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Financial
              </Link>
              <Link to="/contact" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact Us
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link to={user.role === 'SEEKER' ? '/seeker-dashboard' : user.role === 'EMPLOYER' ? '/employer-dashboard' : '/admin-dashboard'} className="text-gray-700 font-medium hover:text-blue-600 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user.email.split('@')[0]}</span>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="text-blue-600 font-semibold hover:text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
