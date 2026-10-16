export type PlatformInfo = {
  isIOS: boolean;
  isIOSSafari: boolean;
  isAndroid: boolean;
};

const getUserAgent = () => {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent ?? "";
};

const isIOSDevice = (ua: string) => {
  // iPadOS 13+ may report as Macintosh but has touch points.
  const isClassicIOS = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS =
    /Macintosh/.test(ua) &&
    typeof navigator !== "undefined" &&
    typeof (navigator as Navigator).maxTouchPoints === "number" &&
    (navigator as Navigator).maxTouchPoints > 1;

  return isClassicIOS || isIPadOS;
};

const isSafariOnIOS = (ua: string) => {
  if (!isIOSDevice(ua)) return false;

  // iOS browsers use different UA markers.
  // Safari: has 'Safari' but not 'CriOS'/'FxiOS'/'OPiOS'/'EdgiOS'
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
  return isSafari;
};

export const getPlatformInfo = (): PlatformInfo => {
  const ua = getUserAgent();
  return {
    isIOS: isIOSDevice(ua),
    isIOSSafari: isSafariOnIOS(ua),
    isAndroid: /Android/.test(ua),
  };
};

export const isSecureContextForGeolocation = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};
