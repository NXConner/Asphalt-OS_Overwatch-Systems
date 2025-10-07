
// AI-powered asphalt surface detection using map imagery
// This would integrate with a vision AI model in production

export interface DetectedSurface {
  id: string;
  type: 'PARKING_LOT' | 'DRIVEWAY' | 'ROAD' | 'WALKWAY' | 'UNKNOWN';
  confidence: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  vertices: Array<{ lat: number; lng: number }>;
  measurements: {
    area: number; // square feet
    perimeter: number; // feet
    length?: number; // feet
    width?: number; // feet
  };
  center: { lat: number; lng: number };
}

export interface SurfaceAnalysisResult {
  surfaces: DetectedSurface[];
  totalArea: number;
  confidence: number;
  processingTime: number;
}

// Mock AI detection - In production, this would call a vision AI service
export async function detectAsphaltSurfaces(
  lat: number,
  lng: number,
  zoom: number = 20
): Promise<SurfaceAnalysisResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock detection result
  // In production, this would analyze satellite/aerial imagery
  const mockSurface: DetectedSurface = {
    id: `surface_${Date.now()}`,
    type: 'PARKING_LOT',
    confidence: 0.85,
    bounds: {
      north: lat + 0.0001,
      south: lat - 0.0001,
      east: lng + 0.0001,
      west: lng - 0.0001,
    },
    vertices: [
      { lat: lat + 0.0001, lng: lng - 0.0001 },
      { lat: lat + 0.0001, lng: lng + 0.0001 },
      { lat: lat - 0.0001, lng: lng + 0.0001 },
      { lat: lat - 0.0001, lng: lng - 0.0001 },
    ],
    measurements: {
      area: 5000, // sq ft
      perimeter: 300, // feet
      length: 100,
      width: 50,
    },
    center: { lat, lng },
  };

  return {
    surfaces: [mockSurface],
    totalArea: 5000,
    confidence: 0.85,
    processingTime: 1500,
  };
}

// Calculate distance between two lat/lng points in feet
export function calculateDistanceInFeet(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = R * c;
  return miles * 5280; // Convert to feet
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Calculate polygon area in square feet
export function calculatePolygonArea(vertices: Array<{ lat: number; lng: number }>): number {
  if (vertices.length < 3) return 0;

  let area = 0;
  const numPoints = vertices.length;

  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    area += vertices[i].lng * vertices[j].lat;
    area -= vertices[j].lng * vertices[i].lat;
  }

  area = Math.abs(area) / 2;

  // Convert from degrees² to square feet (approximate)
  // At 40° latitude, 1 degree ≈ 69 miles ≈ 364,320 feet
  const feetPerDegree = 364320;
  return area * feetPerDegree * feetPerDegree;
}

// Calculate perimeter in feet
export function calculatePerimeter(vertices: Array<{ lat: number; lng: number }>): number {
  if (vertices.length < 2) return 0;

  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    perimeter += calculateDistanceInFeet(
      vertices[i].lat,
      vertices[i].lng,
      vertices[j].lat,
      vertices[j].lng
    );
  }

  return perimeter;
}

// Simplify polygon by removing vertices that are too close
export function simplifyPolygon(
  vertices: Array<{ lat: number; lng: number }>,
  toleranceFeet: number = 5
): Array<{ lat: number; lng: number }> {
  if (vertices.length <= 3) return vertices;

  const simplified: Array<{ lat: number; lng: number }> = [vertices[0]];

  for (let i = 1; i < vertices.length - 1; i++) {
    const dist = calculateDistanceInFeet(
      simplified[simplified.length - 1].lat,
      simplified[simplified.length - 1].lng,
      vertices[i].lat,
      vertices[i].lng
    );

    if (dist > toleranceFeet) {
      simplified.push(vertices[i]);
    }
  }

  simplified.push(vertices[vertices.length - 1]);
  return simplified;
}

// Detect if polygon is roughly rectangular and calculate dimensions
export function detectRectangularDimensions(
  vertices: Array<{ lat: number; lng: number }>
): { length: number; width: number } | null {
  if (vertices.length !== 4 && vertices.length !== 5) return null;

  const sides = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    sides.push(
      calculateDistanceInFeet(
        vertices[i].lat,
        vertices[i].lng,
        vertices[j].lat,
        vertices[j].lng
      )
    );
  }

  // Check if opposite sides are similar (roughly rectangular)
  const tolerance = 0.1; // 10% tolerance
  if (
    Math.abs(sides[0] - sides[2]) / Math.max(sides[0], sides[2]) < tolerance &&
    Math.abs(sides[1] - sides[3]) / Math.max(sides[1], sides[3]) < tolerance
  ) {
    const length = Math.max(sides[0], sides[1]);
    const width = Math.min(sides[0], sides[1]);
    return { length, width };
  }

  return null;
}
