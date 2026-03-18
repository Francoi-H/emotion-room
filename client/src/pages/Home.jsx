import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SceneCanvas from '../components/SceneCanvas.jsx';
import { EMOTION_DEFAULTS, EMOTIONS, EMOTION_META } from '../lib/emotionParams.js';
import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const [activeEmotion, setActiveEmotion] = useState('wonder');
  const [params, setParams] = useState(EMOTION_DEFAULTS.wonder);

  const switchEmotion = useCallback((emotion) => {
    setActiveEmotion(emotion);
    setParams(EMOTION_DEFAULTS[emotion]);
  }, []);

  return (
    <div className={styles.root}>
      {/* Full-screen canvas behind everything */}
      <div className={styles.canvasBg}>
        <SceneCanvas params={params} />
      </div>

      {/* Overlay content */}
      <div className={styles.overlay}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.badge}>WebGL · Procedural · Real-time</div>
          <h1 className={styles.headline}>
            Enter the<br />
            <span className={styles.accent}>Emotion Room</span>
          </h1>
          <p className={styles.sub}>
            Select a mood. Watch a living visual environment emerge around it.
          </p>
          <div className={styles.cta}>
            {user ? (
              <Link to="/dashboard" className={styles.primaryBtn}>
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className={styles.primaryBtn}>
                  Get started free
                </Link>
                <Link to="/login" className={styles.ghostBtn}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Emotion picker strip */}
        <div className={styles.strip}>
          {EMOTIONS.map(e => (
            <button
              key={e}
              className={`${styles.pill} ${activeEmotion === e ? styles.pillActive : ''}`}
              onClick={() => switchEmotion(e)}
            >
              {EMOTION_META[e].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
