import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";
import { siteContact } from "../data/site-contact";

export const homeNewsletterMessages = completeLocaleMap({
  en: { eyebrow: "NEWSLETTER", title: "Stay up to date", description: "Explore updates on plant nutrition, products and growing applications.", email: "Contact the KOMU team", subscribe: "Email KOMU", consent: "", status: "Send us the topics and markets you want to follow." },
  zh: { eyebrow: "资讯订阅", title: "获取最新资讯", description: "关注植物营养、产品与种植应用的最新资讯。", email: "联系康坶团队", subscribe: "邮件联系", consent: "", status: "请告诉我们您关注的主题和目标市场。" },
  fr: { eyebrow: "", title: "", description: "", email: "Contactez l’équipe KOMU", subscribe: "Envoyer un e-mail", consent: "", status: "Indiquez-nous les sujets et les marchés qui vous intéressent." },
  es: { eyebrow: "", title: "", description: "", email: "Contacta con el equipo de KOMU", subscribe: "Enviar correo", consent: "", status: "Cuéntanos qué temas y mercados te interesan." },
  pt: { eyebrow: "NEWSLETTER · PRÉ-VISUALIZAÇÃO", title: "Mantenha-se atualizado", description: "Acompanhe novidades sobre nutrição vegetal, produtos e aplicações de cultivo.", email: "Contacte a equipa KOMU", subscribe: "Enviar e-mail", consent: "", status: "Diga-nos quais os temas e mercados que pretende acompanhar." },
  ru: { eyebrow: "РАССЫЛКА · ПРЕДПРОСМОТР", title: "Будьте в курсе", description: "Следите за новостями о питании растений, продуктах и выращивании.", email: "Связаться с командой KOMU", subscribe: "Написать по электронной почте", consent: "", status: "Расскажите, какие темы и рынки вас интересуют." },
  it: { eyebrow: "NEWSLETTER · ANTEPRIMA", title: "Resta aggiornato", description: "Scopri gli aggiornamenti sulla nutrizione vegetale, sui prodotti e sulle applicazioni colturali.", email: "Contatta il team KOMU", subscribe: "Invia e-mail", consent: "", status: "Indicaci i temi e i mercati che vuoi seguire." },
  tr: { eyebrow: "BÜLTEN · ÖNİZLEME", title: "Güncel kalın", description: "Bitki besleme, ürünler ve yetiştirme uygulamalarındaki gelişmeleri keşfedin.", email: "KOMU ekibiyle iletişime geçin", subscribe: "E-posta gönder", consent: "", status: "Takip etmek istediğiniz konuları ve pazarları bize bildirin." },
  th: { eyebrow: "จดหมายข่าว · ตัวอย่าง", title: "ติดตามข่าวสาร", description: "ติดตามข้อมูลด้านโภชนาการพืช ผลิตภัณฑ์ และการเพาะปลูก", email: "ติดต่อทีม KOMU", subscribe: "ส่งอีเมล", consent: "", status: "บอกหัวข้อและตลาดที่คุณต้องการติดตาม" },
  nl: { eyebrow: "NIEUWSBRIEF · VOORBEELD", title: "Blijf op de hoogte", description: "Ontdek updates over plantenvoeding, producten en teelttoepassingen.", email: "Neem contact op met het KOMU-team", subscribe: "E-mail sturen", consent: "", status: "Laat ons weten welke onderwerpen en markten u wilt volgen." },
  ro: { eyebrow: "NEWSLETTER · PREVIZUALIZARE", title: "Rămâneți la curent", description: "Descoperiți noutăți despre nutriția plantelor, produse și aplicații de cultivare.", email: "Contactați echipa KOMU", subscribe: "Trimite e-mail", consent: "", status: "Spuneți-ne ce subiecte și piețe doriți să urmăriți." },
  el: { eyebrow: "ΕΝΗΜΕΡΩΤΙΚΟ ΔΕΛΤΙΟ · ΠΡΟΕΠΙΣΚΟΠΗΣΗ", title: "Μείνετε ενημερωμένοι", description: "Εξερευνήστε ενημερώσεις για τη φυτική θρέψη, τα προϊόντα και τις εφαρμογές καλλιέργειας.", email: "Επικοινωνήστε με την ομάδα KOMU", subscribe: "Αποστολή e-mail", consent: "", status: "Πείτε μας ποια θέματα και αγορές θέλετε να παρακολουθείτε." },
  he: { eyebrow: "ניוזלטר · תצוגה מקדימה", title: "הישארו מעודכנים", description: "גלו עדכונים על תזונת צמחים, מוצרים ויישומי גידול.", email: "צרו קשר עם צוות KOMU", subscribe: "שליחת דוא״ל", consent: "", status: "ספרו לנו אילו נושאים ושווקים תרצו לעקוב אחריהם." },
});

export function ContactCallout({ locale }: { locale: CatalogPageLocale }) {
  const copy = homeNewsletterMessages[locale];
  return <section className="contact-callout" aria-labelledby="contact-callout-title">
    <div className="contact-callout-inner">
      <div><h2 id="contact-callout-title">{copy.email}</h2><p>{copy.status}</p></div>
      <a className="contact-callout-button" href={`mailto:${siteContact.email}`}>{copy.subscribe}</a>
    </div>
  </section>;
}
