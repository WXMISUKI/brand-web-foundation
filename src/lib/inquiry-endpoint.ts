import { NextResponse } from "next/server";
import { defaultLocale, getLocale } from "../i18n/locales";
import { getAppPayload } from "./payload";

const noStore = { "Cache-Control": "no-store" };
const text = (value: unknown, max: number) => typeof value === "string" && value.trim().length <= max ? value.trim() : "";

export async function handleInquiryPost(request: Request) {
  if (process.env.INQUIRY_MODE !== "enabled") return NextResponse.json({ ok: false, code: "inquiry_disabled" }, { status: 503, headers: noStore });
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400, headers: noStore });
  }
  if (text(body.website, 200)) return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400, headers: noStore });
  const name = text(body.name, 120), email = text(body.email, 320), message = text(body.message, 4000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message || body.consent !== true) return NextResponse.json({ ok: false, code: "validation_failed" }, { status: 400, headers: noStore });
  const localeInput = text(body.locale, 20);
  const locale = getLocale(localeInput)?.code ?? defaultLocale;
  const sourcePath = text(body.sourcePath, 300) || null;
  const payload = await getAppPayload();
  try {
    const inquiry = await payload.create({ collection: "inquiries", data: {
      name, email, country: text(body.country, 120) || undefined, phone: text(body.phone, 80) || undefined,
      role: text(body.role, 120) || undefined, message, locale, sourcePath, consent: true, status: "new",
    }, overrideAccess: true });
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ ok: false, code: "inquiry_unavailable" }, { status: 503, headers: noStore });
  }
}
