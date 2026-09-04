'use client';

import React, { useState } from 'react';
import styles from './ClotheslineGallery.module.css';

export default function ClotheslineGallery({ 
  isTriggered,
  clotheslineData = {} 
}) {
  const [activeItem, setActiveItem] = useState(null);

  const enabled = clotheslineData.enabled !== false;
  if (!isTriggered || !enabled) return null;

  const title = clotheslineData.title || 'Jemuran Kenangan Dahayu 🧸🎀';
  const items = Array.isArray(clotheslineData.items) && clotheslineData.items.length > 0 
    ? clotheslineData.items 
    : [
        {
          id: 1,
          type: 'image',
          src: '/assets/R652026121319_raw8.jpeg',
          title: 'Memories 🌟',
          description: 'Setiap kenangan bersamamu adalah berkas cahaya manis yang selalu menghangatkan hari-hari.'
        }
      ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      
      <div className={styles.clotheslineWrapper}>
        {/* Curving rope SVG line */}
        <svg className={styles.ropeSvg} viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M 0 5 Q 50 20, 100 5" fill="none" stroke="#778873" strokeWidth="0.8" />
          <path d="M 0 5 Q 50 20, 100 5" fill="none" stroke="#FAF7F2" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
        </svg>

        {/* Clothespins & Polaroid Cards */}
        <div className={styles.cardsContainer}>
          {items.map((item, idx) => {
            const delay = `${idx * 0.3}s`;
            const isGif = item.type === 'gif';
            
            return (
              <div 
                key={item.id || idx}
                className={`${styles.polaroidCard} ${isGif ? styles.gifCard : ''}`}
                style={{ 
                  '--delay': delay,
                  // Vary rotation angle slightly for natural hanging effect
                  transform: `rotate(${((idx % 5) - 2) * 2.5}deg)`
                }}
                onClick={() => setActiveItem(item)}
              >
                {/* Wooden clip hanging the card */}
                <div className={styles.clothespin}></div>
                
                {/* Image display */}
                <div className={`${styles.photoArea} ${isGif ? styles.gifPhotoArea : ''}`}>
                  <img 
                    src={item.src} 
                    alt={item.title || `Foto ${idx + 1}`} 
                    className={styles.photo} 
                  />
                </div>
                
                {/* Handwritten title */}
                <div className={styles.caption}>
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal Popup */}
      {activeItem && (
        <div className={styles.modalOverlay} onClick={() => setActiveItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeBtn} 
              onClick={() => setActiveItem(null)}
            >
              ✕
            </button>
            <img 
              src={activeItem.src} 
              alt={activeItem.title} 
              className={`${styles.modalPhoto} ${activeItem.type === 'gif' ? styles.modalGif : ''}`} 
            />
            <h3 className={styles.modalCaption}>{activeItem.title}</h3>
            <p className={styles.modalText}>{activeItem.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
