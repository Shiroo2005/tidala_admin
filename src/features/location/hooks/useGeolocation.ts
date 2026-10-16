import { useContext } from "react";
import { GeolocationContext } from "@/features/location/providers/geolocationContext";

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);

  if (!context) {
    throw new Error("useGeolocation must be used within GeolocationProvider");
  }

  return context;
};
