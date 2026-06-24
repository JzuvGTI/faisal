'use client';

import React, { useState, useEffect } from 'react';
import styles from './FallingFlowers.module.css';

export default function FallingFlowers({ isTriggered }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (!isTriggered) return;

    const count = 30;
    const generatedPetals = [];

    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100; // 0% to 100%
      const size = Math.random() * 10 + 8; // 8px to 18px
      const duration = Math.random() * 6 + 6; // 6s to 12s
      const delay = Math.random() * 8; // 0s to 8s
      
      // Determine type of petal
      let petalClass = styles.petal;
      const typeRand = Math.random();
      if (typeRand > 0.6) {
        petalClass = `${styles.petal} ${styles.petalAlt}`;
      } else if (typeRand > 0.3) {
        petalClass = `${styles.petal} ${styles.petalSage}`;
      }

      generatedPetals.push({
        id: i,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 1.2}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        className: petalClass
      });
    }

    setPetals(generatedPetals);
  }, [isTriggered]);

  if (!isTriggered) return null;

  return (
    <div className={styles.container}>
      {petals.map(petal => (
        <div
          key={petal.id}
          className={petal.className}
          style={{
            left: petal.left,
            width: petal.width,
            height: petal.height,
            animationDuration: `${petal.animationDuration}, 3s`,
            animationDelay: `${petal.animationDelay}, 0s`
          }}
        />
      ))}
    </div>
  );
}
