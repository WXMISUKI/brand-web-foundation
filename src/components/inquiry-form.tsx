"use client";

import { useRef, useState } from "react";
import type { LocaleCode } from "../i18n/locales";
import { completeLocaleMap } from "../i18n/locale-fallback";

const copy = completeLocaleMap({
  en: { name: "Name", email: "Email", country: "Country or region", role: "Your role", message: "Message", consent: "I agree to be contacted about this request.", submit: "Send enquiry", sending: "Sending…", success: "Your enquiry was recorded. The KOMU team can review it in the admin panel.", error: "We could not confirm whether your enquiry was recorded. Please contact us by email or WhatsApp before sending it again." },
  zh: { name: "姓名", email: "邮箱", country: "国家或地区", role: "您的身份", message: "咨询内容", consent: "我同意就本次咨询与我联系。", submit: "发送询盘", sending: "正在发送…", success: "询盘已记录，康姆团队可以在后台查看。", error: "无法确认询盘是否已记录。再次发送前，请通过邮箱或 WhatsApp 联系我们。" },
  fr: { name: "Nom complet", email: "E-mail", country: "Pays ou région", role: "Votre rôle", message: "Message", consent: "J’accepte d’être contacté au sujet de cette demande.", submit: "Envoyer la demande", sending: "Envoi…", success: "Votre demande a été enregistrée. L’équipe KOMU peut la consulter dans l’administration.", error: "Nous ne pouvons pas confirmer si votre demande a été enregistrée. Contactez-nous par e-mail ou WhatsApp avant de la renvoyer." },
  es: { name: "Nombre completo", email: "Correo electrónico", country: "País o región", role: "Tu función", message: "Mensaje", consent: "Acepto que me contacten sobre esta solicitud.", submit: "Enviar consulta", sending: "Enviando…", success: "La consulta se ha registrado. El equipo de KOMU puede verla en el panel de administración.", error: "No podemos confirmar si se registró tu consulta. Contáctanos por correo o WhatsApp antes de enviarla de nuevo." },
  pt: { name: "Nome completo", email: "E-mail", country: "País ou região", role: "A sua função", message: "Mensagem", consent: "Aceito ser contactado sobre este pedido.", submit: "Enviar pedido", sending: "A enviar…", success: "O pedido foi registado. A equipa KOMU pode consultá-lo no painel de administração.", error: "Não foi possível confirmar se o pedido foi registado. Contacte-nos por e-mail ou WhatsApp antes de o enviar novamente." },
  ru: { name: "Полное имя", email: "Электронная почта", country: "Страна или регион", role: "Ваша роль", message: "Сообщение", consent: "Я согласен получать связь по этому запросу.", submit: "Отправить запрос", sending: "Отправка…", success: "Запрос записан. Команда KOMU может просмотреть его в панели администратора.", error: "Не удалось подтвердить, записан ли запрос. Прежде чем отправить его снова, свяжитесь с нами по электронной почте или WhatsApp." },
  it: { name: "Nome completo", email: "E-mail", country: "Paese o regione", role: "Il tuo ruolo", message: "Messaggio", consent: "Accetto di essere contattato per questa richiesta.", submit: "Invia richiesta", sending: "Invio…", success: "La richiesta è stata registrata. Il team KOMU può consultarla nel pannello di amministrazione.", error: "Non possiamo confermare se la richiesta sia stata registrata. Contattaci via e-mail o WhatsApp prima di inviarla di nuovo." },
  tr: { name: "Ad soyad", email: "E-posta", country: "Ülke veya bölge", role: "Rolünüz", message: "Mesaj", consent: "Bu talep hakkında benimle iletişime geçilmesini kabul ediyorum.", submit: "Talebi gönder", sending: "Gönderiliyor…", success: "Talep kaydedildi. KOMU ekibi talebi yönetim panelinden inceleyebilir.", error: "Talebinizin kaydedilip kaydedilmediğini doğrulayamadık. Tekrar göndermeden önce e-posta veya WhatsApp ile bizimle iletişime geçin." },
  th: { name: "ชื่อเต็ม", email: "อีเมล", country: "ประเทศหรือภูมิภาค", role: "บทบาทของคุณ", message: "ข้อความ", consent: "ฉันยินยอมให้ติดต่อเกี่ยวกับคำขอนี้", submit: "ส่งคำขอ", sending: "กำลังส่ง…", success: "บันทึกคำขอแล้ว ทีม KOMU สามารถดูได้ในแผงผู้ดูแล", error: "ไม่สามารถยืนยันได้ว่าบันทึกคำขอแล้วหรือไม่ โปรดติดต่อเราทางอีเมลหรือ WhatsApp ก่อนส่งอีกครั้ง" },
  nl: { name: "Volledige naam", email: "E-mail", country: "Land of regio", role: "Uw rol", message: "Bericht", consent: "Ik ga ermee akkoord dat er over deze aanvraag contact met mij wordt opgenomen.", submit: "Aanvraag versturen", sending: "Verzenden…", success: "Uw aanvraag is geregistreerd. Het KOMU-team kan deze in het beheerpaneel bekijken.", error: "We kunnen niet bevestigen of uw aanvraag is geregistreerd. Neem contact op via e-mail of WhatsApp voordat u opnieuw verzendt." },
  ro: { name: "Nume complet", email: "E-mail", country: "Țară sau regiune", role: "Rolul dumneavoastră", message: "Mesaj", consent: "Sunt de acord să fiu contactat pentru această solicitare.", submit: "Trimite solicitarea", sending: "Se trimite…", success: "Solicitarea a fost înregistrată. Echipa KOMU o poate vedea în panoul de administrare.", error: "Nu putem confirma dacă solicitarea a fost înregistrată. Contactați-ne prin e-mail sau WhatsApp înainte de a o trimite din nou." },
  el: { name: "Ονοματεπώνυμο", email: "E-mail", country: "Χώρα ή περιοχή", role: "Ο ρόλος σας", message: "Μήνυμα", consent: "Συμφωνώ να επικοινωνήσετε μαζί μου για το αίτημα.", submit: "Αποστολή αιτήματος", sending: "Αποστολή…", success: "Το αίτημα καταγράφηκε. Η ομάδα KOMU μπορεί να το δει στον πίνακα διαχείρισης.", error: "Δεν μπορούμε να επιβεβαιώσουμε αν το αίτημα καταγράφηκε. Επικοινωνήστε μαζί μας μέσω e-mail ή WhatsApp πριν το στείλετε ξανά." },
  he: { name: "שם מלא", email: "דוא״ל", country: "מדינה או אזור", role: "התפקיד שלך", message: "הודעה", consent: "אני מסכים שייצרו איתי קשר בנוגע לבקשה זו.", submit: "שליחת פנייה", sending: "שולח…", success: "הפנייה נרשמה. צוות KOMU יכול לצפות בה בממשק הניהול.", error: "לא ניתן לאשר אם הפנייה נרשמה. יש ליצור איתנו קשר בדוא״ל או ב-WhatsApp לפני שליחה חוזרת." },
});

