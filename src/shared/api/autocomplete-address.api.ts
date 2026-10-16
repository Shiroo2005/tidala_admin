import type { IGoongAutocompleteResponse } from "../types/goong.type";
import { seedDatabase } from "@/demo/fixtures";
export interface GoongAutocompleteLocation {
    lat: number;
    lng: number;
}
export interface AutocompleteAddressOptions {
    limit?: number;
    radius?: number;
    location?: GoongAutocompleteLocation;
    origin?: GoongAutocompleteLocation;
    moreCompound?: boolean;
    hasDeprecatedAdministrativeUnit?: boolean;
}
export const autocompleteAddress = async (query: string, options?: AutocompleteAddressOptions): Promise<IGoongAutocompleteResponse> => ({
    status: "OK", predictions: seedDatabase().centers.filter(c => (c.name + c.address).toLocaleLowerCase().includes(query.toLocaleLowerCase())).slice(0, options?.limit ?? 10).map(c => ({ description: c.address, place_id: c.id, structured_formatting: { main_text: c.name, secondary_text: c.address } })),
});
