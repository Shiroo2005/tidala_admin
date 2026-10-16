/**
 * Resolves a post-login `redirect` value (URL query param / sessionStorage,
 * both user-controllable) to a same-origin path, falling back otherwise.
 * Prevents open-redirect via absolute/protocol-relative URLs (e.g. "//evil.com").
 */
export const getSafeRedirectPath = (
  redirect: string | null | undefined,
  fallback: string,
): string => {
  if (!redirect) return fallback;
  try {
    const url = new URL(redirect, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    return `${url.pathname}${url.search}${url.hash}` || fallback;
  } catch {
    return fallback;
  }
};
