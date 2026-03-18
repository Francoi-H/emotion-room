import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '0.1em',
      }}>
        Loading…
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
