'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './edit.module.css';
import ImageCropperModal from '../../components/ImageCropperModal';
import { 
  loadBirthdayData, 
  saveBirthdayData, 
  resetBirthdayData, 
  getShareableUrl, 
  exportConfigToJson,
  mergeWithDefaults 
} from '../../utils/dataStorage';
import { defaultBirthdayData } from '../../config/defaultData';

export default function EditPage() {
  const [data, setData] = useState(defaultBirthdayData);
  const [activeTab, setActiveTab] = useState('identity');
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  // Cropper Modal state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState('');
  const [cropperAspect, setCropperAspect] = useState(1);
  const [cropperTitle, setCropperTitle] = useState('Sesuaikan & Crop Foto');
  const [cropperCallback, setCropperCallback] = useState(null);

  // Load data on mount
  useEffect(() => {
    async function init() {
      const loaded = await loadBirthdayData();
      if (loaded) {
        setData(loaded);
      }
    }
    init();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  // Generic updater
  const updateField = (path, value) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      
      // Auto-save
      saveBirthdayData(copy);
      return copy;
    });
  };

  // Direct Video file upload handler
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit recommendation (e.g. 50MB)
    if (file.size > 80 * 1024 * 1024) {
      alert('Ukuran file video terlalu besar! Disarankan di bawah 50MB agar lancar.');
      return;
    }

    setIsProcessingFile(true);
    showToast('⏳ Sedang memproses video...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const videoDataUrl = event.target?.result;
      if (videoDataUrl) {
        updateField('mediaCard.src', videoDataUrl);
        updateField('mediaCard.type', 'video');
        setIsProcessingFile(false);
        showToast('🎬 Video berhasil di-upload dan siap diputar!');
      }
    };
    reader.onerror = () => {
      setIsProcessingFile(false);
      alert('Gagal membaca file video!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Direct Audio / Music file upload handler
  const handleMusicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    showToast('⏳ Sedang memproses audio lagu...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const audioDataUrl = event.target?.result;
      if (audioDataUrl) {
        updateField('music.src', audioDataUrl);
        // Auto set title if empty or default
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        if (fileNameWithoutExt) {
          updateField('music.title', fileNameWithoutExt);
        }
        setIsProcessingFile(false);
        showToast('🎵 Lagu berhasil di-upload!');
      }
    };
    reader.onerror = () => {
      setIsProcessingFile(false);
      alert('Gagal membaca file audio!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Open cropper helper
  const openImageCropper = (imageSrc, aspect, title, onComplete) => {
    setCropperImageSrc(imageSrc);
    setCropperAspect(aspect);
    setCropperTitle(title);
    setCropperCallback(() => (croppedUrl) => {
      onComplete(croppedUrl);
      setCropperOpen(false);
      showToast('✨ Foto berhasil dipotong & diperbarui!');
    });
    setCropperOpen(true);
  };

  // Handle local file selection for cropper
  const handleFileSelectForCrop = (e, aspect, title, onComplete) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        openImageCropper(dataUrl, aspect, title, onComplete);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  // Clothesline item management
  const updateGalleryItem = (index, field, value) => {
    const newItems = [...(data.clothesline?.items || [])];
    if (newItems[index]) {
      newItems[index] = { ...newItems[index], [field]: value };
      updateField('clothesline.items', newItems);
    }
  };

  const addGalleryItem = () => {
    const newItems = [...(data.clothesline?.items || [])];
    const newId = Date.now();
    newItems.push({
      id: newId,
      type: 'image',
      src: '/assets/R652026121319_raw8.jpeg',
      title: `Kenangan #${newItems.length + 1} 🌟`,
      description: 'Tuliskan deskripsi atau cerita manis dari foto ini...'
    });
    updateField('clothesline.items', newItems);
    showToast('➕ Foto baru berhasil ditambahkan ke jemuran!');
  };

  const removeGalleryItem = (index) => {
    const newItems = [...(data.clothesline?.items || [])];
    newItems.splice(index, 1);
    updateField('clothesline.items', newItems);
    showToast('🗑️ Foto berhasil dihapus dari jemuran');
  };

  // Reset to default
  const handleReset = async () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data & media ke pengaturan awal (Dahayu)?')) {
      const reset = await resetBirthdayData();
      setData(reset);
      showToast('🔄 Pengaturan telah dikembalikan ke default');
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const link = getShareableUrl(data);
    navigator.clipboard.writeText(link).then(() => {
      showToast('🔗 Link berhasil disalin! Siap dibagikan ke WhatsApp / Sosmed.');
    }).catch(() => {
      showToast('⚠️ Gagal menyalin otomatis, silakan salin URL browser.');
    });
  };

  // Export JSON
  const handleExportJson = () => {
    exportConfigToJson(data);
    showToast('📥 File konfigurasi JSON berhasil diunduh!');
  };

  // Import JSON
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        const merged = mergeWithDefaults(parsed);
        setData(merged);
        await saveBirthdayData(merged);
        showToast('📤 Berhasil mengimpor konfigurasi!');
      } catch (err) {
        alert('Format file JSON tidak valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={styles.pageWrapper}>
      
      {/* Toast notification */}
      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}

      {/* Main Top Header */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.backHomeBtn}>
            ← Kembali ke Website
          </Link>
          <h1 className={styles.headerTitle}>🎂 Studio Kustomisasi Ulang Tahun</h1>
        </div>

        <div className={styles.headerRight}>
          <button type="button" className={styles.secondaryBtn} onClick={handleReset}>
            🔄 Reset Default
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleCopyLink}>
            🔗 Salin Link Berbagi
          </button>
          <Link href="/" className={styles.previewBtn}>
            👁️ Lihat Preview
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={styles.editorContainer}>
        
        {/* Navigation Sidebar Tabs */}
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'identity' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            <span className={styles.tabIcon}>👤</span>
            <span>Nama & Judul Utama</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'letter' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('letter')}
          >
            <span className={styles.tabIcon}>💌</span>
            <span>Surat Notebook</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'media' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className={styles.tabIcon}>🎬</span>
            <span>Video / Foto Utama</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span className={styles.tabIcon}>🧸</span>
            <span>Jemuran Foto Polaroid</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'flower' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('flower')}
          >
            <span className={styles.tabIcon}>💐</span>
            <span>Kado Buket Bunga</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'music' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('music')}
          >
            <span className={styles.tabIcon}>🎵</span>
            <span>Lagu & Musik</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'share' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <span className={styles.tabIcon}>💾</span>
            <span>Simpan & Bagikan</span>
          </button>
        </aside>

        {/* Editor Form Panels */}
        <main className={styles.formPanel}>
          
          {/* TAB 1: NAMA & JUDUL UTAMA */}
          {activeTab === 'identity' && (
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>👤 Pengaturan Nama & Header Utama</h2>
              <p className={styles.sectionSubtitle}>Sesuaikan nama penerima, umur, dan teks pembuka di website.</p>

              <div className={styles.fieldGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Penerima</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.recipientName || ''} 
                    onChange={(e) => updateField('recipientName', e.target.value)}
                    placeholder="Contoh: Dahayu Zashika Wikrama"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Ulang Tahun Ke- (Umur)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.age || ''} 
                    onChange={(e) => updateField('age', e.target.value)}
                    placeholder="Contoh: 20"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Judul Header Utama</label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={data.header?.title || ''} 
                  onChange={(e) => updateField('header.title', e.target.value)}
                  placeholder="Contoh: Happy Birthday Dahayu Zashika Wikrama"
                />
              </div>

              <div className={styles.fieldGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subtitle (Sebelum Lilin Ditiup)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.header?.subtitleUnblown || ''} 
                    onChange={(e) => updateField('header.subtitleUnblown', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subtitle (Setelah Lilin Ditiup)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.header?.subtitleBlown || ''} 
                    onChange={(e) => updateField('header.subtitleBlown', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Placeholder Input Harapan (Kue)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.cake?.wishPlaceholder || ''} 
                    onChange={(e) => updateField('cake.wishPlaceholder', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Teks Hint Setelah Harapan Ditiup</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.cake?.wishSubmittedHint || ''} 
                    onChange={(e) => updateField('cake.wishSubmittedHint', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Teks Prompt Layar Pembuka (Intro Splash)</label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={data.intro?.tapPrompt || ''} 
                  onChange={(e) => updateField('intro.tapPrompt', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SURAT NOTEBOOK */}
          {activeTab === 'letter' && (
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>💌 Pengaturan Surat Notebook Interaktif</h2>
              <p className={styles.sectionSubtitle}>Ubah kata-kata doa, harapan, dan pesan manis berlembar-lembar.</p>

              <div className={styles.fieldGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Judul Cover Surat</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.letter?.coverTitle || ''} 
                    onChange={(e) => updateField('letter.coverTitle', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Teks Tombol Baca</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.letter?.bacaBtnText || ''} 
                    onChange={(e) => updateField('letter.bacaBtnText', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Deskripsi Cover Surat</label>
                <textarea 
                  className={styles.textarea}
                  rows={2}
                  value={data.letter?.coverDesc || ''} 
                  onChange={(e) => updateField('letter.coverDesc', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Isi Surat - Lembar 1 (Doa & Harapan)</label>
                <p className={styles.helperText}>Setiap baris baru akan diketik satu per satu secara elegan.</p>
                <textarea 
                  className={styles.textarea}
                  rows={6}
                  value={Array.isArray(data.letter?.page1Lines) ? data.letter.page1Lines.join('\n') : data.letter?.page1Lines || ''} 
                  onChange={(e) => updateField('letter.page1Lines', e.target.value.split('\n'))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Isi Surat - Lembar 2 (Pesan Penutup)</label>
                <textarea 
                  className={styles.textarea}
                  rows={5}
                  value={Array.isArray(data.letter?.page2Lines) ? data.letter.page2Lines.join('\n') : data.letter?.page2Lines || ''} 
                  onChange={(e) => updateField('letter.page2Lines', e.target.value.split('\n'))}
                />
              </div>

              <div className={styles.fieldGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pertanyaan Dialog Interaktif</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.letter?.feedbackTitle || ''} 
                    onChange={(e) => updateField('letter.feedbackTitle', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Teks Ucapan Terima Kasih (Layar Hati)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={data.letter?.thanksText || ''} 
                    onChange={(e) => updateField('letter.thanksText', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA UTAMA (VIDEO / FOTO) */}
          {activeTab === 'media' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionTitle}>🎬 Pengaturan Kartu Media (Video / Foto Utama)</h2>
                  <p className={styles.sectionSubtitle}>Pilih file video atau foto langsung dari perangkat Anda.</p>
                </div>

                {/* Show/Hide Toggle */}
                <label className={styles.switchLabel}>
                  <input 
                    type="checkbox" 
                    checked={data.mediaCard?.enabled !== false} 
                    onChange={(e) => updateField('mediaCard.enabled', e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                  <span className={styles.switchText}>
                    {data.mediaCard?.enabled !== false ? '✅ Ditampilkan' : '❌ Disembunyikan'}
                  </span>
                </label>
              </div>

              {data.mediaCard?.enabled !== false && (
                <>
                  {/* Media Type Selector */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Pilih Tipe Media:</label>
                    <div className={styles.typeSelectorRow}>
                      <button 
                        type="button" 
                        className={`${styles.typeBtn} ${data.mediaCard?.type === 'video' ? styles.typeBtnActive : ''}`}
                        onClick={() => updateField('mediaCard.type', 'video')}
                      >
                        🎥 Video Player
                      </button>

                      <button 
                        type="button" 
                        className={`${styles.typeBtn} ${data.mediaCard?.type === 'image' ? styles.typeBtnActive : ''}`}
                        onClick={() => updateField('mediaCard.type', 'image')}
                      >
                        🖼️ Foto Utama (16:9)
                      </button>
                    </div>
                  </div>

                  {/* VIDEO UPLOAD SECTION */}
                  {data.mediaCard?.type === 'video' ? (
                    <div className={styles.uploadCardBox}>
                      <label className={styles.label}>File Video yang Dipilih:</label>
                      
                      <div className={styles.videoPreviewWrapper}>
                        <video 
                          key={data.mediaCard?.src}
                          src={data.mediaCard?.src || '/assets/video-kita.mp4'} 
                          controls 
                          className={styles.videoPreviewPlayer}
                        />
                      </div>

                      <div className={styles.btnRow}>
                        <label className={styles.primaryBtn}>
                          📁 Upload Video Baru (.mp4 / .mov / .webm)
                          <input 
                            type="file" 
                            accept="video/mp4,video/webm,video/quicktime,video/*" 
                            style={{ display: 'none' }}
                            onChange={handleVideoUpload}
                          />
                        </label>

                        <button 
                          type="button" 
                          className={styles.secondaryBtn}
                          onClick={() => {
                            updateField('mediaCard.src', '/assets/video-kita.mp4');
                            showToast('🔄 Video dikembalikan ke video bawaan');
                          }}
                        >
                          Gunakan Video Bawaan
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* PHOTO UPLOAD & CROP SECTION */
                    <div className={styles.uploadCardBox}>
                      <label className={styles.label}>Foto Utama Berbingkai Bunga (Rasio 16:9):</label>
                      
                      <div className={styles.previewBox}>
                        <img 
                          src={data.mediaCard?.imageSrc || data.mediaCard?.src || '/assets/R652026121319_raw8.jpeg'} 
                          alt="Preview Foto Utama" 
                          className={styles.mediaPreviewImg}
                        />
                      </div>

                      <div className={styles.btnRow}>
                        <label className={styles.primaryBtn}>
                          📁 Upload Foto dari Perangkat
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileSelectForCrop(e, 16/9, "Crop Foto Utama (16:9)", (url) => {
                              updateField('mediaCard.imageSrc', url);
                            })}
                          />
                        </label>

                        <button 
                          type="button" 
                          className={styles.secondaryBtn}
                          onClick={() => openImageCropper(
                            data.mediaCard?.imageSrc || data.mediaCard?.src || '/assets/R652026121319_raw8.jpeg',
                            16/9,
                            "Sesuaikan & Crop Foto Utama (16:9)",
                            (url) => updateField('mediaCard.imageSrc', url)
                          )}
                        >
                          ✂️ Crop & Sesuaikan Posisi
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Teks Keterangan / Caption Media</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={data.mediaCard?.caption || ''} 
                      onChange={(e) => updateField('mediaCard.caption', e.target.value)}
                      placeholder="Contoh: Momen Spesial Kita Bersama 💕"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: JEMURAN FOTO POLAROID */}
          {activeTab === 'gallery' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionTitle}>🧸 Pengaturan Jemuran Foto (*Clothesline Gallery*)</h2>
                  <p className={styles.sectionSubtitle}>Kelola foto-foto polaroid, caption, dan cerita kenangan.</p>
                </div>

                {/* Show/Hide Toggle */}
                <label className={styles.switchLabel}>
                  <input 
                    type="checkbox" 
                    checked={data.clothesline?.enabled !== false} 
                    onChange={(e) => updateField('clothesline.enabled', e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                  <span className={styles.switchText}>
                    {data.clothesline?.enabled !== false ? '✅ Ditampilkan' : '❌ Disembunyikan'}
                  </span>
                </label>
              </div>

              {data.clothesline?.enabled !== false && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Judul Bagian Jemuran</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={data.clothesline?.title || ''} 
                      onChange={(e) => updateField('clothesline.title', e.target.value)}
                    />
                  </div>

                  {/* Polaroid List */}
                  <div className={styles.galleryList}>
                    {(data.clothesline?.items || []).map((item, index) => (
                      <div key={item.id || index} className={styles.galleryCardItem}>
                        <div className={styles.galleryItemThumbWrapper}>
                          <img src={item.src} alt={item.title} className={styles.galleryItemThumb} />
                          <div className={styles.thumbActions}>
                            <label className={styles.miniUploadBtn} title="Upload Foto Baru dari Galeri">
                              📁
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelectForCrop(e, 1, `Crop Foto #${index + 1} (1:1)`, (url) => {
                                  updateGalleryItem(index, 'src', url);
                                })}
                              />
                            </label>
                            <button 
                              type="button" 
                              className={styles.miniCropBtn}
                              title="Crop / Sesuaikan"
                              onClick={() => openImageCropper(item.src, 1, `Crop Foto #${index + 1} (1:1)`, (url) => {
                                updateGalleryItem(index, 'src', url);
                              })}
                            >
                              ✂️
                            </button>
                          </div>
                        </div>

                        <div className={styles.galleryItemForm}>
                          <div className={styles.fieldGrid}>
                            <div className={styles.formGroup}>
                              <label className={styles.labelSmall}>Judul Polaroid #{index + 1}</label>
                              <input 
                                type="text" 
                                className={styles.inputSmall}
                                value={item.title || ''} 
                                onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                              />
                            </div>

                            <div className={styles.formGroup}>
                              <label className={styles.labelSmall}>Format</label>
                              <select 
                                className={styles.selectSmall}
                                value={item.type || 'image'}
                                onChange={(e) => updateGalleryItem(index, 'type', e.target.value)}
                              >
                                <option value="image">Foto Biasa (JPG/PNG)</option>
                                <option value="gif">Animasi Bergerak (GIF)</option>
                              </select>
                            </div>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.labelSmall}>Cerita Kenangan (Tampil saat diklik)</label>
                            <textarea 
                              className={styles.textareaSmall}
                              rows={2}
                              value={item.description || ''} 
                              onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                            />
                          </div>
                        </div>

                        <button 
                          type="button" 
                          className={styles.deleteCardBtn}
                          onClick={() => removeGalleryItem(index)}
                          title="Hapus Foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" className={styles.addPhotoBtn} onClick={addGalleryItem}>
                    ➕ Tambah Foto Baru ke Gantungan
                  </button>
                </>
              )}
            </div>
          )}

          {/* TAB 5: KADO BUKET BUNGA */}
          {activeTab === 'flower' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionTitle}>💐 Pengaturan Kado Buket Bunga</h2>
                  <p className={styles.sectionSubtitle}>Sesuaikan foto buket bunga dan pesan makna bunga yang dikirimkan.</p>
                </div>

                <label className={styles.switchLabel}>
                  <input 
                    type="checkbox" 
                    checked={data.flowerGift?.enabled !== false} 
                    onChange={(e) => updateField('flowerGift.enabled', e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                  <span className={styles.switchText}>
                    {data.flowerGift?.enabled !== false ? '✅ Ditampilkan' : '❌ Disembunyikan'}
                  </span>
                </label>
              </div>

              {data.flowerGift?.enabled !== false && (
                <>
                  <div className={styles.fieldGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Judul Kado (Sebelum Dibuka)</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        value={data.flowerGift?.giftCardTitle || ''} 
                        onChange={(e) => updateField('flowerGift.giftCardTitle', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Subtitle Kado (Sebelum Dibuka)</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        value={data.flowerGift?.giftCardSubtitle || ''} 
                        onChange={(e) => updateField('flowerGift.giftCardSubtitle', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bouquet Image & Crop */}
                  <div className={styles.uploadCardBox}>
                    <label className={styles.label}>Foto Buket Bunga (Persegi 1:1)</label>
                    <div className={styles.previewBoxSquare}>
                      <img 
                        src={data.flowerGift?.bouquetImageSrc || '/assets/flower_bouquet.jpg'} 
                        alt="Buket Bunga" 
                        className={styles.bouquetPreviewImg}
                      />
                    </div>

                    <div className={styles.btnRow}>
                      <label className={styles.primaryBtn}>
                        📁 Upload Foto Buket Baru
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelectForCrop(e, 1, "Crop Foto Buket Bunga (1:1)", (url) => {
                            updateField('flowerGift.bouquetImageSrc', url);
                          })}
                        />
                      </label>

                      <button 
                        type="button" 
                        className={styles.secondaryBtn}
                        onClick={() => openImageCropper(
                          data.flowerGift?.bouquetImageSrc || '/assets/flower_bouquet.jpg',
                          1,
                          "Crop Foto Buket Bunga (1:1)",
                          (url) => updateField('flowerGift.bouquetImageSrc', url)
                        )}
                      >
                        ✂️ Crop Foto
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Judul Buket Bunga (Setelah Dibuka)</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={data.flowerGift?.bouquetTitle || ''} 
                      onChange={(e) => updateField('flowerGift.bouquetTitle', e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Pesan Filosofi & Makna Bunga</label>
                    <textarea 
                      className={styles.textarea}
                      rows={5}
                      value={data.flowerGift?.bouquetText || ''} 
                      onChange={(e) => updateField('flowerGift.bouquetText', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 6: MUSIK & LAGU */}
          {activeTab === 'music' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionTitle}>🎵 Pengaturan Lagu & Pemutar Musik</h2>
                  <p className={styles.sectionSubtitle}>Upload lagu kesukaan langsung dari perangkat Anda.</p>
                </div>

                <label className={styles.switchLabel}>
                  <input 
                    type="checkbox" 
                    checked={data.music?.enabled !== false} 
                    onChange={(e) => updateField('music.enabled', e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                  <span className={styles.switchText}>
                    {data.music?.enabled !== false ? '✅ Aktif' : '❌ Nonaktif'}
                  </span>
                </label>
              </div>

              {data.music?.enabled !== false && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Judul Lagu & Nama Artis</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={data.music?.title || ''} 
                      onChange={(e) => updateField('music.title', e.target.value)}
                      placeholder="Contoh: Monokrom - Tulus"
                    />
                  </div>

                  {/* Audio File Upload Box */}
                  <div className={styles.uploadCardBox}>
                    <label className={styles.label}>File Lagu yang Diputar:</label>
                    
                    <audio 
                      key={data.music?.src}
                      src={data.music?.src || '/assets/monokrom.mp3'} 
                      controls 
                      className={styles.audioPreviewPlayer}
                    />

                    <div className={styles.btnRow}>
                      <label className={styles.primaryBtn}>
                        📁 Upload File Lagu (.mp3 / .wav / .m4a / .ogg)
                        <input 
                          type="file" 
                          accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/*" 
                          style={{ display: 'none' }}
                          onChange={handleMusicUpload}
                        />
                      </label>

                      <button 
                        type="button" 
                        className={styles.secondaryBtn}
                        onClick={() => {
                          updateField('music.src', '/assets/monokrom.mp3');
                          updateField('music.title', 'Monokrom - Tulus');
                          showToast('🔄 Lagu dikembalikan ke default Monokrom');
                        }}
                      >
                        Gunakan Lagu Bawaan (Monokrom)
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Teks Saat Musik Berputar</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        value={data.music?.subPlaying || ''} 
                        onChange={(e) => updateField('music.subPlaying', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Teks Saat Musik Dijeda</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        value={data.music?.subPaused || ''} 
                        onChange={(e) => updateField('music.subPaused', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 7: SIMPAN, BAGIKAN & DEPLOY */}
          {activeTab === 'share' && (
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>💾 Simpan, Bagikan & Ekspor Konfigurasi</h2>
              <p className={styles.sectionSubtitle}>Bagikan website ke teman Anda atau ekspor konfigurasi untuk GitHub.</p>

              <div className={styles.shareCardsContainer}>
                
                {/* 1. Share Link */}
                <div className={styles.actionCard}>
                  <div className={styles.actionCardIcon}>🔗</div>
                  <h3 className={styles.actionCardTitle}>Buat Link Siap Kirim (Shareable Link)</h3>
                  <p className={styles.actionCardDesc}>
                    Semua teks dan data editan akan di-encode ke dalam satu link URL. Penerima langsung membuka link ini dengan hasil editan Anda!
                  </p>
                  <button type="button" className={styles.primaryBtn} onClick={handleCopyLink}>
                    📋 Salin Link Berbagi
                  </button>
                </div>

                {/* 2. Download JSON */}
                <div className={styles.actionCard}>
                  <div className={styles.actionCardIcon}>📥</div>
                  <h3 className={styles.actionCardTitle}>Download File JSON (Untuk GitHub)</h3>
                  <p className={styles.actionCardDesc}>
                    Unduh file <code>birthday-config.json</code> untuk disimpan atau dijadikan data default sebelum push ke repository GitHub.
                  </p>
                  <button type="button" className={styles.secondaryBtn} onClick={handleExportJson}>
                    💾 Unduh Konfigurasi (.json)
                  </button>
                </div>

                {/* 3. Import JSON */}
                <div className={styles.actionCard}>
                  <div className={styles.actionCardIcon}>📤</div>
                  <h3 className={styles.actionCardTitle}>Impor Konfigurasi JSON</h3>
                  <p className={styles.actionCardDesc}>
                    Punya file JSON konfigurasi lama? Unggah ke sini untuk memuat kembali semua data Anda secara instan.
                  </p>
                  <label className={styles.uploadLabelBtn}>
                    📁 Unggah File JSON
                    <input 
                      type="file" 
                      accept=".json" 
                      style={{ display: 'none' }}
                      onChange={handleImportJson}
                    />
                  </label>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal 
          imageSrc={cropperImageSrc}
          aspectRatio={cropperAspect}
          title={cropperTitle}
          onCropComplete={(croppedUrl) => {
            if (cropperCallback) cropperCallback(croppedUrl);
          }}
          onCancel={() => setCropperOpen(false)}
        />
      )}

    </div>
  );
}
