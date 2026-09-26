import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthModals = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('select-role'); // select-role, login-seeker, login-employer, register-seeker, register-employer
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth(); // Need to add loginWithGoogle to AuthContext
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [googleToken, setGoogleToken] = useState('');
  const [currentRole, setCurrentRole] = useState('SEEKER');

  const doGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError('');
        const data = await loginWithGoogle(tokenResponse.access_token, currentRole);
        if (data && data.requireDetails) {
            setGoogleToken(tokenResponse.access_token);
            setEmail(data.email || '');
            setName(data.name || '');
            setStep(currentRole === 'SEEKER' ? 'google-register-seeker' : 'google-register-employer');
            return;
        }

        if (data && data.role !== currentRole && data.role !== 'ADMIN') {
            setError(`You are registered as a ${data.role}. Please login from the correct portal.`);
            return;
        }

        onClose();
        let finalRedirect = currentRole === 'SEEKER' ? '/seeker-dashboard' : '/employer-dashboard';
        if (data.role === 'ADMIN') {
          finalRedirect = '/admin-dashboard';
        }
        navigate(finalRedirect);
      } catch (err) {
        setError(err.response?.data || 'Google login failed.');
      }
    },
    onError: () => {
      setError('Google login failed.');
    }
  });

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
      let finalRedirect = redirect;
      if (data.role === 'ADMIN') {
        finalRedirect = '/admin-dashboard';
      }
      navigate(finalRedirect);
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e, role, redirectStep) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role, phoneNo, companyName);
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
    setPhoneNo('');
    setCompanyName('');
    setError('');
  };

  const changeStep = (newStep) => {
    resetForm();
    setStep(newStep);
  }

  const handleGoogleLogin = (role) => {
    setCurrentRole(role);
    doGoogleLogin();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="card w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 shadow-xl">
        
        {/* Header */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 pb-4 sm:pb-8">
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
                <button onClick={() => changeStep('select-role')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Sign in as Job Seeker</h2>
                <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={(e) => handleLogin(e, 'SEEKER', '/seeker-dashboard')} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full text-base font-semibold py-3.5">
                  Sign In
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400 uppercase font-semibold text-xs tracking-wider">Or</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => handleGoogleLogin('SEEKER')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-semibold text-slate-700 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              
              <div className="text-center text-sm text-slate-600 mt-6">
                Don't have an account? <button onClick={() => changeStep('register-seeker')} className="text-blue-600 font-semibold hover:underline">Sign up</button>
              </div>
            </div>
          )}

          {step === 'register-seeker' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-seeker')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Create Seeker Account</h2>
                <p className="text-slate-500 text-sm">Find your dream job today.</p>
              </div>

              <form onSubmit={(e) => handleRegister(e, 'SEEKER', 'login-seeker')} className="space-y-4">
                <div>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="tel" placeholder="Mobile Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="btn-primary w-full">Sign Up</button>
              </form>
            </div>
          )}

          {step === 'login-employer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('select-role')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Sign in as Employer</h2>
                <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
              </div>

              <form onSubmit={(e) => handleLogin(e, 'EMPLOYER', '/employer-dashboard')} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-base font-semibold py-3.5">Sign In</button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400 uppercase font-semibold text-xs tracking-wider">Or</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => handleGoogleLogin('EMPLOYER')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-semibold text-slate-700 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="text-center text-sm text-slate-600 mt-6">
                New company? <button onClick={() => changeStep('register-employer')} className="text-blue-600 font-semibold hover:underline">Register here</button>
              </div>
            </div>
          )}

          {step === 'register-employer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-employer')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Register Company</h2>
                <p className="text-slate-500 text-sm">Start hiring the best talent.</p>
              </div>

              <form onSubmit={(e) => handleRegister(e, 'EMPLOYER', 'login-employer')} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="tel" placeholder="Mobile Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" placeholder="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="btn-primary w-full">Register</button>
              </form>
            </div>
          )}
          {step === 'google-register-seeker' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-seeker')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Complete Profile</h2>
                <p className="text-slate-500 text-sm">Please provide your details.</p>
              </div>

              <form onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');
                  try {
                      const data = await loginWithGoogle(googleToken, 'SEEKER', phoneNo, name);
                      onClose();
                      navigate('/seeker-dashboard');
                  } catch (err) {
                      setError(err.response?.data || 'Registration failed.');
                  }
              }} className="space-y-4">
                <div>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" value={email} disabled className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed" />
                </div>
                <div>
                  <input type="tel" placeholder="Mobile Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="btn-primary w-full">Complete Registration</button>
              </form>
            </div>
          )}

          {step === 'google-register-employer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button onClick={() => changeStep('login-employer')} className="text-slate-400 hover:text-slate-600 absolute left-4 sm:left-6 top-6">
                  &larr; Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">Complete Employer Profile</h2>
                <p className="text-slate-500 text-sm">Please provide your details.</p>
              </div>

              <form onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');
                  try {
                      const data = await loginWithGoogle(googleToken, 'EMPLOYER', phoneNo, name, companyName);
                      if (data && data.token) {
                          onClose();
                          navigate('/employer-dashboard');
                      } else {
                          setError('Registration pending approval or failed.');
                      }
                  } catch (err) {
                      setError(err.response?.data || 'Registration failed.');
                  }
              }} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="email" value={email} disabled className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed" />
                </div>
                <div>
                  <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <div>
                  <input type="tel" placeholder="Mobile Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>
                <button type="submit" className="btn-primary w-full">Complete Registration</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModals;

