import type { ReactNode } from 'react';
import { GeolocationContext } from './geolocationContext';
// Deterministic demo location; no browser permission or external geocoding required.
export const GeolocationProvider = ({ children }: {
    children: ReactNode;
}) => <GeolocationContext.Provider value={{
        permission: 'granted', status: 'ready', location: { lat: 10.78, lng: 106.69, province: 'TP. Hồ Chí Minh', district: 'Bình Thạnh', timestamp: 1790928000000 }, error: null, lastUpdatedAt: 1790928000000, hasHydrated: true,
        requestPermissionAndLocate: async () => { }, refreshPermission: async () => { }, clearLocation: () => { },
    }}>{children}</GeolocationContext.Provider>;
