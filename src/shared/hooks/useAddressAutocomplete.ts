import { useQuery } from "@tanstack/react-query";
import { autocompleteAddress } from "@/shared/api/autocomplete-address.api";
import type { AutocompleteAddressOptions } from "@/shared/api/autocomplete-address.api";
import { useGeolocation } from "@/features/location";

type UseAddressAutocompleteOptions = Omit<
  AutocompleteAddressOptions,
  "location" | "origin"
> & {
  preferNearby?: boolean;
};

export const useAddressAutocomplete = (
  query: string,
  enabled: boolean = true,
  options?: UseAddressAutocompleteOptions,
) => {
  const { location } = useGeolocation();

  const locationParams =
    options?.preferNearby === false || !location
      ? undefined
      : {
          lat: location.lat,
          lng: location.lng,
        };

  return useQuery({
    queryKey: [
      "addressAutocomplete",
      query,
      locationParams?.lat ?? null,
      locationParams?.lng ?? null,
      options?.radius ?? 50,
      options?.limit ?? 10,
      options?.moreCompound ?? true,
      options?.hasDeprecatedAdministrativeUnit ?? true,
      options?.preferNearby ?? true,
    ],
    queryFn: () =>
      autocompleteAddress(query, {
        ...options,
        radius: options?.radius ?? 50,
        location: locationParams,
        origin: locationParams,
      }),
    enabled: enabled && query.trim().length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
