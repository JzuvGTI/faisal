'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MusicPlayer.module.css';

export default function MusicPlayer({ isPlayingExternal, onPlayStateChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Sync with external trigger (e.g. intro screen tap, cake candles blown out, or video play state)
  useEffect(() => {
    if (isPlayingExternal !== undefined && isPlayingExternal !== isPlaying) {
      if (isPlayingExternal) {
        startPlaying();
      } else {
        stopPlaying();
      }
    }
  }, [isPlayingExternal]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlaying();
    };
  }, []);

  const startPlaying = () => {
    setIsPlaying(true);
    if (onPlayStateChange) onPlayStateChange(true);
    
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Audio play blocked or failed:", err);
      });
    }
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <audio 
        ref={audioRef} 
        src="/assets/monokrom.mp3" 
        loop 
        preload="auto"
      />
      
      <div 
        className={`${styles.vinylWrapper} ${isPlaying ? styles.vinylPlaying : ''}`} 
        onClick={togglePlay}
      >
        <div className={`${styles.vinyl} ${isPlaying ? styles.vinylPlaying : ''}`}>
          <div className={styles.vinylCenter}>
            <div className={styles.vinylCenterDot}></div>
          </div>
        </div>
        <div className={styles.noteIcon}>
          {isPlaying ? '🎵' : '🔇'}
        </div>
      </div>
      
      <div className={styles.info}>
        <h4 className={styles.title}>Monokrom - Tulus</h4>
        <p className={styles.subtitle}>
          {isPlaying ? 'Memutar Monokrom...' : 'Klik piringan untuk memutar!'}
        </p>
      </div>
    </div>
  );
}
