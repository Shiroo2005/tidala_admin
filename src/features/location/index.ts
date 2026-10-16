export { GeolocationProvider } from "@/features/location/providers/geolocationProvider";
export { useGeolocation } from "@/features/location/hooks/useGeolocation";

export {
  calculateDistanceKm,
  sortByDistanceFrom,
} from "@/features/location/services/geolocation.service";
export { reverseGeocodeFromLatLng } from "@/features/location/services/geocode.service";

export type {
  DistanceResult,
  DistanceSource,
  GeolocationContextValue,
  GeolocationError,
  GeolocationErrorCode,
  GeolocationLifecycleState,
  GeolocationPermissionState,
  GeolocationState,
  GeoCoordinates,
  GoongReverseGeocodeCompound,
  GoongReverseGeocodeResponse,
  GoongReverseGeocodeResult,
  Location,
  RequestLocationOptions,
  ResolvedAddressFromCoordinates,
  UserLocation,
} from "@/features/location/types/location.type";
