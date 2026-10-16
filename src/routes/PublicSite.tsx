import { useLocation } from "react-router-dom";
import { useEffect } from "react";
export function PublicSite() {
    const location = useLocation();
    useEffect(() => { window.location.assign(new URL(location.pathname + location.search, import.meta.env.VITE_PUBLIC_SITE_URL || "https://tidala.vn").href); }, [location]);
    return null;
}
