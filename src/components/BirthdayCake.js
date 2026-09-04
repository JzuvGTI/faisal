'use client';

import React, { useState, useEffect } from 'react';
import styles from './BirthdayCake.module.css';

// Colors for candles matching the website palette
const CANDLE_COLORS = [
  '#E5989B', // Rose Light
  '#B5828C', // Rose Dark
  '#A1BC98', // Sage Light
  '#778873', // Sage Dark
  '#C7E2B2', // Mint Pastel
  '#E8C39E'  // Soft Apricot
];

export default function BirthdayCake({ 
  onAllCandlesBlownOut,
  wishPlaceholder = "Tuliskan harapanmu, lalu usap lilin untuk meniupnya...",
  wishSubmittedHint = "\"Harapanmu telah ditiupkan...\""
}) {
  const [candles, setCandles] = useState([]);
  const [wish, setWish] = useState('');
  const [showInput, setShowInput] = useState(true);

  // Generate 5 candles in a semi-elliptical arc matching the cake top surface
  useEffect(() => {
    const list = [];
    const count = 5;
    const width = 320; // container width
    const height = 320; // container height
    
    // Ellipse parameters for cake top
    const cx = width / 2;
    const cy = height - 160; // middle of the cake image
    const rx = 85; // horizontal radius
    const ry = 18; // vertical radius
    
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + 0.15 + ((i / (count - 1)) * (Math.PI - 0.3));
      
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      
      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 6;
      
      list.push({
        id: i,
        x: x + jitterX,
        y: y + jitterY,
        color: CANDLE_COLORS[i % CANDLE_COLORS.length],
        isLit: true,
        smokeDir: (Math.random() - 0.5) * 30
      });
    }
    
    list.sort((a, b) => a.y - b.y);
    setCandles(list);
  }, []);

  // Handle candle blow out (clicking or hovering)
  const blowCandle = (id) => {
    setCandles(prev => {
      const target = prev.find(c => c.id === id);
      if (target && !target.isLit) return prev; // already blown out
      
      const updated = prev.map(c => c.id === id ? { ...c, isLit: false } : c);
      checkAllBlownOut(updated);
      return updated;
    });
  };

  // Check if all candles are blown out
  const checkAllBlownOut = (currentCandles) => {
    const allOut = currentCandles.every(c => !c.isLit);
    if (allOut && currentCandles.length > 0) {
      setShowInput(false);
      setTimeout(() => {
        if (onAllCandlesBlownOut) onAllCandlesBlownOut(wish);
      }, 600);
    }
  };

  // Handle touch drag across candles for smooth swiping on Android/iOS
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      const candleEl = element.closest('[data-candle-id]');
      if (candleEl) {
        const id = parseInt(candleEl.getAttribute('data-candle-id'), 10);
        if (!isNaN(id)) {
          blowCandle(id);
        }
      }
    }
  };

  return (
    <div className={styles.cakeSection}>
      <div className={styles.cakeContainer}>
        {/* Render cake image */}
        <img 
          src="/assets/cake.gif" 
          alt="Birthday Cake" 
          className={styles.cakeImage} 
        />
        
        {/* Render 5 Candles */}
        <div 
          className={styles.candlesContainer}
          onTouchMove={handleTouchMove}
        >
          {candles.map(candle => (
            <div
              key={candle.id}
              className={styles.candle}
              data-candle-id={candle.id}
              style={{
                left: `${candle.x}px`,
                top: `${candle.y}px`
              }}
              onClick={() => blowCandle(candle.id)}
              onMouseEnter={() => blowCandle(candle.id)}
              onTouchStart={() => blowCandle(candle.id)}
            >
              {candle.isLit ? (
                <>
                  <div className={styles.flame}></div>
                  <div 
                    className={styles.waxStick}
                    style={{ backgroundColor: candle.color }}
                  ></div>
                </>
              ) : (
                <>
                  <div className={styles.smoke} style={{ '--wind-x': `${candle.smokeDir}px` }}></div>
                  <div className={styles.wick}></div>
                  <div 
                    className={styles.waxStick}
                    style={{ backgroundColor: candle.color, height: '18px', opacity: 0.8 }}
                  ></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className={styles.controls}>
        {showInput ? (
          <input
            type="text"
            className={styles.wishInput}
            placeholder={wishPlaceholder}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
          />
        ) : (
          wish && (
            <p className={styles.hint} style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--rose-dark)' }}>
              {wishSubmittedHint}
            </p>
          )
        )}
      </div>
    </div>
  );
}
