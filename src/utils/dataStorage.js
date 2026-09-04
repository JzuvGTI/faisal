import { defaultBirthdayData } from '../config/defaultData';
import { getMediaFromDB, saveMediaToDB, clearAllMediaFromDB } from './mediaDb';

export const STORAGE_KEY = 'birthday_custom_data_v1';

// Safe UTF-8 Base64 Encoding for URL Sharing
export const encodeDataForUrl = (data) => {
  try {
    // Strip very large base64 strings if we want a lightweight URL (or keep lightweight items)
    const jsonString = JSON.stringify(data);
    return encodeURIComponent(btoa(encodeURIComponent(jsonString)));
  } catch (err) {
    console.error('Failed to encode data for URL:', err);
    return '';
  }
};

// Safe UTF-8 Base64 Decoding from URL
export const decodeDataFromUrl = (encodedStr) => {
  try {
    const jsonString = decodeURIComponent(atob(decodeURIComponent(encodedStr)));
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to decode data from URL:', err);
    return null;
  }
};

// Deep merge helper to ensure all keys exist
export const mergeWithDefaults = (customData) => {
  if (!customData || typeof customData !== 'object') {
    return { ...defaultBirthdayData };
  }

  return {
    ...defaultBirthdayData,
    ...customData,
    intro: {
      ...defaultBirthdayData.intro,
      ...(customData.intro || {})
    },
    header: {
      ...defaultBirthdayData.header,
      ...(customData.header || {})
    },
    cake: {
      ...defaultBirthdayData.cake,
      ...(customData.cake || {})
    },
    letter: {
      ...defaultBirthdayData.letter,
      ...(customData.letter || {}),
      page1Lines: Array.isArray(customData.letter?.page1Lines) 
        ? customData.letter.page1Lines 
        : defaultBirthdayData.letter.page1Lines,
      page2Lines: Array.isArray(customData.letter?.page2Lines) 
        ? customData.letter.page2Lines 
        : defaultBirthdayData.letter.page2Lines
    },
    flowerGift: {
      ...defaultBirthdayData.flowerGift,
      ...(customData.flowerGift || {})
    },
    mediaCard: {
      ...defaultBirthdayData.mediaCard,
      ...(customData.mediaCard || {})
    },
    clothesline: {
      ...defaultBirthdayData.clothesline,
      ...(customData.clothesline || {}),
      items: Array.isArray(customData.clothesline?.items)
        ? customData.clothesline.items
        : defaultBirthdayData.clothesline.items
    },
    music: {
      ...defaultBirthdayData.music,
      ...(customData.music || {})
    }
  };
};

// Asynchronously load current birthday data from URL, LocalStorage, and IndexedDB
export const loadBirthdayData = async () => {
  if (typeof window === 'undefined') {
    return defaultBirthdayData;
  }

  let result = { ...defaultBirthdayData };

  try {
    // 1. Check URL parameters (?data=... or #data=...)
    const urlParams = new URLSearchParams(window.location.search);
    let dataParam = urlParams.get('data');
    
    if (!dataParam && window.location.hash.startsWith('#data=')) {
      dataParam = window.location.hash.replace('#data=', '');
    }

    if (dataParam) {
      const decoded = decodeDataFromUrl(dataParam);
      if (decoded) {
        result = mergeWithDefaults(decoded);
      }
    } else {
      // 2. Check LocalStorage
      const savedLocal = localStorage.getItem(STORAGE_KEY);
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        result = mergeWithDefaults(parsed);
      }
    }

    // 3. Hydrate with any uploaded media stored in IndexedDB
    const videoDb = await getMediaFromDB('media_video');
    if (videoDb) {
      result.mediaCard.src = videoDb;
    }

    const musicDb = await getMediaFromDB('media_music');
    if (musicDb) {
      result.music.src = musicDb;
    }

    const mainPhotoDb = await getMediaFromDB('media_main_photo');
    if (mainPhotoDb) {
      result.mediaCard.imageSrc = mainPhotoDb;
    }

    const bouquetDb = await getMediaFromDB('media_bouquet');
    if (bouquetDb) {
      result.flowerGift.bouquetImageSrc = bouquetDb;
    }

  } catch (err) {
    console.warn('Error loading custom birthday data, using defaults:', err);
  }

  return result;
};

// Save birthday data to LocalStorage & IndexedDB
export const saveBirthdayData = async (data) => {
  if (typeof window === 'undefined') return;
  try {
    const merged = mergeWithDefaults(data);

    // If video or music are large data URLs, store in IndexedDB to protect LocalStorage
    if (merged.mediaCard?.src && merged.mediaCard.src.startsWith('data:')) {
      await saveMediaToDB('media_video', merged.mediaCard.src);
    }
    if (merged.mediaCard?.imageSrc && merged.mediaCard.imageSrc.startsWith('data:')) {
      await saveMediaToDB('media_main_photo', merged.mediaCard.imageSrc);
    }
    if (merged.music?.src && merged.music.src.startsWith('data:')) {
      await saveMediaToDB('media_music', merged.music.src);
    }
    if (merged.flowerGift?.bouquetImageSrc && merged.flowerGift.bouquetImageSrc.startsWith('data:')) {
      await saveMediaToDB('media_bouquet', merged.flowerGift.bouquetImageSrc);
    }

    // Create a lightweight copy for LocalStorage
    const localCopy = JSON.parse(JSON.stringify(merged));
    
    // If video is data URL, avoid bloat in localStorage (since it's in IndexedDB)
    if (localCopy.mediaCard?.src?.startsWith('data:')) {
      localCopy.mediaCard.src = 'INDEXED_DB_MEDIA';
    }
    if (localCopy.music?.src?.startsWith('data:')) {
      localCopy.music.src = 'INDEXED_DB_MEDIA';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(localCopy));
    return true;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    return false;
  }
};

// Reset birthday data to defaults
export const resetBirthdayData = async () => {
  if (typeof window === 'undefined') return defaultBirthdayData;
  try {
    localStorage.removeItem(STORAGE_KEY);
    await clearAllMediaFromDB();
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  return { ...defaultBirthdayData };
};

// Generate Full Shareable Link
export const getShareableUrl = (data) => {
  if (typeof window === 'undefined') return '';
  const encoded = encodeDataForUrl(data);
  const baseUrl = `${window.location.origin}${window.location.pathname.replace('/edit', '')}`;
  return `${baseUrl}?data=${encoded}`;
};

// Download configuration as JSON file
export const exportConfigToJson = (data) => {
  if (typeof window === 'undefined') return;
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `birthday-config-${(data.recipientName || 'custom').toLowerCase().replace(/\s+/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
