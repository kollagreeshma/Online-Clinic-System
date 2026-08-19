import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/common/Chatbot';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import AppointmentHistory from './pages/patient/AppointmentHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Doctor Protected Routes */}
              <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />

              {/* Patient Protected Routes */}
              <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } />

              <Route path="/patient/search" element={
                <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                  <SearchDoctors />
                </ProtectedRoute>
              } />

              <Route path="/patient/appointments" element={
                <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                  <AppointmentHistory />
                </ProtectedRoute>
              } />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
