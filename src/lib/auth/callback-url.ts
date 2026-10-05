export function getAuthCallbackUrl(params: Record<string, string> = {}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const callbackUrl = new URL("/auth/callback", appUrl);

  for (const [key, value] of Object.entries(params)) {
    callbackUrl.searchParams.set(key, value);
  }

  return callbackUrl.toString();
}