export function InquiryForm({ locale, sourcePath }: { locale: LocaleCode; sourcePath: string }) {
  const labels = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const pending = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setStatus("sending");
    const element = event.currentTarget;
    const form = new FormData(element);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/inquiries", { method: "POST", signal: controller.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({
        name: form.get("name"), email: form.get("email"), country: form.get("country"), role: form.get("role"), message: form.get("message"), consent: form.get("consent") === "on", website: form.get("website"), locale, sourcePath,
      }) });
      const result: unknown = response.status === 201 ? await response.json() : null;
      if (result && typeof result === "object" && "ok" in result && result.ok === true && "id" in result && typeof result.id === "number") {
        element.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      pending.current = false;
    }
  }
  return <form className="inquiry-form" onSubmit={submit} aria-describedby="inquiry-status">
    <label>{labels.name}<input name="name" required maxLength={120} disabled={status === "sending"} /></label>
    <label>{labels.email}<input name="email" type="email" required maxLength={320} disabled={status === "sending"} /></label>
    <label>{labels.country}<input name="country" maxLength={120} disabled={status === "sending"} /></label>
    <label>{labels.role}<input name="role" maxLength={120} disabled={status === "sending"} /></label>
    <label>{labels.message}<textarea name="message" required maxLength={4000} rows={5} disabled={status === "sending"} /></label>
    <label className="inquiry-consent"><input name="consent" type="checkbox" required disabled={status === "sending"} /> <span>{labels.consent}</span></label>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="inquiry-honeypot" disabled={status === "sending"} />
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? labels.sending : labels.submit}</button>
    <p id="inquiry-status" role="status" aria-live="polite">{status === "success" ? labels.success : status === "error" ? labels.error : ""}</p>
  </form>;
}
