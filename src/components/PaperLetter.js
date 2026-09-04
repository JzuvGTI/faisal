'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PaperLetter.module.css';
import confetti from 'canvas-confetti';

export default function PaperLetter({ 
  isTriggered, 
  onComplete,
  letterData = {} 
}) {
  const [step, setStep] = useState('intro'); // intro -> page1 -> page2 -> feedback -> thanks
  const [typedText, setTypedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [gakOffset, setGakOffset] = useState({ x: 0, y: 0 });
  const paperRef = useRef(null);

  const coverTitle = letterData.coverTitle || "Untuk Dahayu Zashika Wikrama 🌸";
  const coverDesc = letterData.coverDesc || "Ada sebuah tulisan kecil di selembar kertas ini.\nKetuk tombol di bawah untuk membacanya.";
  const bacaBtnText = letterData.bacaBtnText || "Baca Surat";
  const page1Lines = letterData.page1Lines || [
    "Hari ini, saya langitkan semua doa terbaik saya untuk Dahayu.",
    "Semoga hal-hal yang membuat Dahayu runtuh turut menjadi alasan Dahayu untuk tetap tumbuh.",
    "Semoga dunia senantiasa menjaga Dahayu dimanapun Dahayu berada.",
    "Semoga hari-hari Dahayu selalu diiringi cinta yang tak pernah ada batasnya.",
    "Semoga setiap langkahmu dimudahkan hingga tercapai apa yang Dahayu inginkan."
  ];
  const page2Lines = letterData.page2Lines || [
    "Dengan ataupun tanpaku, semoga semesta selalu membahagiakan Dahayu bagimanapun caranya.",
    "",
    "Barakallah fi umrik, terima kasih sudah bertahan sampai sejauh ini.",
    "",
    "- Wish you all the best"
  ];
  const feedbackTitle = letterData.feedbackTitle || "Kamu suka nggak? 🥺";
  const feedbackGakBtn = letterData.feedbackGakBtn || "Gak! 😢";
  const feedbackSukaBtn = letterData.feedbackSukaBtn || "Suka!! ❤️";
  const thanksText = letterData.thanksText || "Terimakasih.";

  // Typewriter effect logic
  useEffect(() => {
    if (step !== 'page1' && step !== 'page2' && step !== 'thanks') return;

    let textToType = '';
    let charSpeed = 50; // ms per character
    let startDelay = 500;

    if (step === 'page1') {
      textToType = Array.isArray(page1Lines) ? page1Lines.join('\n') : String(page1Lines);
    } else if (step === 'page2') {
      textToType = Array.isArray(page2Lines) ? page2Lines.join('\n') : String(page2Lines);
    } else if (step === 'thanks') {
      textToType = thanksText;
      charSpeed = 100;
    }

    setIsTypingFinished(false);
    setTypedText('');

    let currentIndex = 0;
    let timerId = null;

    const type = () => {
      if (currentIndex < textToType.length) {
        const char = textToType[currentIndex];
        if (char !== undefined) {
          setTypedText(prev => prev + char);
        }
        currentIndex++;
        
        // Add a longer pause on newlines for a more natural look
        const delay = char === '\n' ? 600 : charSpeed;
        timerId = setTimeout(type, delay);
      } else {
        setIsTypingFinished(true);
      }
    };

    const startTimer = setTimeout(type, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timerId);
    };
  }, [step, page1Lines, page2Lines, thanksText]);

  if (!isTriggered) return null;

  const handleBacaClick = (e) => {
    e.stopPropagation();
    setStep('page1');
  };

  const handlePaperClick = () => {
    if (!isTypingFinished) return;

    if (step === 'page1') {
      setStep('page2');
    } else if (step === 'page2') {
      setStep('feedback');
    }
  };

  // Runaway button "Gak!" event handler
  const handleGakTrigger = (e) => {
    e.stopPropagation();
    
    let randomX = Math.floor(Math.random() * 240) - 120; // -120px to 120px
    let randomY = Math.floor(Math.random() * 160) - 80;  // -80px to 80px
    
    if (Math.abs(randomX - gakOffset.x) < 40) {
      randomX += randomX > 0 ? 50 : -50;
    }
    if (Math.abs(randomY - gakOffset.y) < 40) {
      randomY += randomY > 0 ? 50 : -50;
    }
    
    setGakOffset({ x: randomX, y: randomY });
  };

  const handleSukaClick = (e) => {
    e.stopPropagation();
    setStep('thanks');

    // Confetti burst
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.55 }
    });

    // Notify parent page that the letter is finished and rest of gifts can open
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Step: Cover Intro, Page 1, Page 2, Thanks (Notebook styled sheet) */}
      {(step === 'intro' || step === 'page1' || step === 'page2' || step === 'thanks') && (
        <div 
          ref={paperRef}
          className={`${styles.paper} ${isTypingFinished ? styles.clickablePaper : ''}`}
          onClick={handlePaperClick}
        >
          {/* Lined notebook paper content */}
          <div className={styles.paperContent}>
            
            {/* INTRO COVER STATE */}
            {step === 'intro' && (
              <div className={styles.coverLayout}>
                <h3 className={styles.coverTitle}>{coverTitle}</h3>
                <p className={styles.coverDesc}>
                  {coverDesc.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < coverDesc.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                <button 
                  className={styles.bacaBtn} 
                  onClick={handleBacaClick}
                >
                  {bacaBtnText}
                </button>
              </div>
            )}

            {/* TYPED WRITTEN TEXT STATES */}
            {(step === 'page1' || step === 'page2') && (
              <div className={styles.textLayout}>
                <pre className={styles.teks}>{typedText}</pre>
                
                {isTypingFinished && (
                  <div className={styles.tapPrompt}>
                    Ketuk kertas untuk melanjutkan... 👆
                  </div>
                )}
              </div>
            )}

            {/* THANKS STATE */}
            {step === 'thanks' && (
              <div className={styles.thanksLayout}>
                <div className={styles.heartWrapper}>
                  <svg 
                    className={styles.heartIcon} 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <pre className={styles.teksCenter}>{typedText}</pre>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Step: Feedback Dialog Box */}
      {step === 'feedback' && (
        <div className={`${styles.kotak}`}>
          <h4 className={styles.feedbackTitle}>{feedbackTitle}</h4>
          <div className={styles.feedbackButtons}>
            
            {/* Runaway "Gak!" Button */}
            <button 
              className={styles.gakBtn}
              style={{
                transform: `translate(${gakOffset.x}px, ${gakOffset.y}px)`,
                transition: 'transform 0.15s ease-out'
              }}
              onMouseEnter={handleGakTrigger}
              onTouchStart={handleGakTrigger}
              onClick={handleGakTrigger}
            >
              {feedbackGakBtn}
            </button>

            {/* Normal "Suka!!" Button */}
            <button 
              className={styles.sukaBtn}
              onClick={handleSukaClick}
            >
              {feedbackSukaBtn}
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}
