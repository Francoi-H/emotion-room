import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SharedScene from './pages/SharedScene.jsx';

export default function App() {
  return (
    <AuthProvider>
      {/* Navbar sits above everything except the full-screen Home canvas */}
      <Navbar />

      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/scene/:id"   element={<SharedScene />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 */}
        <Route path="*" element={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            paddingTop: '52px',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>
              404 · PAGE NOT FOUND
            </p>
            <a href="/" style={{ color: 'var(--accent)', fontSize: '13px' }}>← Back to home</a>
          </div>
        } />
      </Routes>
    </AuthProvider>
  );
}
