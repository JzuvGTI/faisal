'use client';

import React, { useState } from 'react';
import styles from './ClotheslineGallery.module.css';

const ITEMS = [
  {
    id: 1,
    type: 'image',
    src: '/assets/R652026121319_raw8.jpeg',
    title: 'Memories 🌟',
    description: 'Setiap kenangan bersamamu adalah berkas cahaya manis yang selalu menghangatkan hari-hari.'
  },
  {
    id: 2,
    type: 'image',
    src: '/assets/R652026121319_raw6.jpeg',
    title: 'Keep Shining ✨',
    description: 'Semoga di usia yang baru ini, binar matamu tetap penuh semangat untuk mengejar segala cita-citamu.'
  },
  {
    id: 3,
    type: 'gif',
    src: '/assets/G652026121318.gif',
    title: 'Dahayu Day! 💖',
    description: 'Hari yang sangat spesial untuk seseorang yang luar biasa manis! Selamat ulang tahun yang ke-20!'
  },
  {
    id: 4,
    type: 'image',
    src: '/assets/R65202612049_picked1.jpeg',
    title: 'Sweet Smile 😊',
    description: 'Senyuman dan tawa ceriamu adalah dekorasi terindah yang selalu membawa kedamaian.'
  },
  {
    id: 5,
    type: 'image',
    src: '/assets/R652026121320_picked1.jpeg',
    title: 'Cheer Up! 🎈',
    description: 'Teruslah tumbuh menjadi versi terbaik dirimu dengan penuh cinta, sukacita, dan kedamaian.'
  }
];

export default function ClotheslineGallery({ isTriggered }) {
  const [activeItem, setActiveItem] = useState(null);

  if (!isTriggered) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Jemuran Kenangan Dahayu 🧸🎀</h2>
      
      <div className={styles.clotheslineWrapper}>
        {/* Curving rope SVG line */}
        <svg className={styles.ropeSvg} viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M 0 5 Q 50 20, 100 5" fill="none" stroke="#778873" strokeWidth="0.8" />
          <path d="M 0 5 Q 50 20, 100 5" fill="none" stroke="#FAF7F2" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
        </svg>

        {/* Clothespins & Polaroid Cards */}
        <div className={styles.cardsContainer}>
          {ITEMS.map((item, idx) => {
            const delay = `${idx * 0.3}s`;
            const isGif = item.type === 'gif';
            
            return (
              <div 
                key={item.id}
                className={`${styles.polaroidCard} ${isGif ? styles.gifCard : ''}`}
                style={{ 
                  '--delay': delay,
                  // Vary rotation angle slightly for hanging effect
                  transform: `rotate(${(idx - 2) * 2.5}deg)`
                }}
                onClick={() => setActiveItem(item)}
              >
                {/* Wooden clip hanging the card */}
                <div className={styles.clothespin}></div>
                
                {/* Image display */}
                <div className={`${styles.photoArea} ${isGif ? styles.gifPhotoArea : ''}`}>
                  <img 
                    src={item.src} 
                    alt={item.title} 
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
