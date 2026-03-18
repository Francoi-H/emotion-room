import React, { useState } from 'react';
import styles from './SaveModal.module.css';

export default function SaveModal({ onSave, onClose, isSaving }) {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim() || 'Untitled Scene', isPublic });
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Save Scene</h2>
        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label}>
            <span>Scene name</span>
            <input
              type="text"
              className={styles.input}
              placeholder="Untitled Scene"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              autoFocus
            />
          </label>
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className={styles.checkbox}
            />
            <span>Make scene public (shareable link)</span>
          </label>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
