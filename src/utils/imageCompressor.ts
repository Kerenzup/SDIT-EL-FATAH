/**
 * Helper utility to compress and resize images on the client side using HTML5 Canvas.
 * This prevents browser memory overload, DOM freeze, and LocalStorage QuotaExceededError
 * when users upload high-resolution photos (e.g., 5MB - 15MB) from mobile/cameras.
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const compressImageFile = (
  file: File,
  options: CompressOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number }> => {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options;

  return new Promise((resolve) => {
    // If it's a small file or not an image, try direct reading with fallback
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = (e.target?.result as string) || '';
        resolve({ dataUrl: res, sizeBytes: file.size });
      };
      reader.onerror = () => resolve({ dataUrl: '', sizeBytes: 0 });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => resolve({ dataUrl: '', sizeBytes: 0 });
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      if (!imgSrc) {
        resolve({ dataUrl: '', sizeBytes: 0 });
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Return raw data if image parsing fails
        resolve({ dataUrl: imgSrc, sizeBytes: file.size });
      };

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio scaling
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: imgSrc, sizeBytes: file.size });
            return;
          }

          // Smooth image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG format with chosen quality
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const approxBytes = Math.round(((dataUrl.length - 22) * 3) / 4);

          resolve({ dataUrl, sizeBytes: approxBytes });
        } catch (err) {
          console.warn('Canvas compression fallback triggered:', err);
          resolve({ dataUrl: imgSrc, sizeBytes: file.size });
        }
      };

      img.src = imgSrc;
    };

    reader.readAsDataURL(file);
  });
};
