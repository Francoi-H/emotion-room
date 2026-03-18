import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SceneCanvas from '../components/SceneCanvas.jsx';
import { getEnvironment } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './SharedScene.module.css';

export default function SharedScene() {
  const { id } = useParams();
  const { user } = useAuth();
  const [scene, setScene] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnvironment(id)
      .then(({ environment }) => setScene(environment))
      .catch(err => setError(err.response?.data?.error ?? 'Failed to load scene'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.center}>
        <p className={styles.msg}>Loading scene…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.err}>{error}</p>
        <Link to="/" className={styles.back}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <SceneCanvas params={scene.parameters_json} />

      {/* Info overlay */}
      <div className={styles.overlay}>
        <div className={styles.info}>
          <span className={styles.emotion}>{scene.emotion}</span>
          <span className={styles.name}>{scene.name}</span>
          <span className={styles.owner}>by {scene.owner_email}</span>
        </div>

        <div className={styles.actions}>
          {user ? (
            <Link to="/dashboard" className={styles.btn}>My Dashboard →</Link>
          ) : (
            <Link to="/register" className={styles.btn}>Create your own →</Link>
          )}
        </div>
      </div>
    </div>
  );
}
