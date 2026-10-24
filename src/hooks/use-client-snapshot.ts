import { useSyncExternalStore } from 'react';

const subscribeToNothing = () => () => {};

/**
 * Reads a browser-only value. The server and the first client render use
 * `getServerSnapshot`, so hydration matches; later renders use `getSnapshot`.
 */
export function useClientSnapshot<T>(
  getSnapshot: () => T,
  getServerSnapshot: () => T,
): T {
  return useSyncExternalStore(
    subscribeToNothing,
    getSnapshot,
    getServerSnapshot,
  );
}
