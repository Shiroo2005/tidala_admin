import type {
  DistanceResult,
  DistanceSource,
  GeolocationError,
  GeolocationPermissionState,
  RequestLocationOptions,
  UserLocation,
} from "@/features/location/types/location.type";
import {
  getPlatformInfo,
  isSecureContextForGeolocation,
} from "@/features/location/utils/platform";

const LOCATION_STORAGE_KEY = "user_geolocation_last_known";

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;

const normalizePermissionState = (
  value: PermissionState,
): GeolocationPermissionState => {
  if (value === "granted") return "granted";
  if (value === "prompt") return "prompt";
  if (value === "denied") return "denied";
  return "unknown";
};

const mapPositionError = (
  error: GeolocationPositionError,
): GeolocationError => {
  const { isIOSSafari } = getPlatformInfo();
  const isSecureContext = isSecureContextForGeolocation();

  if (error.code === error.PERMISSION_DENIED) {
    const message = isIOSSafari
      ? "Bạn đã từ chối quyền vị trí. iPhone (Safari): Settings > Safari > Privacy > Vị trí."
      : "Bạn đã từ chối quyền vị trí. Hãy bật lại trong cài đặt trình duyệt (Site settings > Location).";
    return {
      code: "PERMISSION_DENIED",
      message,
    };
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    let message = "Location information is unavailable.";
    if (isIOSSafari && !isSecureContext) {
      message =
        "iPhone (Safari) yêu cầu HTTPS để lấy vị trí. Sử dụng localhost hoặc HTTPS URL.";
    }
    return {
      code: "POSITION_UNAVAILABLE",
      message,
    };
  }

  if (error.code === error.TIMEOUT) {
    return {
      code: "TIMEOUT",
      message: "Timed out while trying to get location. Vui lòng thử lại.",
    };
  }

  return {
    code: "UNKNOWN",
    message: "Failed to retrieve location.",
  };
};

export const isGeolocationSupported = () => {
  return typeof window !== "undefined" && "geolocation" in navigator;
};

export const isPermissionApiSupported = () => {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "permissions" in navigator
  );
};

export const getGeolocationPermission =
  async (): Promise<GeolocationPermissionState> => {
    if (!isGeolocationSupported()) {
      return "unsupported";
    }

    if (!isPermissionApiSupported()) {
      return "unknown";
    }

    try {
      const status = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });
      return normalizePermissionState(status.state);
    } catch {
      return "unknown";
    }
  };

export const getCurrentLocation = (
  options?: RequestLocationOptions,
): Promise<UserLocation> => {
  if (!isGeolocationSupported()) {
    return Promise.reject<never>({
      code: "UNSUPPORTED",
      message: "Geolocation is not supported in this browser.",
    } satisfies GeolocationError);
  }

  const timeout =
    options?.timeout ?? (getPlatformInfo().isIOSSafari ? 20000 : 10000);
  // Allow cached location by default for better iOS reliability.
  // Callers can pass maximumAge: 0 when they truly need a fresh fix.
  const maximumAge = options?.maximumAge ?? 60000;
  const enableHighAccuracy = options?.enableHighAccuracy ?? true;

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(mapPositionError(error));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    );
  });
};

export const readStoredLocation = (): UserLocation | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as UserLocation;
    const hasRequiredShape =
      typeof parsed?.lat === "number" &&
      typeof parsed?.lng === "number" &&
      typeof parsed?.timestamp === "number";

    if (!hasRequiredShape) {
      window.localStorage.removeItem(LOCATION_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(LOCATION_STORAGE_KEY);
    return null;
  }
};

export const saveLocation = (location: UserLocation) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
};

export const clearStoredLocation = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCATION_STORAGE_KEY);
};

export const calculateDistanceKm = (
  from: DistanceSource,
  to: DistanceSource,
): number => {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);

  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const sortByDistanceFrom = <T>(
  items: T[],
  from: DistanceSource,
  getCoordinates: (item: T) => DistanceSource | null | undefined,
): DistanceResult<T>[] => {
  return items
    .map((item) => {
      const coords = getCoordinates(item);
      if (!coords) {
        return null;
      }

      return {
        item,
        distanceKm: calculateDistanceKm(from, coords),
      } satisfies DistanceResult<T>;
    })
    .filter((value): value is DistanceResult<T> => value !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);
};
