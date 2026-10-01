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
    <div className={`fixed inset-0 z-[9999] bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-center transition-opacity duration-500 overflow-hidden ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <style>
        {`
          @keyframes float3d {
            0% { transform: perspective(1000px) rotateY(0deg) translateY(0px); }
            25% { transform: perspective(1000px) rotateY(90deg) translateY(-10px); }
            50% { transform: perspective(1000px) rotateY(180deg) translateY(0px); }
            75% { transform: perspective(1000px) rotateY(270deg) translateY(10px); }
            100% { transform: perspective(1000px) rotateY(360deg) translateY(0px); }
          }
          .logo-3d-wrapper {
            animation: float3d 5s infinite linear;
            transform-style: preserve-3d;
          }
          .glow-ring {
            box-shadow: 0 0 40px 10px rgba(99, 102, 241, 0.4);
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse-ring {
            0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 40px 10px rgba(99, 102, 241, 0.4); }
            50% { opacity: .7; transform: scale(1.05); box-shadow: 0 0 60px 15px rgba(139, 92, 246, 0.6); }
          }
          .text-gradient {
            background: linear-gradient(to right, #818cf8, #c084fc, #f472b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes progress-left {
            0% { transform: scaleX(0); opacity: 0; transform-origin: left; }
            50% { transform: scaleX(1); opacity: 1; transform-origin: left; }
            50.1% { transform: scaleX(1); opacity: 1; transform-origin: right; }
            100% { transform: scaleX(0); opacity: 0; transform-origin: right; }
          }
          @keyframes progress-right {
            0% { transform: scaleX(0); opacity: 0; transform-origin: right; }
            50% { transform: scaleX(1); opacity: 1; transform-origin: right; }
            50.1% { transform: scaleX(1); opacity: 1; transform-origin: left; }
            100% { transform: scaleX(0); opacity: 0; transform-origin: left; }
          }
        `}
      </style>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative flex flex-col items-center animate-fade-in-up z-10">
        {/* 3D Logo Animation */}
        <div className="mb-12 perspective-[1000px]">
          <div className="w-40 h-40 logo-3d-wrapper relative flex items-center justify-center">
            {/* Outer glowing ring */}
            <div className="absolute inset-0 rounded-full glow-ring border border-indigo-500/30"></div>
            {/* Inner logo container */}
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-2xl relative z-10">
              <img src="/logo.png" alt="Shivani Technologies Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center mt-4">
          <h1 className="text-xl md:text-3xl font-light text-slate-300 mb-2 tracking-[0.2em] uppercase">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text text-gradient tracking-tight mt-2 pb-2 drop-shadow-sm">
            Shivani Technologies
          </h2>
        </div>
        
        {/* High-tech Loading indicator */}
        <div className="flex gap-3 mt-12 items-center">
          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" style={{ animation: 'progress-left 2s ease-in-out infinite' }}></div>
          </div>
          <span className="text-xs text-indigo-400 tracking-widest uppercase font-semibold">Loading</span>
          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-l from-indigo-500 to-purple-500 w-full" style={{ animation: 'progress-right 2s ease-in-out infinite' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
