import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MobileAuth = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const role = searchParams.get('role') || localStorage.getItem('mobile_auth_role') || 'SEEKER';
  const { loginWithGoogle } = useAuth();
  
  useEffect(() => {
    if (searchParams.get('role')) {
      localStorage.setItem('mobile_auth_role', searchParams.get('role'));
    }

    // Check if we just returned from Google OAuth redirect
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      setLoading(true);
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        handleGoogleResponse(accessToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const [returnUrl, setReturnUrl] = useState('');

  const handleGoogleResponse = async (accessToken) => {
    try {
      const data = await loginWithGoogle(accessToken, role);
      if (data && data.token) {
        // Redirect back to mobile app using deep link
        let url = `shivaniapp://login?token=${data.token}&role=${data.role}`;
        if (data.companyName) {
          url += `&companyName=${encodeURIComponent(data.companyName)}`;
        }
        setReturnUrl(url);
        window.location.href = url;
      } else if (data && data.requireDetails) {
        toast.error("Please register your account first on the website before logging into the app via Google.");
        const url = `shivaniapp://login?error=not_registered`;
        setReturnUrl(url);
        window.location.href = url;
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('mobile_auth_role', role);
    const clientId = '409550030080-3us131eki79rkudl2843ocg31m4t5aa9.apps.googleusercontent.com';
    const redirectUri = 'https://shivanitech.in/mobile-auth';
    const scope = 'email profile';
    // Use manual redirect instead of popup to ensure it works in Capacitor InAppBrowser
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Sign in to App</h1>
        <p className="text-slate-500">
          Click the button below to securely authenticate with Google and return to the Shivani Tech app.
        </p>
        {returnUrl ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm">
              Authentication successful! If you are not automatically redirected, please click the button below.
            </div>
            <button 
              onClick={() => window.location.href = returnUrl}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-white shadow-sm"
            >
              Return to App
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-semibold text-slate-700 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue with Google'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileAuth;
