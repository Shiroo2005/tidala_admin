import { useCallback, useSyncExternalStore } from 'react';
import { BREAKPOINTS } from '@/shared/constants/breakpoints';
export const DESKTOP_BREAKPOINT = BREAKPOINTS.desktop;
export const useIsDesktop = (breakpoint: number = DESKTOP_BREAKPOINT) => {
    const subscribe = useCallback((callback: () => void) => {
        const query = window.matchMedia(`(min-width: ${breakpoint}px)`);
        query.addEventListener('change', callback);
        return () => query.removeEventListener('change', callback);
    }, [breakpoint]);
    return useSyncExternalStore(subscribe, () => window.matchMedia(`(min-width: ${breakpoint}px)`).matches, () => false);
};
export default useIsDesktop;
