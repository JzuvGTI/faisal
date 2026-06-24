'use strict';

import React, { useEffect, useRef } from 'react';
import styles from './Fireworks.module.css';

const FIREWORK_COLORS = [
  '#A1BC98', // Sage Light
  '#778873', // Sage Dark
  '#E5989B', // Rose Light
  '#B5828C', // Rose Dark
  '#E8C39E'  // Soft Apricot
];

export default function Fireworks({ isTriggered }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isTriggered) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle and Rocket storage
    let rockets = [];
    let particles = [];

    // Helper classes
    class Rocket {
      constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        // Launch upwards
        this.vy = -Math.random() * 4 - 8; 
        this.vx = (Math.random() - 0.5) * 1.5;
        this.exploded = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.04; // small gravity resistance
        if (this.y <= this.targetY || this.vy >= 0) {
          this.exploded = true;
          this.explode();
        }
      }

      explode() {
        const particleCount = Math.floor(Math.random() * 40) + 50;
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Spark trail
        ctx.beginPath();
        ctx.arc(this.x - this.vx, this.y - this.vy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.06;
        this.drag = 0.96;
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.008;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Trigger a firework rocket
    const spawnRocket = (x, y, targetY) => {
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      rockets.push(new Rocket(x, y, targetY, color));
    };

    // Auto launcher interval
    let autoLaunchCounter = 0;

    // Main animation loop
    const animate = () => {
      // Create fading trails with alpha deletion to preserve transparent background
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // Auto spawn rockets periodically
      autoLaunchCounter++;
      if (autoLaunchCounter > 45) {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = canvas.height;
        const targetY = Math.random() * canvas.height * 0.45 + canvas.height * 0.15;
        spawnRocket(x, y, targetY);
        autoLaunchCounter = 0;
      }

      // Update and draw rockets
      rockets = rockets.filter(r => !r.exploded);
      rockets.forEach(r => {
        r.update();
        r.draw();
      });

      // Update and draw particles
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animate();

    // Custom launch on window clicks
    const handleWindowClick = (e) => {
      const x = e.clientX;
      const y = canvas.height;
      const targetY = e.clientY;
      spawnRocket(x, y, targetY);
    };
    window.addEventListener('click', handleWindowClick);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTriggered]);

  if (!isTriggered) return null;

  return (
    <canvas ref={canvasRef} className={styles.canvas} />
  );
}
