import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function checkPostgresSocket(connectionString: string) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    try {
      const url = new URL(connectionString);
      const socket = net.createConnection({ host: url.hostname, port: Number(url.port) || 5432 });
      socket.setTimeout(1500);
      socket.once("connect", () => { socket.destroy(); finish(true); });
      socket.once("timeout", () => { socket.destroy(); finish(false); });
      socket.once("error", () => { socket.destroy(); finish(false); });
    } catch {
      finish(false);
    }
  });
}

async function checkDatabase() {
  if ((process.env.PAYLOAD_DATABASE || "sqlite") === "postgres") {
    const connectionString = process.env.DATABASE_URL;
    return Boolean(connectionString && await checkPostgresSocket(connectionString));
  }
  const configured = process.env.PAYLOAD_SQLITE_URL || "file:.local/payload.sqlite";
  const filePath = configured.startsWith("file:") ? configured.slice(5).split("?")[0] : configured;
  await fs.access(path.resolve(filePath), fs.constants.R_OK | fs.constants.W_OK);
  return true;
}

async function checkMediaDirectory() {
  const mediaDir = path.resolve(/* turbopackIgnore: true */ process.env.PAYLOAD_MEDIA_DIR || path.join(process.cwd(), ".local", "media"));
  await fs.access(mediaDir, fs.constants.R_OK | fs.constants.W_OK);
  return true;
}

export async function GET() {
  const checks = {
    database: false,
    media: false,
  };

  try {
    checks.database = await checkDatabase();
  } catch (error) {
    console.error("[ready] database connectivity check failed", error instanceof Error ? error.message : String(error));
  }

  try {
    checks.media = await checkMediaDirectory();
  } catch (error) {
    console.error("[ready] media check failed", error instanceof Error ? error.message : String(error));
  }

  const ok = checks.database && checks.media;
  return Response.json(
    {
      ok,
      service: "fertilizer-guide",
      checks,
    },
    {
      status: ok ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
