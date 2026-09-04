'use client';

import React, { useState } from 'react';
import styles from './FlowerGift.module.css';

export default function FlowerGift({ 
  isTriggered,
  flowerData = {}
}) {
  const [isOpen, setIsOpen] = useState(false);

  const enabled = flowerData.enabled !== false;
  if (!isTriggered || !enabled) return null;

  const giftCardTitle = flowerData.giftCardTitle || "Kado Spesial untuk Nadin";
  const giftCardSubtitle = flowerData.giftCardSubtitle || "Ketuk kado ini untuk membukanya...";
  const bouquetImageSrc = flowerData.bouquetImageSrc || "/assets/Isal4.png";
  const bouquetTitle = flowerData.bouquetTitle || "Buket Bunga Terindah untuk Nadin🌸✨";
  const bouquetText = flowerData.bouquetText || "Buket bunga mawar merah muda lembut melambangkan keanggunan, kebaikan hatimu yang tulus, serta kasih sayang yang mengelilingimu.\n\nTulip putih melambangkan kemurnian harapan baru dan doa tulus di usiamu yang ke-20 tahun ini. Semoga hari-harimu seindah mekarnya bunga-bunga ini!";

  return (
    <div className={styles.giftSection}>
      {!isOpen ? (
        <div className={styles.giftCard} onClick={() => setIsOpen(true)}>
          <div className={styles.giftIcon}>🎁💐</div>
          <h3 className={styles.giftTitle}>{giftCardTitle}</h3>
          <p className={styles.giftSubtitle}>{giftCardSubtitle}</p>
        </div>
      ) : (
        <div className={styles.giftCard} style={{ cursor: 'default' }}>
          <div className={styles.bouquetContainer}>
            <img 
              src={bouquetImageSrc} 
              alt={bouquetTitle} 
              className={styles.bouquetImage}
            />
            <div className={styles.bouquetInfo}>
              <h3 className={styles.bouquetTitle}>{bouquetTitle}</h3>
              <p className={styles.bouquetText}>
                {bouquetText.split('\n\n').map((paragraph, i) => (
                  <React.Fragment key={i}>
                    {paragraph}
                    {i < bouquetText.split('\n\n').length - 1 && (
                      <>
                        <br /><br />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
