"use client";

import { useState } from "react";
import type { LocaleCode } from "../i18n/locales";

const copy = {
  en: { name: "Name", email: "Email", country: "Country or region", role: "Your role", message: "Message", consent: "I agree to be contacted about this request.", submit: "Send enquiry", sending: "Sending…", success: "Your enquiry was recorded. The KOMU team can review it in the admin panel.", error: "The enquiry could not be recorded. Please use email or WhatsApp instead." },
  zh: { name: "姓名", email: "邮箱", country: "国家或地区", role: "您的身份", message: "咨询内容", consent: "我同意就本次咨询与我联系。", submit: "发送询盘", sending: "正在发送…", success: "询盘已记录，康姆团队可以在后台查看。", error: "询盘暂时无法记录，请改用邮箱或 WhatsApp 联系。" },
};

export function InquiryForm({ locale, sourcePath }: { locale: LocaleCode; sourcePath: string }) {
  const labels = copy[locale === "zh" ? "zh" : "en"];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      name: form.get("name"), email: form.get("email"), country: form.get("country"), role: form.get("role"), message: form.get("message"), consent: form.get("consent") === "on", website: form.get("website"), locale, sourcePath,
    }) });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }
  return <form className="inquiry-form" onSubmit={submit} aria-describedby="inquiry-status">
    <label>{labels.name}<input name="name" required maxLength={120} /></label>
    <label>{labels.email}<input name="email" type="email" required maxLength={320} /></label>
    <label>{labels.country}<input name="country" maxLength={120} /></label>
    <label>{labels.role}<input name="role" maxLength={120} /></label>
    <label>{labels.message}<textarea name="message" required maxLength={4000} rows={5} /></label>
    <label className="inquiry-consent"><input name="consent" type="checkbox" required /> <span>{labels.consent}</span></label>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="inquiry-honeypot" />
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? labels.sending : labels.submit}</button>
    <p id="inquiry-status" role="status" aria-live="polite">{status === "success" ? labels.success : status === "error" ? labels.error : ""}</p>
  </form>;
}
