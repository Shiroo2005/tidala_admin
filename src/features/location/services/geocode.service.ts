import type {
  GoongReverseGeocodeResponse,
  ResolvedAddressFromCoordinates,
} from "@/features/location/types/location.type";

const GOONG_GEOCODE_ENDPOINT = "https://rsapi.goong.io/v2/geocode";

const normalizeGoongAddress = (
  payload: GoongReverseGeocodeResponse,
): ResolvedAddressFromCoordinates | null => {
  const firstResult = payload.results?.[0];
  if (!firstResult) {
    return null;
  }

  const compound = firstResult.compound ?? firstResult.deprecated_compound;

  return {
    province: compound?.province,
    district: compound?.district ?? compound?.commune,
    address: firstResult.address ?? firstResult.formatted_address,
    formattedAddress: firstResult.formatted_address,
  };
};

export const reverseGeocodeFromLatLng = async (
  lat: number,
  lng: number,
): Promise<ResolvedAddressFromCoordinates | null> => {
  const apiKey = import.meta.env.VITE_GOONG_API_KEY;

  if (!apiKey) {
    return null;
  }

  const query = new URLSearchParams({
    latlng: `${lat},${lng}`,
    limit: "1",
    api_key: apiKey,
    has_deprecated_administrative_unit: "true",
  });

  const response = await fetch(`${GOONG_GEOCODE_ENDPOINT}?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to reverse geocode coordinates via Goong.");
  }

  const data = (await response.json()) as GoongReverseGeocodeResponse;
  return normalizeGoongAddress(data);
};
