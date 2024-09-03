import './assets/styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/LoginPage';
import Dashboard2 from './pages/Dashboard2';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider from AuthContext

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the app with AuthProvider */}
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard2 />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
