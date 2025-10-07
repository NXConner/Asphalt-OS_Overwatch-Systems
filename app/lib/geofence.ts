
// Geofencing utilities

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula to calculate distance in meters
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function isPointInGeofence(
  pointLat: number,
  pointLon: number,
  fenceLat: number,
  fenceLon: number,
  fenceRadius: number // in meters
): boolean {
  const distance = calculateDistance(pointLat, pointLon, fenceLat, fenceLon);
  return distance <= fenceRadius;
}

export interface GeofenceCheck {
  isInside: boolean;
  distance: number;
  geofenceId: string;
  geofenceName: string;
}

export function checkGeofences(
  userLat: number,
  userLon: number,
  geofences: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
  }>
): GeofenceCheck[] {
  return geofences.map(fence => ({
    isInside: isPointInGeofence(userLat, userLon, fence.latitude, fence.longitude, fence.radius),
    distance: calculateDistance(userLat, userLon, fence.latitude, fence.longitude),
    geofenceId: fence.id,
    geofenceName: fence.name,
  }));
}

export function calculateTotalDistance(locations: Array<{ latitude: number; longitude: number }>): number {
  if (locations.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < locations.length; i++) {
    totalDistance += calculateDistance(
      locations[i - 1].latitude,
      locations[i - 1].longitude,
      locations[i].latitude,
      locations[i].longitude
    );
  }

  // Convert to miles
  return totalDistance * 0.000621371;
}
