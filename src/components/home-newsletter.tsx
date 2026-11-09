import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";
import { siteContact } from "../data/site-contact";

const messages = completeLocaleMap({
  en: { eyebrow: "NEWSLETTER", title: "Stay up to date", description: "Explore updates on plant nutrition, products and growing applications.", email: "Contact the KOMU team", subscribe: "Email KOMU", consent: "", status: "Send us the topics and markets you want to follow." },
  zh: { eyebrow: "资讯订阅", title: "获取最新资讯", description: "关注植物营养、产品与种植应用的最新资讯。", email: "联系康姆团队", subscribe: "邮件联系", consent: "", status: "请告诉我们您关注的主题和目标市场。" },
  fr: { eyebrow: "LETTRE D’INFORMATION · APERÇU", title: "Restez informé", description: "Découvrez les futures actualités sur la nutrition végétale, les produits et les événements.", email: "Votre adresse e-mail", subscribe: "S’abonner", consent: "J’accepte de recevoir des informations par e-mail", status: "Aperçu uniquement. L’abonnement n’est pas encore disponible." },
  es: { eyebrow: "BOLETÍN · VISTA PREVIA", title: "Mantente informado", description: "Descubre futuras novedades sobre nutrición vegetal, productos y eventos.", email: "Tu correo electrónico", subscribe: "Suscribirse", consent: "Acepto recibir novedades por correo electrónico", status: "Solo vista previa. La suscripción aún no está disponible." },
});

export function HomeNewsletter({ locale }: { locale: CatalogPageLocale }) {
  const copy = messages[locale];
  return <section className="home-newsletter" aria-labelledby="newsletter-title">
    <div className="home-newsletter-inner">
      <div className="home-newsletter-copy"><span className="eyebrow">{copy.eyebrow}</span><h2 id="newsletter-title">{copy.title}</h2><p>{copy.description}</p></div>
      <div className="home-newsletter-form" aria-describedby="newsletter-status">
        <label htmlFor="newsletter-contact">{copy.email}</label>
        <div className="home-newsletter-input"><a id="newsletter-contact" className="button green" href={`mailto:${siteContact.email}`}>{copy.subscribe}</a></div>
        <p id="newsletter-status">{copy.status}</p>
      </div>
    </div>
  </section>;
}
