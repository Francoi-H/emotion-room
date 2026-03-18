import React from 'react';
import { EMOTIONS, EMOTION_META } from '../lib/emotionParams.js';
import styles from './EmotionSelector.module.css';

export default function EmotionSelector({ selected, onChange }) {
  return (
    <div className={styles.grid}>
      {EMOTIONS.map(emotion => {
        const meta = EMOTION_META[emotion];
        const active = selected === emotion;
        return (
          <button
            key={emotion}
            className={`${styles.tile} ${active ? styles.active : ''}`}
            onClick={() => onChange(emotion)}
            title={meta.description}
          >
            <span className={styles.icon}>{meta.icon}</span>
            <span className={styles.label}>{meta.label}</span>
            <span className={styles.desc}>{meta.description}</span>
          </button>
        );
      })}
    </div>
  );
}
