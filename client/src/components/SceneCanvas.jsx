import React, { useEffect, useRef, useCallback } from 'react';
import { EmotionScene } from '../lib/EmotionScene.js';
import styles from './SceneCanvas.module.css';

export default function SceneCanvas({ params, onSceneReady }) {
  const canvasRef = useRef(null);
  const sceneRef  = useRef(null);

  // Boot the renderer once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new EmotionScene(canvas);
    sceneRef.current = scene;
    onSceneReady?.(scene);

    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        scene.resize(width, height);
      }
    });
    ro.observe(canvas.parentElement);

    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Push param updates into the scene without remounting
  useEffect(() => {
    if (sceneRef.current && params) {
      sceneRef.current.applyParams(params);
    }
  }, [params]);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
