import { GeolocationProvider } from "@/features/location";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth/providers/authProvider";
import { OverlayProvider } from "@/shared/ui/overlay/OverlayProvider";
import { router } from "@/routes/index.route";
export default function App() {
    return <OverlayProvider><GeolocationProvider><AuthProvider><RouterProvider router={router}/></AuthProvider></GeolocationProvider></OverlayProvider>;
}
