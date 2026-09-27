/**
 * Haversine formula to calculate distance between two coordinates in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export interface GeofenceCheckResult {
  withinRadius: boolean;
  distance: number; // in meters
  accuracy: number | null;
}

export function checkGeofence(
  userLat: number,
  userLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeter: number,
  accuracy: number | null = null
): GeofenceCheckResult {
  const distance = haversineDistance(userLat, userLng, centerLat, centerLng);
  return {
    withinRadius: distance <= radiusMeter,
    distance: Math.round(distance),
    accuracy,
  };
}

// Default pondok location from PRD §2
export const DEFAULT_PONDOK_LAT = -6.3167507;
export const DEFAULT_PONDOK_LNG = 106.8494846;
export const DEFAULT_GEOFENCE_RADIUS = 100; // meters
