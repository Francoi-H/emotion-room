import React, { useEffect, useState } from 'react';
import { listEnvironments, deleteEnvironment } from '../api/client.js';
import styles from './SavedScenes.module.css';

export default function SavedScenes({ onLoad, refreshTrigger }) {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const fetchScenes = async () => {
    setLoading(true);
    try {
      const { environments } = await listEnvironments();
      setScenes(environments);
    } catch {
      setScenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScenes(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this scene?')) return;
    await deleteEnvironment(id);
    setScenes(prev => prev.filter(s => s.id !== id));
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/scene/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (loading) {
    return <p className={styles.empty}>Loading scenes…</p>;
  }

  if (scenes.length === 0) {
    return <p className={styles.empty}>No saved scenes yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {scenes.map(scene => (
        <li key={scene.id} className={styles.item}>
          <div className={styles.info}>
            <span className={styles.name}>{scene.name}</span>
            <span className={styles.tag}>{scene.emotion}</span>
            {scene.is_public && <span className={styles.pub}>public</span>}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.btn}
              onClick={() => onLoad(scene)}
              title="Load"
            >
              Load
            </button>
            <button
              className={`${styles.btn} ${styles.share}`}
              onClick={() => handleShare(scene.id)}
              title="Copy share link"
            >
              {copied === scene.id ? 'Copied!' : 'Share'}
            </button>
            <button
              className={`${styles.btn} ${styles.danger}`}
              onClick={() => handleDelete(scene.id)}
              title="Delete"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
