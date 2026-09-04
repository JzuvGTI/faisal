'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ImageCropperModal.module.css';

export default function ImageCropperModal({ 
  imageSrc, 
  aspectRatio = 1, // 1 for Square (1:1), 16/9 for Landscape (16:9), etc.
  title = "Sesuaikan & Crop Foto",
  onCropComplete, 
  onCancel 
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Load image object
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      drawCanvas();
    };
  }, [imageSrc]);

  // Redraw canvas whenever zoom, rotation, or offset changes
  useEffect(() => {
    drawCanvas();
  }, [zoom, rotation, offset]);

  const getCanvasDimensions = () => {
    const maxWidth = 340;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > 340) {
      height = 340;
      width = height * aspectRatio;
    }

    return { width, height };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = getCanvasDimensions();
    
    // Set display resolution (2x for crisp preview on retina)
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, width, height);

    // Transform coordinate system to center of canvas
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate image base scale to cover viewport
    const imgAspect = img.width / img.height;
    let renderW, renderH;

    if (imgAspect > aspectRatio) {
      renderH = height;
      renderW = renderH * imgAspect;
    } else {
      renderW = width;
      renderH = renderW / imgAspect;
    }

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();
  };

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.max(0.6, Math.min(3.5, prev + zoomDelta)));
  };

  const rotate90 = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleSaveCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // High quality export canvas
    const exportCanvas = document.createElement('canvas');
    const targetWidth = aspectRatio >= 1 ? 900 : 900 * aspectRatio;
    const targetHeight = targetWidth / aspectRatio;

    exportCanvas.width = targetWidth;
    exportCanvas.height = targetHeight;
    const ctx = exportCanvas.getContext('2d');

    const { width: prevW, height: prevH } = getCanvasDimensions();
    const scaleFactor = targetWidth / prevW;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.translate(
      (targetWidth / 2) + (offset.x * scaleFactor), 
      (targetHeight / 2) + (offset.y * scaleFactor)
    );
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const imgAspect = img.width / img.height;
    let renderW, renderH;

    if (imgAspect > aspectRatio) {
      renderH = prevH;
      renderW = renderH * imgAspect;
    } else {
      renderW = prevW;
      renderH = renderW / imgAspect;
    }

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

    // Export as clean WebP/JPEG data URL
    const croppedUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    if (onCropComplete) {
      onCropComplete(croppedUrl);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>

        {/* Viewport Canvas Container */}
        <div 
          ref={containerRef}
          className={styles.canvasWrapper}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className={styles.cropCanvas} />
          
          {/* Grid Guideline Overlay */}
          <div className={styles.gridOverlay}>
            <div className={styles.gridLineH1}></div>
            <div className={styles.gridLineH2}></div>
            <div className={styles.gridLineV1}></div>
            <div className={styles.gridLineV2}></div>
          </div>
        </div>

        <p className={styles.tipText}>
          💡 Geser foto untuk memindahkan • Geser slider untuk perbesar
        </p>

        {/* Zoom & Rotation Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.zoomControl}>
            <span className={styles.controlLabel}>🔍 Zoom:</span>
            <input 
              type="range" 
              min="0.6" 
              max="3.0" 
              step="0.05" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <button type="button" className={styles.rotateBtn} onClick={rotate90}>
            🔄 Putar 90°
          </button>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsRow}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Batal
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSaveCrop}>
            ✨ Terapkan Crop
          </button>
        </div>

      </div>
    </div>
  );
}
