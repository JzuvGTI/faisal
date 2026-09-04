'use client';

import React from 'react';
import styles from './HangingBanner.module.css';

const PALETTE = [
  '#E5989B', // Rose Light
  '#778873', // Sage Dark
  '#B5828C', // Rose Dark
  '#A1BC98'  // Sage Light
];

export default function HangingBanner({ 
  textRow1 = 'HAPPY', 
  textRow2 = 'BIRTHDAY' 
}) {
  const row1 = (textRow1 || 'HAPPY').toUpperCase().replace(/[^A-Z0-9!?-]/g, '').split('');
  const row2 = (textRow2 || 'BIRTHDAY').toUpperCase().replace(/[^A-Z0-9!?-]/g, '').split('');

  // Vector ribbon bow SVG
  const renderBow = () => (
    <svg viewBox="0 0 30 30" fill="none">
      {/* Left loop of bow */}
      <path d="M15 15 C8 8, 3 10, 5 15 C7 20, 12 17, 15 15" fill="var(--rose-light)" stroke="var(--rose-dark)" strokeWidth="1" />
      {/* Right loop of bow */}
      <path d="M15 15 C22 8, 27 10, 25 15 C23 20, 18 17, 15 15" fill="var(--rose-light)" stroke="var(--rose-dark)" strokeWidth="1" />
      {/* Left tail */}
      <path d="M15 15 Q8 22, 10 27" stroke="var(--rose-dark)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right tail */}
      <path d="M15 15 Q22 22, 20 27" stroke="var(--rose-dark)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center knot */}
      <circle cx="15" cy="15" r="3.5" fill="var(--rose-dark)" />
    </svg>
  );

  const renderRow = (letters, isRow1) => {
    if (!letters || letters.length === 0) return null;

    return (
      <div className={styles.flagsContainer}>
        {/* Wavy hanging rope string */}
        <svg className={styles.stringSvg} viewBox="0 0 100 20" preserveAspectRatio="none">
          {/* Main rope thread */}
          <path d="M 0 5 Q 50 17, 100 5" fill="none" stroke="#778873" strokeWidth="0.8" />
          {/* Decorative dashed highlight to look like twisted rope */}
          <path d="M 0 5 Q 50 17, 100 5" fill="none" stroke="#FAF7F2" strokeWidth="0.4" strokeDasharray="1 1.5" />
        </svg>

        {/* Ribbons Bows at the left & right hanging anchors */}
        <div className={styles.bowLeft}>{renderBow()}</div>
        <div className={styles.bowRight}>{renderBow()}</div>

        {letters.map((char, index) => {
          // Determine color based on index
          const colorIdx = (index + (isRow1 ? 0 : 2)) % PALETTE.length;
          const color = PALETTE[colorIdx];
          
          // Animation delay offset to create a wave-like sway
          const delay = `${index * 0.15 + (isRow1 ? 0 : 0.3)}s`;
          
          // Calculate parabolic vertical sag factor (max sag in the center)
          const t = (index + 0.5) / letters.length;
          const factor = 4 * t * (1 - t);
          const sagDesktop = `${factor * 16}px`;
          const sagMobile = `${factor * 10}px`;
          
          return (
            <div 
              key={index} 
              className={styles.flag}
              style={{ 
                '--delay': delay,
                '--sag-desktop': sagDesktop,
                '--sag-mobile': sagMobile
              }}
            >
              {/* Swallowtail pennant SVG ribbon flag */}
              <svg className={styles.flagSvg} viewBox="0 0 46 64" preserveAspectRatio="none">
                {/* Outer flag shape */}
                <polygon points="0,0 46,0 46,64 23,50 0,64" fill={color} />
                {/* Inside dashed border hem */}
                <polygon points="3,2 43,2 43,59 23,46 3,59" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="1.5 1" />
                {/* Top hanging pins/knots */}
                <circle cx="6" cy="3" r="2.5" fill="rgba(0,0,0,0.15)" />
                <circle cx="40" cy="3" r="2.5" fill="rgba(0,0,0,0.15)" />
              </svg>
              <span className={styles.letter}>{char}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.bannerSection}>
      {row1.length > 0 && (
        <div className={`${styles.row} ${styles.row1}`}>
          {renderRow(row1, true)}
        </div>
      )}
      {row2.length > 0 && (
        <div className={`${styles.row} ${styles.row2}`}>
          {renderRow(row2, false)}
        </div>
      )}
    </div>
  );
}
