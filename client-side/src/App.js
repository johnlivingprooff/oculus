import './assets/styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Dashboard2 from './pages/Dashboard2'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-two" element={<Dashboard2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
