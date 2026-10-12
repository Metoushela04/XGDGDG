import "server-only";

/** Current wall-clock time for server-side subscription checks. */
export function serverNow(): number {
  return Date.now();
}
