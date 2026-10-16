import { createContext } from "react";
import type { GeolocationContextValue } from "@/features/location/types/location.type";

export const GeolocationContext = createContext<GeolocationContextValue | null>(
  null,
);
