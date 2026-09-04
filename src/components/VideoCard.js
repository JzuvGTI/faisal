'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './VideoCard.module.css';

export default function VideoCard({ 
  isTriggered, 
  mediaData = {},
  onVideoPlay, 
  onVideoPause 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);
  const videoRef = useRef(null);

  const enabled = mediaData.enabled !== false;
  const mediaType = mediaData.type || 'video'; // 'video' | 'image'
  const videoSrc = mediaData.src || '/assets/video-kita.mp4';
  const imageSrc = mediaData.imageSrc || mediaData.src || '/assets/R652026121319_raw8.jpeg';
  const caption = mediaData.caption || 'Momen Spesial Kita Bersama 💕';

  // Auto spawn hearts on hover
  const handleMouseEnter = () => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        spawnHeart();
      }, i * 150);
    }
  };

  const spawnHeart = () => {
    const id = Date.now() + Math.random();
    const left = Math.random() * 80 + 10;
    const size = Math.random() * 18 + 12; // 12px to 30px
    const rot = (Math.random() - 0.5) * 70;
    const isAlt = Math.random() > 0.5;

    setHearts(prev => [
      ...prev.slice(-25),
      { id, left: `${left}%`, size, rot: `${rot}deg`, isAlt }
    ]);
  };

  useEffect(() => {
    let interval;
    if (isPlaying || mediaType === 'image') {
      interval = setInterval(() => {
        spawnHeart();
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mediaType]);

  if (!isTriggered || !enabled) return null;

  return (
    <section className={styles.section}>
      <div 
        className={styles.cardContainer}
        onMouseEnter={handleMouseEnter}
      >
        {/* Ambient Elegant Sparkles Twinkling Around */}
        <svg className={`${styles.sparkle} ${styles.sparkle1}`} viewBox="0 0 20 20">
          <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" />
        </svg>
        <svg className={`${styles.sparkle} ${styles.sparkle2}`} viewBox="0 0 20 20">
          <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" />
        </svg>
        <svg className={`${styles.sparkle} ${styles.sparkle3}`} viewBox="0 0 20 20">
          <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" />
        </svg>
        <svg className={`${styles.sparkle} ${styles.sparkle4}`} viewBox="0 0 20 20">
          <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" />
        </svg>

        {/* Detailed Left Flower & Leaf Vine */}
        <svg className={styles.flowerLeft} viewBox="0 0 120 220" fill="none">
          <defs>
            <linearGradient id="roseGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5989B" />
              <stop offset="70%" stopColor="#B5828C" />
              <stop offset="100%" stopColor="#96616b" />
            </linearGradient>
            <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7E2B2" />
              <stop offset="100%" stopColor="#778873" />
            </linearGradient>
          </defs>

          <path 
            d="M90 200 C60 170, 45 120, 60 70 C65 50, 50 25, 45 15" 
            stroke="#778873" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path d="M60 135 C35 125, 25 105, 30 90" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 85 C80 75, 90 55, 82 45" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 165 C85 160, 95 145, 90 130" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M30 90 C15 80, 10 65, 28 75 C40 82, 35 92, 30 90" fill="url(#leafGradLeft)" />
          <path d="M30 90 Q22 80, 20 72" stroke="#FAF7F2" strokeWidth="1" />
          
          <path d="M82 45 C95 35, 92 18, 77 30 C68 38, 74 46, 82 45" fill="url(#leafGradLeft)" />
          <path d="M82 45 Q85 36, 83 25" stroke="#FAF7F2" strokeWidth="1" />

          <path d="M90 130 C105 120, 100 105, 85 115 C78 120, 82 128, 90 130" fill="url(#leafGradLeft)" />
          <path d="M90 130 Q94 121, 91 111" stroke="#FAF7F2" strokeWidth="1" />

          <g transform="translate(48, 48)">
            <circle cx="0" cy="0" r="16" fill="url(#roseGradLeft)" />
            <path d="M-8 -8 C-12 -2, -6 12, 8 8 C12 0, 4 -12, -8 -8 Z" fill="#E5989B" opacity="0.85" />
            <path d="M-4 -4 C-6 0, -2 6, 4 4 C6 0, 2 -6, -4 -4 Z" fill="#B5828C" />
            <circle cx="0" cy="0" r="3" fill="#E5989B" />
          </g>

          <g transform="translate(68, 140)">
            <ellipse cx="0" cy="0" rx="10" ry="12" fill="url(#roseGradLeft)" />
            <path d="M-6 -6 Q0 -15, 6 -6" fill="none" stroke="#778873" strokeWidth="2.5" />
            <path d="M-8 2 Q-12 12, -5 8" fill="url(#leafGradLeft)" />
          </g>

          <circle cx="20" cy="115" r="3.5" fill="#FAF7F2" stroke="#E5989B" strokeWidth="1" />
          <circle cx="95" cy="75" r="3.5" fill="#FAF7F2" stroke="#E5989B" strokeWidth="1" />
        </svg>

        {/* Detailed Right Flower & Leaf Vine */}
        <svg className={styles.flowerRight} viewBox="0 0 120 220" fill="none">
          <defs>
            <linearGradient id="roseGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5989B" />
              <stop offset="70%" stopColor="#B5828C" />
              <stop offset="100%" stopColor="#96616b" />
            </linearGradient>
            <linearGradient id="leafGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7E2B2" />
              <stop offset="100%" stopColor="#778873" />
            </linearGradient>
          </defs>

          <path 
            d="M30 200 C60 170, 75 120, 60 70 C55 50, 70 25, 75 15" 
            stroke="#778873" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path d="M60 135 C85 125, 95 105, 90 90" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 85 C40 75, 30 55, 38 45" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 165 C35 160, 25 145, 30 130" stroke="#778873" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M90 90 C105 80, 110 65, 92 75 C80 82, 85 92, 90 90" fill="url(#leafGradRight)" />
          <path d="M90 90 Q98 80, 100 72" stroke="#FAF7F2" strokeWidth="1" />
          
          <path d="M38 45 C25 35, 28 18, 43 30 C52 38, 46 46, 38 45" fill="url(#leafGradRight)" />
          <path d="M38 45 Q35 36, 37 25" stroke="#FAF7F2" strokeWidth="1" />

          <path d="M30 130 C15 120, 20 105, 35 115 C42 120, 38 128, 30 130" fill="url(#leafGradRight)" />
          <path d="M30 130 Q26 121, 29 111" stroke="#FAF7F2" strokeWidth="1" />

          <g transform="translate(72, 48)">
            <circle cx="0" cy="0" r="16" fill="url(#roseGradRight)" />
            <path d="M-8 -8 C-12 -2, -6 12, 8 8 C12 0, 4 -12, -8 -8 Z" fill="#E5989B" opacity="0.85" />
            <path d="M-4 -4 C-6 0, -2 6, 4 4 C6 0, 2 -6, -4 -4 Z" fill="#B5828C" />
            <circle cx="0" cy="0" r="3" fill="#E5989B" />
          </g>

          <g transform="translate(52, 140)">
            <ellipse cx="0" cy="0" rx="10" ry="12" fill="url(#roseGradRight)" />
            <path d="M-6 -6 Q0 -15, 6 -6" fill="none" stroke="#778873" strokeWidth="2.5" />
            <path d="M8 2 Q12 12, 5 8" fill="url(#leafGradRight)" />
          </g>

          <circle cx="100" cy="115" r="3.5" fill="#FAF7F2" stroke="#E5989B" strokeWidth="1" />
          <circle cx="25" cy="75" r="3.5" fill="#FAF7F2" stroke="#E5989B" strokeWidth="1" />
        </svg>

        {/* Dangling Ornaments Bottom Left */}
        <svg className={styles.hangingLeft} viewBox="0 0 40 80">
          <line x1="20" y1="0" x2="20" y2="50" stroke="#778873" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M15 15 Q20 22, 25 15" stroke="#E5989B" strokeWidth="2.5" fill="none" />
          <g transform="translate(20, 58) scale(0.65)">
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="var(--rose-light)" 
              stroke="#B5828C"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Dangling Ornaments Bottom Right */}
        <svg className={styles.hangingRight} viewBox="0 0 40 80">
          <line x1="20" y1="0" x2="20" y2="55" stroke="#778873" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M15 18 Q20 25, 25 18" stroke="#E5989B" strokeWidth="2.5" fill="none" />
          <g transform="translate(20, 63) scale(0.65)">
            <path 
              d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" 
              fill="#E8C39E" 
              stroke="#B5828C"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* 16:9 Media Player Wrapper (Supports Video OR Image) */}
        <div className={styles.videoWrapper}>
          {mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className={styles.videoElement}
              controls
              playsInline
              loop
              onPlay={() => {
                setIsPlaying(true);
                if (onVideoPlay) onVideoPlay();
              }}
              onPause={() => {
                setIsPlaying(false);
                if (onVideoPause) onVideoPause();
              }}
              onEnded={() => {
                setIsPlaying(false);
                if (onVideoPause) onVideoPause();
              }}
            />
          ) : (
            <img 
              src={imageSrc} 
              alt={caption} 
              className={styles.videoElement} 
              style={{ objectFit: 'cover' }}
            />
          )}

          {/* Floating Vector Hearts */}
          <div className={styles.heartsContainer}>
            {hearts.map(heart => (
              <svg
                key={heart.id}
                className={`${styles.heart} ${heart.isAlt ? styles.heartAlt : ''}`}
                style={{
                  left: heart.left,
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                  '--rot': heart.rot
                }}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>
        </div>

        {caption && (
          <p style={{
            fontFamily: 'Fredoka, sans-serif',
            textAlign: 'center',
            color: 'var(--rose-dark)',
            fontSize: '15px',
            marginTop: '12px',
            marginBottom: '0',
            fontWeight: '600'
          }}>
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
