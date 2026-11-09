import fs from "node:fs/promises";

const files = ["Dockerfile", "docker-compose.production.yml", ".dockerignore", "package.json", "scripts/prepare-standalone.mjs", "src/payload.config.ts", "src/migrations/index.ts"];
const errors = [];
for (const file of files) {
  try { await fs.access(file); } catch { errors.push(`${file} is missing`); }
}
const dockerfile = await fs.readFile("Dockerfile", "utf8").catch(() => "");
const compose = await fs.readFile("docker-compose.production.yml", "utf8").catch(() => "");
const nextConfig = await fs.readFile("next.config.ts", "utf8").catch(() => "");
const healthRoute = await fs.readFile("src/app/api/health/route.ts", "utf8").catch(() => "");
const readyRoute = await fs.readFile("src/app/api/ready/route.ts", "utf8").catch(() => "");
const payloadConfig = await fs.readFile("src/payload.config.ts", "utf8").catch(() => "");
const migrationIndex = await fs.readFile("src/migrations/index.ts", "utf8").catch(() => "");
const packageJson = JSON.parse(await fs.readFile("package.json", "utf8").catch(() => "{}"));
const prepareStandalone = await fs.readFile("scripts/prepare-standalone.mjs", "utf8").catch(() => "");
if (!nextConfig.includes("output: \"standalone\"")) errors.push("next.config.ts must configure standalone output");
if (!dockerfile.includes("PAYLOAD_MEDIA_DIR=/app/data/media")) errors.push("Dockerfile must configure persistent Payload media path");
if (!dockerfile.includes("DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build")) errors.push("Dockerfile builder must provide a build-only DATABASE_URL");
if (!dockerfile.includes("PAYLOAD_SECRET=build-only-secret-32-characters-minimum")) errors.push("Dockerfile builder must provide a build-only PAYLOAD_SECRET");
if (!compose.includes("postgres:17-alpine")) errors.push("Compose must pin the PostgreSQL major image");
if (!compose.includes("payload_media:") || !compose.includes("payload_postgres:")) errors.push("Compose must declare media and database volumes");
if (!healthRoute.includes("service: \"fertilizer-guide\"")) errors.push("Health route is missing");
if (!readyRoute.includes("checkDatabase") || !readyRoute.includes("checkMediaDirectory")) errors.push("Readiness route must check database and media");
if (!compose.includes("/api/ready")) errors.push("Compose must probe the readiness route");
if (!payloadConfig.includes("prodMigrations: migrations")) errors.push("Payload PostgreSQL adapter must register production migrations");
if (!migrationIndex.includes("export const migrations")) errors.push("Migration index must export the production migration list");
if (packageJson.scripts?.["prepare:standalone"] !== "node scripts/prepare-standalone.mjs") errors.push("package.json must expose prepare:standalone");
if (!prepareStandalone.includes("fs.cp") || !prepareStandalone.includes("server.js") || !prepareStandalone.includes("favicon.svg")) errors.push("Standalone preparation must copy and verify server.js, static assets and favicon");
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, files, database: "postgres:17-alpine", mediaVolume: "payload_media", migrations: "payload-prodMigrations" }, null, 2));
}
