import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import LandingPage from './pages/LandingPage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobsPage from './pages/JobsPage';
import CompaniesPage from './pages/CompaniesPage';
import ServicesPage from './pages/ServicesPage';
import FinancialPage from './pages/FinancialPage';
import ContactPage from './pages/ContactPage';
import { AuthProvider } from './context/AuthContext';
import TestPage from './pages/TestPage';
import MobileAuth from './pages/MobileAuth';
import SplashScreen from './components/SplashScreen';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Download } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splash_shown'));
  const [updateInfo, setUpdateInfo] = useState(null);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splash_shown', 'true');
    setShowSplash(false);
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      registerPushNotifications();
      checkAppVersion();
    }
  }, []);

  const checkAppVersion = async () => {
    try {
      const info = await CapacitorApp.getInfo();
      const currentVersion = info.version;
      
      // Call our new backend endpoint
      // Ensure this URL is correct for your production environment eventually
      const response = await fetch('http://localhost:8081/api/app-version');
      const data = await response.json();
      
      // Basic version check (e.g. if current is 1.0.0 and latest is 1.0.1)
      if (currentVersion !== data.latestVersion) {
        setUpdateInfo(data);
      }
    } catch (error) {
      console.error("Failed to check app version", error);
    }
  };

  const registerPushNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('User denied push notifications');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Here you would typically send the token to your backend
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification);
      // Show an in-app alert when the app is open (foreground)
      toast.info(
        <div>
          <strong>{notification.title}</strong>
          <p className="text-sm">{notification.body}</p>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ', notification);
      // Handle the user tapping on the notification when outside the app
    });
  };
  if (updateInfo) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 p-4">
         <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <Download className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-800">Update Required</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">{updateInfo.releaseNotes}</p>
            <a 
              href={updateInfo.updateUrl} 
              className="block w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
               Update Now
            </a>
            {!updateInfo.forceUpdate && (
              <button 
                onClick={() => setUpdateInfo(null)}
                className="mt-4 text-slate-500 font-medium hover:text-slate-700"
              >
                Maybe Later
              </button>
            )}
         </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ToastContainer 
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <div className="min-h-[100dvh] bg-slate-50 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          <Header onLoginClick={() => setIsAuthModalOpen(true)} />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage onLoginClick={() => setIsAuthModalOpen(true)} />} />
              <Route path="/seeker-dashboard" element={<JobSeekerDashboard />} />
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/mobile-auth" element={<MobileAuth />} />
            </Routes>
          </div>
          <Footer />

          <AuthModals 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

