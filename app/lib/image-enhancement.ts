
/**
 * Image Enhancement Utilities
 * Canvas-based image processing for job site photos
 */

export interface EnhancementSettings {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  exposure: number; // -2 to 2
  hdr: boolean;
  denoise: boolean;
}

export const defaultEnhancementSettings: EnhancementSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  exposure: 0,
  hdr: false,
  denoise: false,
};

// Auto-enhancement preset for asphalt photography
export const asphaltPreset: EnhancementSettings = {
  brightness: 10,
  contrast: 20,
  saturation: 15,
  sharpness: 30,
  exposure: 0.3,
  hdr: true,
  denoise: true,
};

/**
 * Apply brightness and contrast adjustments
 */
function applyBrightnessContrast(
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData {
  const data = imageData.data;
  const b = (brightness / 100) * 255;
  const c = contrast / 100;
  const factor = (259 * (c * 255 + 255)) / (255 * (259 - c * 255));

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      let value = data[i + j];
      value = factor * (value - 128) + 128 + b;
      data[i + j] = Math.max(0, Math.min(255, value));
    }
  }

  return imageData;
}

/**
 * Apply saturation adjustment
 */
function applySaturation(imageData: ImageData, saturation: number): ImageData {
  const data = imageData.data;
  const sat = 1 + saturation / 100;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate luminance
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    data[i] = Math.max(0, Math.min(255, gray + (r - gray) * sat));
    data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * sat));
    data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * sat));
  }

  return imageData;
}

/**
 * Apply sharpening using unsharp mask
 */
function applySharpen(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  amount: number
): ImageData {
  if (amount === 0) return imageData;

  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const weight = amount / 100;

  return convolve(imageData, kernel, weight);
}

/**
 * 3x3 Convolution filter
 */
function convolve(
  imageData: ImageData,
  kernel: number[],
  weight: number = 1
): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = x + kx;
            const py = y + ky;
            const ki = (ky + 1) * 3 + (kx + 1);
            const pi = (py * width + px) * 4 + c;
            sum += data[pi] * kernel[ki];
          }
        }

        const original = data[(y * width + x) * 4 + c];
        const enhanced = original + (sum - original) * weight;
        output[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, enhanced));
      }
      // Preserve alpha
      output[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  const result = new ImageData(width, height);
  result.data.set(output);
  return result;
}

/**
 * Simple HDR effect using tone mapping
 */
function applyHDR(imageData: ImageData): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const value = data[i + c] / 255;
      // Reinhard tone mapping
      const enhanced = value / (1 + value);
      data[i + c] = Math.round(enhanced * 255);
    }
  }

  return imageData;
}

/**
 * Simple denoising using median filter
 */
function applyDenoise(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData
): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const values: number[] = [];
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = x + kx;
            const py = y + ky;
            values.push(data[(py * width + px) * 4 + c]);
          }
        }
        values.sort((a, b) => a - b);
        output[(y * width + x) * 4 + c] = values[4]; // Median
      }
      output[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  const result = ctx.createImageData(width, height);
  result.data.set(output);
  return result;
}

/**
 * Main enhancement function
 */
export async function enhanceImage(
  file: File,
  settings: EnhancementSettings
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set image smoothing for high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Apply fast filters first
        let filterString = '';
        if (settings.brightness !== 0) {
          filterString += `brightness(${1 + settings.brightness / 100}) `;
        }
        if (settings.contrast !== 0) {
          filterString += `contrast(${1 + settings.contrast / 100}) `;
        }
        if (settings.saturation !== 0) {
          filterString += `saturate(${1 + settings.saturation / 100}) `;
        }
        if (settings.exposure !== 0) {
          filterString += `brightness(${1 + settings.exposure}) `;
        }

        ctx.filter = filterString || 'none';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';

        // Apply pixel-level enhancements
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (settings.denoise) {
          imageData = applyDenoise(ctx, imageData);
        }

        if (settings.hdr) {
          imageData = applyHDR(imageData);
        }

        if (settings.sharpness > 0) {
          imageData = applySharpen(ctx, imageData, settings.sharpness);
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Quick auto-enhance for asphalt photos
 */
export async function autoEnhanceAsphaltPhoto(file: File): Promise<Blob> {
  return enhanceImage(file, asphaltPreset);
}
