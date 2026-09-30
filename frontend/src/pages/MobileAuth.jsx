import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const MobileAuth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'SEEKER';
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await loginWithGoogle(tokenResponse.access_token, role);
        if (data && data.token) {
          // Redirect back to mobile app using deep link
          let url = `shivaniapp://login?token=${data.token}&role=${data.role}`;
          if (data.companyName) {
            url += `&companyName=${encodeURIComponent(data.companyName)}`;
          }
          window.location.href = url;
        } else if (data && data.requireDetails) {
          // If they are not registered, we can redirect them to register in app but passing google token is hard.
          // For now, redirect with an error code, or just let them register on web.
          alert("Please register your account first on the website before logging into the app via Google.");
          window.location.href = `shivaniapp://login?error=not_registered`;
        }
      } catch (err) {
        alert("Login failed. Please try again.");
      }
    },
    onError: () => {
      alert("Google login failed.");
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to App</h1>
        <p className="text-slate-500">
          Click the button below to securely authenticate with Google and return to the Shivani Tech app.
        </p>
        <button 
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-semibold text-slate-700 shadow-sm"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default MobileAuth;
