import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import EnergyTrackingSelection from './components/EnergyTrackingSelection';
import DailyTracker from './components/DailyTracker';
import MonthlyTracker from './components/MonthlyTracker';
import WeeklyTracker from './components/WeeklyTracker';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfServices';
import ContactUs from './components/ContactUs';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/tracking-selection" element={<EnergyTrackingSelection />} />
          <Route path="/daily-tracker" element={<DailyTracker />} />
          <Route path="/weekly-tracker" element={<WeeklyTracker />} />
          <Route path="/monthly-tracker" element={<MonthlyTracker />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/term-service" element={<TermsOfService />} />
          <Route path="/contact-us" element={<ContactUs />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
