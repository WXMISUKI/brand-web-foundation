const example = process.argv.includes("--example");
const env = example ? {
  NODE_ENV: "production",
  PAYLOAD_DATABASE: "postgres",
  DATABASE_URL: "postgresql://user:password@example.invalid:5432/fertilizer",
  PAYLOAD_SECRET: "example-production-secret-with-at-least-32-characters",
  PAYLOAD_MEDIA_DIR: "/var/lib/fertilizer/media",
  CATALOG_SOURCE: "payload",
  CROP_GUIDE_SOURCE: "payload",
} : process.env;
const errors = [];
if (env.NODE_ENV !== "production") errors.push("NODE_ENV must be production");
if (env.PAYLOAD_DATABASE !== "postgres") errors.push("PAYLOAD_DATABASE must be postgres");
if (!env.DATABASE_URL) errors.push("DATABASE_URL is required");
if (!env.PAYLOAD_SECRET || env.PAYLOAD_SECRET.length < 32) errors.push("PAYLOAD_SECRET must contain at least 32 characters");
if (!env.PAYLOAD_MEDIA_DIR) errors.push("PAYLOAD_MEDIA_DIR must point to persistent media storage");
if (env.CATALOG_SOURCE !== "payload") errors.push("CATALOG_SOURCE must be payload in production");
if (env.CROP_GUIDE_SOURCE !== "payload") errors.push("CROP_GUIDE_SOURCE must be payload in production");
if (env.INQUIRY_MODE && !["disabled", "enabled"].includes(env.INQUIRY_MODE)) errors.push("INQUIRY_MODE must be disabled or enabled");
if (env.PAYLOAD_MEDIA_DIR && !/^(?:[A-Za-z]:[\\/]|\/)/.test(env.PAYLOAD_MEDIA_DIR)) errors.push("PAYLOAD_MEDIA_DIR must be an absolute path in production");
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, database: env.PAYLOAD_DATABASE, catalogSource: env.CATALOG_SOURCE, cropGuideSource: env.CROP_GUIDE_SOURCE, inquiryMode: env.INQUIRY_MODE || "disabled", mediaConfigured: true, secretLength: env.PAYLOAD_SECRET.length, example }, null, 2));
}
