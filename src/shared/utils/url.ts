/**
 * Helper to format image URLs
 * Prepends the storage prefix if the URL is a relative path (objectKey)
 */
export const getStorageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // If it's already a full URL (http, https) or a blob URL (blob:), return as is
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  // Prepend prefix from env
  const prefix = import.meta.env.VITE_IMAGE_URL_PREFIX || "";
  
  // Ensure we don't have double slashes if prefix ends with / and url starts with /
  const cleanPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;

  return `${cleanPrefix}${cleanUrl}`;
};
