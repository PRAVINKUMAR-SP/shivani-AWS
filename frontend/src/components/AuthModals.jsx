import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('select-role'); // select-role, login-seeker, login-employer, register-seeker, register-employer
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e, role, redirect) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.role !== role && data.role !== 'ADMIN') {
        setError(`You are not registered as an ${role}`);
        return;
      }
      onClose();
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e, role, redirectStep) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      setStep(redirectStep);
      setError('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const changeStep = (newStep) => {
    resetForm();
    setStep(newStep);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

          {step === 'select-role' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">How would you like to login?</h2>
                <p className="text-slate-500">Select the option that best describes you.</p>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => changeStep('login-seeker')}
                  className="w-full text-left p-4 rounded-xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all bg-white shadow-sm ring-1 ring-gray-200"
                >
                  <div className="font-semibold text-slate-900">I'm a Job Seeker</div>
                  <div className="text-sm text-slate-500 mt-1">Login to find jobs near you</div>
                </button>

                <button 
                  onClick={() => changeStep('login-employer')}
                  className="w-full text-left p-4 rounded-xl border-2 border-yellow-400 hover:bg-yellow-50 transition-all bg-white shadow-sm"
                >
                  <div className="font-semibold text-slate-900">I'm an Employer</div>
                  <div className="text-sm text-slate-500 mt-1">Login to manage your job listings</div>
                </button>
              </div>
            </div>
          )}

          {step === 'login-seeker' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('select-role')} className="text-slate-400 hover:text-slate-600 absolute left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Sign in as Job Seeker</h2>
                <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={(e) => handleLogin(e, 'SEEKER', '/seeker-dashboard')} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">
                  Sign In
                </button>
              </form>
              
              <div className="text-center text-sm text-slate-600 mt-6">
                Don't have an account? <button onClick={() => changeStep('register-seeker')} className="text-blue-600 font-semibold hover:underline">Sign up</button>
              </div>
            </div>
          )}

          {step === 'register-seeker' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-seeker')} className="text-slate-400 hover:text-slate-600 absolute left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Create Seeker Account</h2>
                <p className="text-slate-500 text-sm">Find your dream job today.</p>
              </div>

              <form onSubmit={(e) => handleRegister(e, 'SEEKER', 'login-seeker')} className="space-y-4">
                <div>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">Sign Up</button>
              </form>
            </div>
          )}

          {step === 'login-employer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('select-role')} className="text-slate-400 hover:text-slate-600 absolute left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Sign in as Employer</h2>
                <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={(e) => handleLogin(e, 'EMPLOYER', '/employer-dashboard')} className="space-y-4">
                <div>
                  <input type="email" placeholder="company@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">Sign In</button>
              </form>
              <div className="text-center text-sm text-slate-600 mt-6">
                New company? <button onClick={() => changeStep('register-employer')} className="text-blue-600 font-semibold hover:underline">Register here</button>
              </div>
            </div>
          )}

          {step === 'register-employer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-employer')} className="text-slate-400 hover:text-slate-600 absolute left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Register Company</h2>
                <p className="text-slate-500 text-sm">Start hiring the best talent.</p>
              </div>

              <form onSubmit={(e) => handleRegister(e, 'EMPLOYER', 'login-employer')} className="space-y-4">
                <div>
                  <input type="text" placeholder="Company Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" placeholder="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">Register</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModals;
