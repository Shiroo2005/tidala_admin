export type GeolocationPermissionState =
  | "unknown"
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported";

export type GeolocationLifecycleState =
  | "idle"
  | "requesting-permission"
  | "locating"
  | "blocked"
  | "ready"
  | "error";

export type GeolocationErrorCode =
  | "UNSUPPORTED"
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export interface GeoCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface UserLocation extends GeoCoordinates {
  province?: string;
  district?: string;
  address?: string;
  timestamp: number;
}

export interface GeolocationError {
  code: GeolocationErrorCode;
  message: string;
}

export interface GeolocationState {
  permission: GeolocationPermissionState;
  status: GeolocationLifecycleState;
  location: UserLocation | null;
  error: GeolocationError | null;
  lastUpdatedAt: number | null;
  hasHydrated: boolean;
}

export interface RequestLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationContextValue extends GeolocationState {
  requestPermissionAndLocate: (
    options?: RequestLocationOptions,
  ) => Promise<void>;
  refreshPermission: () => Promise<void>;
  clearLocation: () => void;
}

export interface DistanceSource {
  latitude: number;
  longitude: number;
}

export interface DistanceResult<T> {
  item: T;
  distanceKm: number;
}

export interface GoongReverseGeocodeCompound {
  district?: string;
  commune?: string;
  province?: string;
}

export interface GoongReverseGeocodeResult {
  formatted_address?: string;
  compound?: GoongReverseGeocodeCompound;
  deprecated_compound?: GoongReverseGeocodeCompound;
  address?: string;
}

export interface GoongReverseGeocodeResponse {
  results: GoongReverseGeocodeResult[];
}

export interface ResolvedAddressFromCoordinates {
  province?: string;
  district?: string;
  address?: string;
  formattedAddress?: string;
}

// Backward-compatibility alias for older imports.
export type Location = UserLocation;
