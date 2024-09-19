import './assets/styles/App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/LoginPage';
import Dashboard2 from './pages/Dashboard2';
import DashReports from './pages/DashReports';
import { AuthProvider } from './context/AuthContext';
import LogoAnimation from './components/AnimateLogo';

function App() {
  const [showDash, setShowDash] = useState(false);

  const handleAnimationComplete = () => {
    setShowDash(true);
  };

  return (
    <Router>
      <AuthProvider>
        <div>
          {/* Conditionally render the animation or the routes */}
          {!showDash ? (
            <LogoAnimation onAnimationComplete={handleAnimationComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sign-up" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard2 />} />
              <Route path='/dashboard/reports' element={<DashReports />} />
            </Routes>
          )}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
