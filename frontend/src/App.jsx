import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './components/ResetPassword';

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
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
