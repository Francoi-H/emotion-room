import React from 'react';
import { PARAM_CONFIG } from '../lib/emotionParams.js';
import styles from './ControlsPanel.module.css';

export default function ControlsPanel({ params, onChange }) {
  const handle = (key, value) => {
    onChange({ ...params, [key]: parseFloat(value) });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Parameters</p>
      <div className={styles.sliders}>
        {PARAM_CONFIG.map(({ key, label, min, max, step }) => {
          const val = params?.[key] ?? min;
          const pct = ((val - min) / (max - min)) * 100;
          return (
            <div key={key} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>
                  {typeof val === 'number' ? val.toFixed(step < 1 ? 2 : 0) : val}
                </span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${pct}%` }} />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={e => handle(key, e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Color palette swatches */}
      {params?.colorPalette && (
        <div className={styles.paletteSection}>
          <p className={styles.heading}>Palette</p>
          <div className={styles.swatches}>
            {params.colorPalette.map((hex, i) => (
              <label key={i} className={styles.swatch} title={hex}>
                <span className={styles.swatchDot} style={{ background: hex }} />
                <input
                  type="color"
                  value={hex}
                  className={styles.colorInput}
                  onChange={e => {
                    const next = [...params.colorPalette];
                    next[i] = e.target.value;
                    onChange({ ...params, colorPalette: next });
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
