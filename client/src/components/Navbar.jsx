import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark}>◎</span>
        <span>Emotion Room</span>
      </Link>
      <div className={styles.right}>
        {user ? (
          <>
            <Link to="/dashboard" className={styles.link}>Dashboard</Link>
            <span className={styles.email}>{user.email}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Sign in</Link>
            <Link to="/register" className={styles.ctaBtn}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
