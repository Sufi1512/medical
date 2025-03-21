import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <AuthForm type="login" />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <AuthForm type="register" />} 
        />
        <Route 
          path="/dashboard"
          element={getDashboard()}
        />
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;