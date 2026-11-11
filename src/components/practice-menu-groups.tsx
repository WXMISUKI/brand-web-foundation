import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { groups: ["Fertilization methods", "Farming methods"], names: ["Fertigation", "Foliar feeding", "Soil application", "Controlled release", "Greenhouse", "Open field", "Fruit trees", "Nurseries"] },
  zh: { groups: ["施肥方法", "种植方法"], names: ["灌溉施肥", "叶面施肥", "土壤施肥", "控释施肥", "设施农业", "大田种植", "果树", "苗圃"] },
  fr: { groups: ["Méthodes de fertilisation", "Méthodes de culture"], names: ["Fertigation", "Nutrition foliaire", "Application au sol", "Libération contrôlée", "Serre", "Plein champ", "Arbres fruitiers", "Pépinières"] },
  es: { groups: ["Métodos de fertilización", "Métodos de cultivo"], names: ["Fertirrigación", "Aplicación foliar", "Aplicación al suelo", "Liberación controlada", "Invernadero", "Campo abierto", "Frutales", "Viveros"] },
  pt: { groups: ["Métodos de fertilização", "Métodos de cultivo"], names: ["Fertirrigação", "Aplicação foliar", "Aplicação no solo", "Libertação controlada", "Estufa", "Campo aberto", "Árvores de fruto", "Viveiros"] },
  ru: { groups: ["Методы внесения удобрений", "Методы выращивания"], names: ["Фертигация", "Внекорневая подкормка", "Внесение в почву", "Контролируемое высвобождение", "Теплица", "Открытый грунт", "Плодовые деревья", "Питомники"] },
  it: { groups: ["Metodi di fertilizzazione", "Metodi di coltivazione"], names: ["Fertirrigazione", "Fertilizzazione fogliare", "Applicazione al suolo", "Cessione controllata", "Serra", "Pieno campo", "Alberi da frutto", "Vivai"] },
  tr: { groups: ["Gübreleme yöntemleri", "Yetiştirme yöntemleri"], names: ["Fertigasyon", "Yapraktan besleme", "Toprak uygulaması", "Kontrollü salınım", "Sera", "Açık tarla", "Meyve ağaçları", "Fidanlıklar"] },
  th: { groups: ["วิธีการใส่ปุ๋ย", "วิธีการเพาะปลูก"], names: ["การให้ปุ๋ยทางระบบน้ำ", "การให้ปุ๋ยทางใบ", "การใส่ปุ๋ยทางดิน", "การปลดปล่อยแบบควบคุม", "เรือนกระจก", "แปลงเปิด", "ไม้ผล", "เรือนเพาะชำ"] },
  nl: { groups: ["Bemestingsmethoden", "Teeltmethoden"], names: ["Fertigatie", "Bladbemesting", "Bodembemesting", "Gecontroleerde afgifte", "Kas", "Open teelt", "Fruitbomen", "Kwekerijen"] },
  ro: { groups: ["Metode de fertilizare", "Metode de cultivare"], names: ["Fertirigare", "Fertilizare foliară", "Aplicare la sol", "Eliberare controlată", "Seră", "Câmp deschis", "Pomi fructiferi", "Pepiniere"] },
  el: { groups: ["Μέθοδοι λίπανσης", "Μέθοδοι καλλιέργειας"], names: ["Υδρολίπανση", "Διαφυλλική λίπανση", "Εφαρμογή στο έδαφος", "Ελεγχόμενη αποδέσμευση", "Θερμοκήπιο", "Υπαίθρια καλλιέργεια", "Οπωροφόρα δέντρα", "Φυτώρια"] },
  he: { groups: ["שיטות דישון", "שיטות גידול"], names: ["דישון דרך ההשקיה", "הזנה עלוותית", "יישום בקרקע", "שחרור מבוקר", "חממה", "שדה פתוח", "עצי פרי", "משתלות"] },
});

const paths = ["fertigation", "#foliar-feeding", "#soil-application", "#controlled-release", "greenhouse", "open-field", "fruit-trees", "#nurseries"] as const;

export function PracticeMenuGroups({ locale, onNavigate }: { locale: CatalogPageLocale; onNavigate?: () => void }) {
  const copy = labels[locale];
  return <>{copy.groups.map((group, index) => <section key={group}><strong>{group}</strong>{paths.slice(index * 4, index * 4 + 4).map((slug, offset) => {
    const name = copy.names[index * 4 + offset];
    return slug?.startsWith("#") ? <Link key={name} href={`/${locale}/contact${slug}`} onClick={onNavigate}>{name}</Link> : <Link key={name} href={`/${locale}/solutions/${slug}`} onClick={onNavigate}>{name}</Link>;
  })}</section>)}</>;
}
