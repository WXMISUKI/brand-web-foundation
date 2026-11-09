export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      ok: true,
      service: "fertilizer-guide",
      environment: process.env.NODE_ENV || "development",
      database: process.env.PAYLOAD_DATABASE || "sqlite",
      catalogSource: process.env.CATALOG_SOURCE || "sample",
      mediaConfigured: Boolean(process.env.PAYLOAD_MEDIA_DIR),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
