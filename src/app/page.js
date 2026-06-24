'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HangingBanner from '../components/HangingBanner';
import BirthdayCake from '../components/BirthdayCake';
import PaperLetter from '../components/PaperLetter';
import FlowerGift from '../components/FlowerGift';
import VideoCard from '../components/VideoCard';
import ClotheslineGallery from '../components/ClotheslineGallery';
import MusicPlayer from '../components/MusicPlayer';
import Fireworks from '../components/Fireworks';
import FallingFlowers from '../components/FallingFlowers';
import FloatingBalloons from '../components/FloatingBalloons';
import confetti from 'canvas-confetti';

export default function Home() {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [isLetterFinished, setIsLetterFinished] = useState(false);
  const [userWish, setUserWish] = useState('');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);

  const handleIntroClick = () => {
    setIsIntroExiting(true);
    setIsPlayingMusic(true); // Play music on first interaction
    setTimeout(() => {
      setIsIntroActive(false);
    }, 800); // Match CSS transition duration
  };

  // Trigger confetti burst repeatedly when candles are blown out
  useEffect(() => {
    if (isBlownOut) {
      // Automatic music trigger
      setIsPlayingMusic(true);

      // Confetti burst 1: Center
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Confetti burst 2: Left/Right side shooting up
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isBlownOut]);

  const handleAllCandlesBlownOut = (wishText) => {
    setUserWish(wishText);
    setIsBlownOut(true);
  };

  const handlePlayStateChange = (playingState) => {
    setIsPlayingMusic(playingState);
  };

  return (
    <>
      {isIntroActive && (
        <div 
          className={`${styles.introOverlay} ${isIntroExiting ? styles.introOverlayExiting : ''}`}
          onClick={handleIntroClick}
        >
          <img 
            src="/assets/intro-happy-birthday.png" 
            alt="Happy Birthday Intro" 
            className={`${styles.introImage} ${styles.animate__animated} ${styles.animate__slideInDown} ${styles.animate__slow}`}
          />
          <div className={styles.introTapPrompt}>
            Ketuk untuk membuka kado... 🎁
          </div>
        </div>
      )}
      <main className={`${styles.main} ${isIntroExiting ? `${styles.animate__animated} ${styles.animate__slideInUp}` : ''}`}>
      {/* Interactive Background Fireworks */}
      <Fireworks isTriggered={isBlownOut} />

      {/* Falling Flower Petals and Sage Leaves */}
      <FallingFlowers isTriggered={isBlownOut} />

      {/* Glossy Vector Floating Balloons (1-Page loop) */}
      <FloatingBalloons />

      {/* Custom Swaying Vector Banner */}
      <HangingBanner />

      {/* Header Title Section */}
      <header className={styles.header}>
        <h1 className={styles.title}>Happy Birthday Dahayu Zashika Wikrama</h1>
        <p className={styles.subtitle}>
          {isBlownOut 
            ? "✨ Selamat Ulang Tahun yang ke-20! ✨" 
            : "🎂 Usap semua lilin untuk meniupnya & membuat keinginanmu nyata! 🕯️"}
        </p>
      </header>

      {/* Interactive Birthday Cake */}
      <BirthdayCake onAllCandlesBlownOut={handleAllCandlesBlownOut} />

      {/* Notebook Paper Letter (revealed after candles are blown out) */}
      {isBlownOut && (
        <div className={styles.sectionTransition}>
          <PaperLetter 
            isTriggered={isBlownOut} 
            onComplete={() => setIsLetterFinished(true)} 
          />
        </div>
      )}

      {/* Flower Bouquet Gift (revealed after paper letter is completed) */}
      {isLetterFinished && (
        <div className={styles.sectionTransition} style={{ animationDelay: '0.2s' }}>
          <FlowerGift isTriggered={isLetterFinished} />
        </div>
      )}

      {/* Special Video Player (revealed after paper letter is completed) */}
      {isLetterFinished && (
        <div className={styles.sectionTransition} style={{ animationDelay: '0.4s' }}>
          <VideoCard 
            isTriggered={isLetterFinished} 
            onVideoPlay={() => setIsPlayingMusic(false)}
            onVideoPause={() => setIsPlayingMusic(true)}
          />
        </div>
      )}

      {/* Memory Clothesline (revealed after paper letter is completed) */}
      {isLetterFinished && (
        <div className={styles.sectionTransition} style={{ animationDelay: '0.6s' }}>
          <ClotheslineGallery isTriggered={isLetterFinished} />
        </div>
      )}

      {/* Floating Audio Player */}
      <MusicPlayer 
        isPlayingExternal={isPlayingMusic} 
        onPlayStateChange={handlePlayStateChange} 
      />
      </main>
    </>
  );
}
