
/**
 * Image Optimization Utilities
 * Provides image loading, optimization, and lazy loading helpers
 */

/**
 * Generate blur data URL for image placeholder
 */
export function generateBlurDataURL(width: number = 8, height: number = 8): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    // Return a simple gray placeholder for SSR
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';
  }

  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Get responsive image sizes
 */
export function getResponsiveSizes(type: 'thumbnail' | 'card' | 'hero' | 'full'): string {
  switch (type) {
    case 'thumbnail':
      return '(max-width: 640px) 100px, (max-width: 768px) 150px, 200px';
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    case 'full':
      return '(max-width: 1280px) 100vw, 1280px';
    default:
      return '100vw';
  }
}

/**
 * Lazy load images using Intersection Observer
 */
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
    }
  }

  /**
   * Observe image for lazy loading
   */
  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.images.add(img);
      this.observer.observe(img);
    }
  }

  /**
   * Load image and remove from observer
   */
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }

    if (this.observer) {
      this.observer.unobserve(img);
    }
    this.images.delete(img);
  }

  /**
   * Cleanup observer
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.images.clear();
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check for WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  return supportsWebP ? 'webp' : 'jpeg';
}

/**
 * Calculate image dimensions to maintain aspect ratio
 */
export function calculateAspectRatio(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
}
