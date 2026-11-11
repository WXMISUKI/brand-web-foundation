import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
import { productDetailMessages } from "../i18n/product-detail-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";
import { siteContact } from "../data/site-contact";

const messages = completeLocaleMap({
  en: { dealer: "Distribution enquiries", name: "Full name", country: "Country", phone: "Phone", email: "Email", role: "Your expertise", consent: "I agree to receive information by email", send: "Send", status: "Contact the KOMU team by email or WhatsApp." },
  zh: { dealer: "经销合作咨询", name: "姓名", country: "国家或地区", phone: "电话", email: "电子邮箱", role: "您的行业", consent: "我同意通过电子邮件接收资讯", send: "发送", status: "可通过邮箱或 WhatsApp 联系康姆团队。" },
  fr: { dealer: "Trouver un distributeur · À venir", name: "Nom complet", country: "Pays", phone: "Téléphone", email: "Adresse e-mail", role: "Votre domaine", consent: "J’accepte de recevoir des informations par e-mail", send: "Envoyer", status: "Aperçu uniquement. Ce formulaire ne reçoit pas encore de demandes." },
  es: { dealer: "Buscar distribuidor · Próximamente", name: "Nombre completo", country: "País", phone: "Teléfono", email: "Correo electrónico", role: "Tu actividad", consent: "Acepto recibir información por correo electrónico", send: "Enviar", status: "Solo vista previa. El formulario aún no recibe consultas." },
  pt: { dealer: "Encontrar distribuidor · Em breve", name: "Nome completo", country: "País", phone: "Telefone", email: "E-mail", role: "A sua área", consent: "Aceito receber informações por e-mail", send: "Enviar", status: "Apenas pré-visualização. Este formulário ainda não recebe pedidos." },
  ru: { dealer: "Найти дистрибьютора · Скоро", name: "Полное имя", country: "Страна", phone: "Телефон", email: "Электронная почта", role: "Ваша сфера", consent: "Я согласен получать информацию по электронной почте", send: "Отправить", status: "Только предпросмотр. Форма пока не принимает запросы." },
  it: { dealer: "Trova un distributore · Presto disponibile", name: "Nome completo", country: "Paese", phone: "Telefono", email: "E-mail", role: "Il tuo settore", consent: "Accetto di ricevere informazioni via e-mail", send: "Invia", status: "Solo anteprima. Il modulo non riceve ancora richieste." },
  tr: { dealer: "Distribütör bul · Yakında", name: "Ad soyad", country: "Ülke", phone: "Telefon", email: "E-posta", role: "Uzmanlık alanınız", consent: "Bilgileri e-posta ile almayı kabul ediyorum", send: "Gönder", status: "Yalnızca önizleme. Bu form henüz talep almıyor." },
  th: { dealer: "ค้นหาผู้จัดจำหน่าย · เร็ว ๆ นี้", name: "ชื่อเต็ม", country: "ประเทศ", phone: "โทรศัพท์", email: "อีเมล", role: "ความเชี่ยวชาญของคุณ", consent: "ฉันยินยอมรับข้อมูลทางอีเมล", send: "ส่ง", status: "ตัวอย่างเท่านั้น แบบฟอร์มนี้ยังไม่รับคำขอ" },
  nl: { dealer: "Distributeur zoeken · Binnenkort", name: "Volledige naam", country: "Land", phone: "Telefoon", email: "E-mail", role: "Uw vakgebied", consent: "Ik ga akkoord met informatie per e-mail", send: "Versturen", status: "Alleen een voorbeeld. Dit formulier ontvangt nog geen aanvragen." },
  ro: { dealer: "Găsiți un distribuitor · În curând", name: "Nume complet", country: "Țară", phone: "Telefon", email: "E-mail", role: "Domeniul dumneavoastră", consent: "Sunt de acord să primesc informații prin e-mail", send: "Trimite", status: "Doar previzualizare. Formularul nu primește încă solicitări." },
  el: { dealer: "Βρείτε διανομέα · Σύντομα", name: "Ονοματεπώνυμο", country: "Χώρα", phone: "Τηλέφωνο", email: "E-mail", role: "Ο τομέας σας", consent: "Συμφωνώ να λαμβάνω πληροφορίες μέσω e-mail", send: "Αποστολή", status: "Μόνο προεπισκόπηση. Η φόρμα δεν δέχεται ακόμη αιτήματα." },
  he: { dealer: "מציאת מפיץ · בקרוב", name: "שם מלא", country: "מדינה", phone: "טלפון", email: "דוא״ל", role: "תחום העיסוק שלך", consent: "אני מסכים לקבל מידע בדוא״ל", send: "שליחה", status: "תצוגה מקדימה בלבד. הטופס עדיין אינו מקבל פניות." },
});

export function ProductEnquiryPreview({ locale }: { locale: CatalogPageLocale }) {
  const copy = messages[locale];
  return <aside className="detail-contact product-enquiry">
    <div className="detail-dealer">{copy.dealer}</div>
    <div className="detail-contact-panel">
      <h2>{productDetailMessages[locale].enquiries}</h2>
      <p id="product-enquiry-status">{copy.status}</p>
      <div className="product-contact-actions"><a className="button green" href={`mailto:${siteContact.email}`}>{siteContact.email}</a><a className="text-link" href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp {siteContact.whatsapp} ↗</a></div>
      <Link href={`/${locale}/contact`}>{aboutMessages[locale].contact} ↗</Link>
    </div>
  </aside>;
}
