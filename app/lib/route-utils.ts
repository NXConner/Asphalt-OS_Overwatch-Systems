
/**
 * Route Utilities
 * 
 * Provides utilities for route encoding, decoding, and optimization
 * using Google Maps Polyline Codec
 */

import { encode, decode } from '@googlemaps/polyline-codec';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface EncodedRoute {
  encoded: string;
  distance?: number;
  duration?: number;
  waypoints?: RoutePoint[];
}

/**
 * Encode a route path as a polyline string
 * @param path Array of lat/lng coordinates
 * @returns Encoded polyline string
 */
export function encodeRoutePath(path: RoutePoint[]): string {
  const coords: [number, number][] = path.map(p => [p.lat, p.lng]);
  return encode(coords, 5); // Precision 5 is standard for Google Maps
}

/**
 * Decode a polyline string to an array of coordinates
 * @param encoded Encoded polyline string
 * @returns Array of lat/lng coordinates
 */
export function decodeRoutePath(encoded: string): RoutePoint[] {
  const coords = decode(encoded, 5);
  return coords.map(([lat, lng]) => ({ lat, lng }));
}

/**
 * Calculate the total distance of a route
 * @param path Array of lat/lng coordinates
 * @returns Total distance in meters
 */
export function calculateRouteDistance(path: RoutePoint[]): number {
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    totalDistance += calculateDistance(from, to);
  }
  
  return totalDistance;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param from Starting point
 * @param to Ending point
 * @returns Distance in meters
 */
export function calculateDistance(from: RoutePoint, to: RoutePoint): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (from.lat * Math.PI) / 180;
  const φ2 = (to.lat * Math.PI) / 180;
  const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
  const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Simplify a route path by removing redundant points
 * @param path Array of lat/lng coordinates
 * @param tolerance Tolerance in meters (higher = more aggressive simplification)
 * @returns Simplified path
 */
export function simplifyRoutePath(
  path: RoutePoint[],
  tolerance: number = 10
): RoutePoint[] {
  if (path.length <= 2) return path;

  // Douglas-Peucker algorithm
  let maxDistance = 0;
  let maxIndex = 0;

  const first = path[0];
  const last = path[path.length - 1];

  for (let i = 1; i < path.length - 1; i++) {
    const distance = perpendicularDistance(path[i], first, last);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = simplifyRoutePath(path.slice(0, maxIndex + 1), tolerance);
    const right = simplifyRoutePath(path.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

/**
 * Calculate perpendicular distance from a point to a line
 */
function perpendicularDistance(
  point: RoutePoint,
  lineStart: RoutePoint,
  lineEnd: RoutePoint
): number {
  const dx = lineEnd.lng - lineStart.lng;
  const dy = lineEnd.lat - lineStart.lat;

  const numerator = Math.abs(
    dy * point.lng - dx * point.lat + lineEnd.lng * lineStart.lat - lineEnd.lat * lineStart.lng
  );
  const denominator = Math.sqrt(dx * dx + dy * dy);

  return numerator / denominator;
}

/**
 * Optimize the order of waypoints for minimum travel distance
 * @param origin Starting point
 * @param destination End point
 * @param waypoints Array of intermediate waypoints
 * @returns Optimized waypoint order
 */
export function optimizeWaypointOrder(
  origin: RoutePoint,
  destination: RoutePoint,
  waypoints: RoutePoint[]
): RoutePoint[] {
  if (waypoints.length <= 1) return waypoints;

  // Simple greedy nearest-neighbor algorithm
  const optimized: RoutePoint[] = [];
  const remaining = [...waypoints];
  let current = origin;

  while (remaining.length > 0) {
    let nearest = 0;
    let minDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(current, remaining[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = i;
      }
    }

    const next = remaining.splice(nearest, 1)[0];
    optimized.push(next);
    current = next;
  }

  return optimized;
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "1.5 mi" or "500 ft")
 */
export function formatDistance(meters: number): string {
  const feet = meters * 3.28084;
  
  if (feet < 1000) {
    return `${Math.round(feet)} ft`;
  }
  
  const miles = feet / 5280;
  return `${miles.toFixed(1)} mi`;
}

/**
 * Format duration for display
 * @param seconds Duration in seconds
 * @returns Formatted string (e.g., "1h 30m" or "45m")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

/**
 * Store route in database format
 * @param path Array of lat/lng coordinates
 * @param metadata Additional route metadata
 * @returns Serialized route object
 */
export function serializeRoute(
  path: RoutePoint[],
  metadata?: {
    distance?: number;
    duration?: number;
    vehicleId?: string;
    timestamp?: Date;
  }
): EncodedRoute {
  return {
    encoded: encodeRoutePath(path),
    distance: metadata?.distance ?? calculateRouteDistance(path),
    duration: metadata?.duration,
    waypoints: path,
  };
}

/**
 * Restore route from database format
 * @param route Serialized route object
 * @returns Decoded route path
 */
export function deserializeRoute(route: EncodedRoute): RoutePoint[] {
  if (route.waypoints && route.waypoints.length > 0) {
    return route.waypoints;
  }
  return decodeRoutePath(route.encoded);
}

/**
 * Convert route to Google Maps DirectionsResult format
 */
export function routeToDirectionsPath(
  route: RoutePoint[]
): google.maps.LatLng[] {
  return route.map((point) => new google.maps.LatLng(point.lat, point.lng));
}
