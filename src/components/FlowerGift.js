'use client';

import React, { useState } from 'react';
import styles from './FlowerGift.module.css';

export default function FlowerGift({ isTriggered }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isTriggered) return null;

  return (
    <div className={styles.giftSection}>
      {!isOpen ? (
        <div className={styles.giftCard} onClick={() => setIsOpen(true)}>
          <div className={styles.giftIcon}>🎁💐</div>
          <h3 className={styles.giftTitle}>Kado Spesial untuk Dahayu</h3>
          <p className={styles.giftSubtitle}>Ketuk kado ini untuk membukanya...</p>
        </div>
      ) : (
        <div className={styles.giftCard} style={{ cursor: 'default' }}>
          <div className={styles.bouquetContainer}>
            <img 
              src="/assets/flower_bouquet.jpg" 
              alt="Buket Bunga Cantik" 
              className={styles.bouquetImage}
            />
            <div className={styles.bouquetInfo}>
              <h3 className={styles.bouquetTitle}>Buket Bunga Terindah untuk Dahayu 🌸✨</h3>
              <p className={styles.bouquetText}>
                Buket bunga mawar merah muda lembut melambangkan keanggunan, kebaikan hatimu yang tulus, serta kasih sayang yang mengelilingimu.
                <br /><br />
                Tulip putih melambangkan kemurnian harapan baru dan doa tulus di usiamu yang ke-20 tahun ini. Semoga hari-harimu seindah mekarnya bunga-bunga ini!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
