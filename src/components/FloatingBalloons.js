'use client';

import React, { useState, useEffect } from 'react';
import styles from './FloatingBalloons.module.css';

const BALLOON_COLORS = [
  '#E5989B', // Rose Light
  '#B5828C', // Rose Dark
  '#A1BC98', // Sage Light
  '#778873', // Sage Dark
  '#E8C39E'  // Soft Apricot
];

export default function FloatingBalloons() {
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const count = 15;
    const generated = [];

    for (let i = 0; i < count; i++) {
      const left = Math.random() * 90; // 0% to 90%
      const scale = Math.random() * 0.4 + 0.8; // scale between 0.8 and 1.2
      const duration = Math.random() * 6 + 12; // 12s to 18s
      const delay = Math.random() * 12; // 0s to 12s
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length];

      generated.push({
        id: i,
        left: `${left}%`,
        scale,
        duration: `${duration}s`,
        delay: `${delay}s`,
        color
      });
    }

    setBalloons(generated);
  }, []);

  return (
    <div className={styles.container}>
      {balloons.map(b => (
        <div
          key={b.id}
          className={styles.balloonContainer}
          style={{
            left: b.left,
            animationDuration: b.duration,
            animationDelay: b.delay,
            transform: `scale(${b.scale})`
          }}
        >
          <div className={styles.balloon}>
            {/* Dynamic Vector Balloon SVG with 3D Glossy Highlight & Swaying String */}
            <svg width="50" height="120" viewBox="0 0 50 120" fill="none">
              {/* Balloon Body */}
              <path 
                d="M25 5 C13 5, 5 15, 5 30 C5 42, 17 50, 25 50 C33 50, 45 42, 45 30 C45 15, 37 5, 25 5 Z" 
                fill={b.color} 
              />
              {/* Glossy Highlight */}
              <ellipse 
                cx="16" 
                cy="18" 
                rx="4" 
                ry="7" 
                fill="rgba(255,255,255,0.3)" 
                transform="rotate(-15 16 18)" 
              />
              {/* Tie Knot */}
              <polygon points="21,50 29,50 25,56" fill={b.color} />
              
              {/* Wiggling String */}
              <path 
                className={styles.string} 
                d="M25 56 Q18 75, 25 92 T25 120" 
                stroke="rgba(119, 136, 115, 0.45)" 
                strokeWidth="1.5" 
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
