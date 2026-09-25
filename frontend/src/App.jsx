import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
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

