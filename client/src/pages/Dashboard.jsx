import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SceneCanvas from '../components/SceneCanvas.jsx';
import EmotionSelector from '../components/EmotionSelector.jsx';
import ControlsPanel from '../components/ControlsPanel.jsx';
import SavedScenes from '../components/SavedScenes.jsx';
import SaveModal from '../components/SaveModal.jsx';
import { EMOTION_DEFAULTS } from '../lib/emotionParams.js';
import { saveEnvironment } from '../api/client.js';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [emotion, setEmotion] = useState('wonder');
  const [params, setParams] = useState(EMOTION_DEFAULTS.wonder);
  const [panel, setPanel] = useState('controls'); // 'controls' | 'saved'
  const [showSave, setShowSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!user) {
    navigate('/login');
    return null;
  }

  // ── Emotion switch ─────────────────────────────────────────────────────────
  const handleEmotionChange = useCallback((newEmotion) => {
    setEmotion(newEmotion);
    setParams(EMOTION_DEFAULTS[newEmotion]);
  }, []);

  // ── Save flow ──────────────────────────────────────────────────────────────
  const handleSave = async ({ name, isPublic }) => {
    setIsSaving(true);
    try {
      await saveEnvironment({ name, emotion, parameters: params, isPublic });
      setShowSave(false);
      setRefreshTrigger(n => n + 1);
      setSaveMsg('Scene saved ✓');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Save failed – ' + (err.response?.data?.error ?? 'unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // ── Load a saved scene ─────────────────────────────────────────────────────
  const handleLoad = useCallback((scene) => {
    setEmotion(scene.emotion);
    setParams(scene.parameters_json);
    setPanel('controls');
  }, []);

  // ── Reset to emotion defaults ──────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setParams(EMOTION_DEFAULTS[emotion]);
  }, [emotion]);

  return (
    <div className={styles.root}>
      {/* ── 3-column layout: sidebar | canvas | sidebar ── */}

      {/* Left: emotion + controls */}
      <aside className={styles.left}>
        <div className={styles.sideHeader}>
          <button
            className={`${styles.tab} ${panel === 'controls' ? styles.tabActive : ''}`}
            onClick={() => setPanel('controls')}
          >
            Controls
          </button>
          <button
            className={`${styles.tab} ${panel === 'saved' ? styles.tabActive : ''}`}
            onClick={() => setPanel('saved')}
          >
            Saved
          </button>
        </div>

        <div className={styles.sideBody}>
          {panel === 'controls' ? (
            <>
              <section className={styles.section}>
                <p className={styles.sectionLabel}>Emotion</p>
                <EmotionSelector selected={emotion} onChange={handleEmotionChange} />
              </section>
              <section className={styles.section}>
                <ControlsPanel params={params} onChange={setParams} />
              </section>
            </>
          ) : (
            <section className={styles.section}>
              <SavedScenes onLoad={handleLoad} refreshTrigger={refreshTrigger} />
            </section>
          )}
        </div>

        <div className={styles.sideFooter}>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset to defaults
          </button>
          <button className={styles.saveBtn} onClick={() => setShowSave(true)}>
            Save scene
          </button>
        </div>
      </aside>

      {/* Centre: WebGL canvas */}
      <main className={styles.canvas}>
        <SceneCanvas params={params} />

        {/* HUD overlay */}
        <div className={styles.hud}>
          <div className={styles.hudEmotion}>{emotion}</div>
          {saveMsg && <div className={styles.hudMsg}>{saveMsg}</div>}
        </div>
      </main>

      {/* Save modal */}
      {showSave && (
        <SaveModal
          onSave={handleSave}
          onClose={() => setShowSave(false)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
