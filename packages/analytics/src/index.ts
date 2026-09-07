/**
 * Analytics adapter stub.
 *
 * The concrete provider is selected via the ANALYTICS_PROVIDER env var.
 * Currently only "none" is implemented — add real adapters as needed.
 */

type EventProperties = Record<string, string | number | boolean>;

const provider = process.env.ANALYTICS_PROVIDER ?? 'none';

export function trackEvent(name: string, properties?: EventProperties): void {
  if (provider === 'none') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics:stub]', name, properties);
    }
    return;
  }
  // Future: dispatch to real provider
  console.warn(`[analytics] Unknown provider: ${provider}`);
}

export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}
