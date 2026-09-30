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
        <div className="mb-8 animate-[bounce_2s_ease-in-out_infinite]">
          <div className="w-32 h-32 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center overflow-hidden border-4 border-white/20">
            <img src="/logo.png" alt="Shivani Technology Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center animate-[fade-in-up_1s_ease-out]">
          <h1 className="text-2xl md:text-4xl font-medium text-blue-100 mb-1 tracking-wide">
            Welcome to
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-wider mt-2 shadow-sm drop-shadow-lg">
            Shivani Technology
          </h2>
        </div>
        
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
