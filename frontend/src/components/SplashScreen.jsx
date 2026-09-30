import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem, Directory } from '@capacitor/filesystem';

const SplashScreen = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Geolocation.requestPermissions();
          await LocalNotifications.requestPermissions();
          await Filesystem.requestPermissions();
        } catch (e) {
          console.warn('Permission requests skipped or failed', e);
        }
      }
    };

    requestPermissions();

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 500); // Wait for fade out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col items-center justify-center transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative flex flex-col items-center animate-fade-in-up">
        {/* Logo / Icon Animation */}
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 animate-bounce">
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ST</span>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight text-center">
          Welcome to
        </h1>
        <h2 className="text-2xl md:text-4xl font-extrabold text-blue-200 text-center tracking-widest">
          SHIVANI TECHNOLOGY
        </h2>
        
        {/* Loading dots */}
        <div className="flex gap-2 mt-8">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
