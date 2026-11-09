import { headers } from "next/headers";

/** Render the current public path as canonical, excluding search parameters. */
export async function CanonicalLink({ fallbackPath = "/en" }: { fallbackPath?: string }) {
  const requestHeaders = await headers();
  const forwardedUri = requestHeaders.get("x-forwarded-uri")?.split("?", 1)[0];
  const path = forwardedUri && forwardedUri.startsWith("/") ? forwardedUri : fallbackPath;
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "www.kowloonglobaltrading.com";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "https";
  return <link rel="canonical" href={`${proto}://${host}${path}`} />;
}
