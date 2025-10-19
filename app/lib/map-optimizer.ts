
/**
 * Map Performance Optimization Utilities
 * Debouncing, throttling, and viewport optimization for Google Maps
 */

/**
 * Debounce function for reducing map event frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for limiting map event frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Calculate if a marker is within the visible viewport
 */
export function isMarkerInViewport(
  marker: { lat: number; lng: number },
  bounds: google.maps.LatLngBounds
): boolean {
  const markerLatLng = new google.maps.LatLng(marker.lat, marker.lng);
  return bounds.contains(markerLatLng);
}

/**
 * Filter markers by viewport for performance
 */
export function filterMarkersByViewport<T extends { latitude: number; longitude: number }>(
  markers: T[],
  map: google.maps.Map
): T[] {
  const bounds = map.getBounds();
  if (!bounds) return markers;

  return markers.filter(marker =>
    isMarkerInViewport(
      { lat: marker.latitude, lng: marker.longitude },
      bounds
    )
  );
}

/**
 * Calculate optimal zoom level for clustering
 */
export function getOptimalClusterZoom(markerCount: number): number {
  if (markerCount < 10) return 15;
  if (markerCount < 50) return 13;
  if (markerCount < 100) return 11;
  if (markerCount < 500) return 9;
  return 7;
}

/**
 * Batch marker updates for better performance
 */
export class MarkerBatchUpdater {
  private markers: google.maps.Marker[] = [];
  private updateTimeout: NodeJS.Timeout | null = null;
  private readonly batchDelay: number;

  constructor(batchDelay: number = 100) {
    this.batchDelay = batchDelay;
  }

  /**
   * Add marker to batch update queue
   */
  addMarker(marker: google.maps.Marker): void {
    this.markers.push(marker);
    this.scheduleUpdate();
  }

  /**
   * Schedule batch update
   */
  private scheduleUpdate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.flushUpdates();
    }, this.batchDelay);
  }

  /**
   * Execute all pending marker updates
   */
  private flushUpdates(): void {
    // Process all markers in batch
    this.markers.forEach(marker => {
      // Marker operations here
    });

    this.markers = [];
    this.updateTimeout = null;
  }

  /**
   * Clear pending updates
   */
  clear(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    this.markers = [];
  }
}

/**
 * Optimize polyline rendering
 */
export function simplifyPolyline(
  path: google.maps.LatLng[],
  tolerance: number = 0.0001
): google.maps.LatLng[] {
  if (path.length < 3) return path;

  // Douglas-Peucker algorithm for line simplification
  const douglasPeucker = (
    points: google.maps.LatLng[],
    tolerance: number
  ): google.maps.LatLng[] => {
    if (points.length <= 2) return points;

    let maxDistance = 0;
    let index = 0;

    const start = points[0];
    const end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }

    if (maxDistance > tolerance) {
      const left = douglasPeucker(points.slice(0, index + 1), tolerance);
      const right = douglasPeucker(points.slice(index), tolerance);
      return left.slice(0, -1).concat(right);
    } else {
      return [start, end];
    }
  };

  return douglasPeucker(path, tolerance);
}

/**
 * Calculate perpendicular distance from point to line
 */
function perpendicularDistance(
  point: google.maps.LatLng,
  lineStart: google.maps.LatLng,
  lineEnd: google.maps.LatLng
): number {
  const lat1 = lineStart.lat();
  const lng1 = lineStart.lng();
  const lat2 = lineEnd.lat();
  const lng2 = lineEnd.lng();
  const lat0 = point.lat();
  const lng0 = point.lng();

  const numerator = Math.abs(
    (lat2 - lat1) * (lng1 - lng0) - (lat1 - lat0) * (lng2 - lng1)
  );
  const denominator = Math.sqrt(
    Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
  );

  return numerator / denominator;
}

/**
 * Manage map idle state for performance
 */
export class MapIdleManager {
  private map: google.maps.Map;
  private idleListener: google.maps.MapsEventListener | null = null;
  private callback: () => void;

  constructor(map: google.maps.Map, callback: () => void) {
    this.map = map;
    this.callback = callback;
    this.setupListener();
  }

  private setupListener(): void {
    this.idleListener = google.maps.event.addListener(
      this.map,
      'idle',
      debounce(this.callback, 300)
    );
  }

  destroy(): void {
    if (this.idleListener) {
      google.maps.event.removeListener(this.idleListener);
      this.idleListener = null;
    }
  }
}
