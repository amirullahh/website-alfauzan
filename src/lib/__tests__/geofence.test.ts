import {
  haversineDistance,
  checkGeofence,
  DEFAULT_PONDOK_LAT,
  DEFAULT_PONDOK_LNG,
  DEFAULT_GEOFENCE_RADIUS,
} from "../geofence";

describe("haversineDistance", () => {
  it("returns 0 for same coordinates", () => {
    expect(haversineDistance(0, 0, 0, 0)).toBe(0);
  });

  it("calculates correct distance for known points", () => {
    // Approximate distance between Jakarta (-6.2, 106.8) and Bogor (-6.6, 106.8)
    const distance = haversineDistance(-6.2, 106.8, -6.6, 106.8);
    expect(distance).toBeGreaterThan(44000);
    expect(distance).toBeLessThan(45000);
  });

  it("calculates small distances accurately", () => {
    // Points ~100m apart
    const distance = haversineDistance(
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_PONDOK_LAT + 0.0009,
      DEFAULT_PONDOK_LNG
    );
    expect(distance).toBeGreaterThan(90);
    expect(distance).toBeLessThan(110);
  });
});

describe("checkGeofence", () => {
  it("returns withinRadius=true when inside default radius", () => {
    const result = checkGeofence(
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_GEOFENCE_RADIUS
    );
    expect(result.withinRadius).toBe(true);
    expect(result.distance).toBe(0);
  });

  it("returns withinRadius=true when near edge of radius", () => {
    const result = checkGeofence(
      DEFAULT_PONDOK_LAT + 0.0007,
      DEFAULT_PONDOK_LNG,
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_GEOFENCE_RADIUS
    );
    expect(result.withinRadius).toBe(true);
    expect(result.distance).toBeGreaterThan(0);
    expect(result.distance).toBeLessThan(DEFAULT_GEOFENCE_RADIUS);
  });

  it("returns withinRadius=false when outside radius", () => {
    const result = checkGeofence(
      DEFAULT_PONDOK_LAT + 0.002,
      DEFAULT_PONDOK_LNG,
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_GEOFENCE_RADIUS
    );
    expect(result.withinRadius).toBe(false);
    expect(result.distance).toBeGreaterThan(DEFAULT_GEOFENCE_RADIUS);
  });

  it("includes accuracy in result", () => {
    const result = checkGeofence(
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_PONDOK_LAT,
      DEFAULT_PONDOK_LNG,
      DEFAULT_GEOFENCE_RADIUS,
      10
    );
    expect(result.accuracy).toBe(10);
  });
});
