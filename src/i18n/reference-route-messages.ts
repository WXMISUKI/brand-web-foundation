import { completeLocaleMap } from "./locale-fallback.ts";
import type { LocaleCode } from "./locales.ts";

const source = {
  en: {
    seriesTitle: "Product series",
    seriesIntro: "Browse the current KOMU product groupings and their brochure-linked pages.",
    seriesDetailIntro: "This series view groups existing product pages. Product facts, specifications and claims remain subject to the review status shown on each page.",
    methodsTitle: "Growing methods",
    methodsIntro: "Explore the growing method routes currently available in the KOMU reference site.",
    reviewNote: "Product information follows the owner-provided brochure link. Final agronomic decisions and claims require review.",
    browse: "Browse series",
    products: "Products in this series",
    methods: "Growing method routes",
    view: "View route",
    back: "Back to all series",
    backMethods: "Back to growing methods",
    empty: "No products are currently mapped to this series.",
  },
  zh: {
    seriesTitle: "产品系列",
    seriesIntro: "浏览当前康姆产品分类及其关联的画册页面。",
    seriesDetailIntro: "本页面按现有产品分类整理产品页面。每个产品的事实、规格和宣称仍以页面审核状态为准。",
    methodsTitle: "种植方式",
    methodsIntro: "浏览当前康姆参考站提供的种植方式入口。",
    reviewNote: "产品资料来自业主提供的画册链接，具体农艺决策和宣称仍需审核。",
    browse: "浏览系列",
    products: "本系列产品",
    methods: "种植方式入口",
    view: "查看入口",
    back: "返回全部系列",
    backMethods: "返回种植方式",
    empty: "当前没有映射到该系列的产品。",
  },
  fr: {
    seriesTitle: "Séries de produits",
    seriesIntro: "Découvrez les groupes de produits KOMU actuels et les pages liées à la brochure.",
    seriesDetailIntro: "Cette page regroupe les produits existants. Les faits, spécifications et déclarations suivent le statut de vérification indiqué sur chaque page.",
    methodsTitle: "Méthodes de culture",
    methodsIntro: "Découvrez les itinéraires de culture actuellement disponibles sur le site de référence KOMU.",
    reviewNote: "Les informations sur les produits suivent le lien vers la brochure fournie par le propriétaire. Les décisions agronomiques finales et les déclarations nécessitent une vérification.",
    browse: "Parcourir les séries",
    products: "Produits de cette série",
    methods: "Itinéraires de culture",
    view: "Voir l’itinéraire",
    back: "Retour à toutes les séries",
    backMethods: "Retour aux méthodes de culture",
    empty: "Aucun produit n’est actuellement associé à cette série.",
  },
  es: {
    seriesTitle: "Series de productos",
    seriesIntro: "Consulta los grupos actuales de productos KOMU y las páginas vinculadas al folleto.",
    seriesDetailIntro: "Esta página agrupa los productos existentes. Los hechos, las especificaciones y las afirmaciones siguen el estado de revisión mostrado en cada página.",
    methodsTitle: "Métodos de cultivo",
    methodsIntro: "Explora las rutas de cultivo disponibles actualmente en el sitio de referencia KOMU.",
    reviewNote: "La información de los productos sigue el enlace al folleto proporcionado por el propietario. Las decisiones agronómicas finales y las afirmaciones requieren revisión.",
    browse: "Ver series",
    products: "Productos de esta serie",
    methods: "Rutas de cultivo",
    view: "Ver ruta",
    back: "Volver a todas las series",
    backMethods: "Volver a los métodos de cultivo",
    empty: "No hay productos asociados actualmente a esta serie.",
  },
};

Object.assign(source, {
  fr:{seriesTitle:"Séries de produits",seriesIntro:"Parcourez les groupes de produits KOMU et les pages liées à la brochure.",seriesDetailIntro:"Cette page regroupe les produits existants. Les faits, spécifications et allégations suivent le statut de vérification affiché sur chaque page.",methodsTitle:"Méthodes de culture",methodsIntro:"Explorez les parcours de culture disponibles sur le site de référence KOMU.",reviewNote:"Les informations produit suivent le lien vers la brochure fournie par le propriétaire. Les décisions agronomiques finales et les allégations doivent être vérifiées.",browse:"Parcourir les séries",products:"Produits de cette série",methods:"Parcours de culture",view:"Voir le parcours",back:"Retour à toutes les séries",backMethods:"Retour aux méthodes",empty:"Aucun produit n’est actuellement associé à cette série."},
  es:{seriesTitle:"Series de productos",seriesIntro:"Explora los grupos actuales de productos KOMU y sus páginas vinculadas al catálogo.",seriesDetailIntro:"Esta página agrupa productos existentes. Los datos, las especificaciones y las afirmaciones siguen el estado de revisión mostrado en cada página.",methodsTitle:"Métodos de cultivo",methodsIntro:"Explora las rutas de cultivo disponibles en el sitio de referencia KOMU.",reviewNote:"La información de los productos sigue el enlace del catálogo proporcionado por el propietario. Las decisiones agronómicas finales y las afirmaciones requieren revisión.",browse:"Ver series",products:"Productos de esta serie",methods:"Rutas de cultivo",view:"Ver ruta",back:"Volver a todas las series",backMethods:"Volver a los métodos",empty:"No hay productos asociados actualmente a esta serie."},
  pt:{seriesTitle:"Séries de produtos",seriesIntro:"Veja os grupos de produtos KOMU atuais e as páginas ligadas à brochura.",seriesDetailIntro:"Esta página agrupa produtos existentes. Os factos, as especificações e as alegações seguem o estado de revisão indicado em cada página.",methodsTitle:"Métodos de cultivo",methodsIntro:"Explore as rotas de cultivo atualmente disponíveis no site de referência KOMU.",reviewNote:"As informações dos produtos seguem o link da brochura fornecida pelo proprietário. As decisões agronómicas finais e as alegações requerem revisão.",browse:"Ver séries",products:"Produtos desta série",methods:"Rotas de cultivo",view:"Ver rota",back:"Voltar a todas as séries",backMethods:"Voltar aos métodos",empty:"Não há produtos mapeados para esta série."},
  ru:{seriesTitle:"Серии продуктов",seriesIntro:"Просмотрите текущие группы продуктов KOMU и страницы, связанные с брошюрой.",seriesDetailIntro:"На этой странице сгруппированы существующие продукты. Факты, характеристики и заявления соответствуют статусу проверки на каждой странице.",methodsTitle:"Методы выращивания",methodsIntro:"Изучите доступные маршруты выращивания на справочном сайте KOMU.",reviewNote:"Информация о продуктах основана на ссылке на предоставленную владельцем брошюру. Окончательные агрономические решения и заявления требуют проверки.",browse:"Смотреть серии",products:"Продукты этой серии",methods:"Маршруты выращивания",view:"Открыть маршрут",back:"Ко всем сериям",backMethods:"К методам выращивания",empty:"Для этой серии пока нет сопоставленных продуктов."},
  it:{seriesTitle:"Serie di prodotti",seriesIntro:"Scopri i gruppi di prodotti KOMU disponibili e le pagine collegate alla brochure.",seriesDetailIntro:"Questa pagina raggruppa i prodotti esistenti. Fatti, specifiche e indicazioni seguono lo stato di revisione mostrato in ogni pagina.",methodsTitle:"Metodi di coltivazione",methodsIntro:"Esplora i percorsi di coltivazione disponibili nel sito di riferimento KOMU.",reviewNote:"Le informazioni sui prodotti seguono il link alla brochure fornita dal proprietario. Le decisioni agronomiche finali e le indicazioni richiedono verifica.",browse:"Sfoglia le serie",products:"Prodotti di questa serie",methods:"Percorsi di coltivazione",view:"Vedi percorso",back:"Torna a tutte le serie",backMethods:"Torna ai metodi",empty:"Nessun prodotto è attualmente associato a questa serie."},
  tr:{seriesTitle:"Ürün serileri",seriesIntro:"Mevcut KOMU ürün gruplarını ve broşür bağlantılı sayfalarını inceleyin.",seriesDetailIntro:"Bu sayfa mevcut ürünleri gruplar. Ürün bilgileri, teknik özellikler ve iddialar her sayfadaki inceleme durumuna tabidir.",methodsTitle:"Yetiştirme yöntemleri",methodsIntro:"KOMU referans sitesinde bulunan yetiştirme rotalarını keşfedin.",reviewNote:"Ürün bilgileri, sahibinin sağladığı broşür bağlantısını izler. Nihai agronomik kararlar ve iddialar inceleme gerektirir.",browse:"Serilere göz at",products:"Bu serideki ürünler",methods:"Yetiştirme rotaları",view:"Rotayı görüntüle",back:"Tüm serilere dön",backMethods:"Yöntemlere dön",empty:"Bu seriye eşlenmiş ürün bulunmuyor."},
  th:{seriesTitle:"กลุ่มผลิตภัณฑ์",seriesIntro:"ดูการจัดกลุ่มผลิตภัณฑ์ KOMU ปัจจุบันและหน้าที่เชื่อมโยงกับโบรชัวร์",seriesDetailIntro:"หน้านี้จัดกลุ่มหน้าผลิตภัณฑ์ที่มีอยู่ ข้อเท็จจริง ข้อมูลจำเพาะ และข้อความกล่าวอ้างเป็นไปตามสถานะการตรวจสอบของแต่ละหน้า",methodsTitle:"วิธีการปลูก",methodsIntro:"สำรวจเส้นทางวิธีการปลูกที่มีอยู่ในเว็บไซต์อ้างอิง KOMU",reviewNote:"ข้อมูลผลิตภัณฑ์อ้างอิงลิงก์โบรชัวร์ที่เจ้าของให้มา การตัดสินใจด้านพืชไร่และข้อความกล่าวอ้างขั้นสุดท้ายต้องผ่านการตรวจสอบ",browse:"ดูซีรีส์",products:"ผลิตภัณฑ์ในซีรีส์นี้",methods:"เส้นทางการปลูก",view:"ดูเส้นทาง",back:"กลับไปยังซีรีส์ทั้งหมด",backMethods:"กลับไปยังวิธีการปลูก",empty:"ยังไม่มีผลิตภัณฑ์ที่เชื่อมกับซีรีส์นี้"},
  nl:{seriesTitle:"Productseries",seriesIntro:"Bekijk de huidige KOMU-productgroepen en de brochurepagina's die eraan gekoppeld zijn.",seriesDetailIntro:"Deze pagina groepeert bestaande productpagina's. Productfeiten, specificaties en claims volgen de beoordelingsstatus op elke pagina.",methodsTitle:"Teeltmethoden",methodsIntro:"Ontdek de teeltroutes die momenteel beschikbaar zijn op de KOMU-referentiesite.",reviewNote:"Productinformatie volgt de brochurelink die door de eigenaar is verstrekt. Definitieve agronomische keuzes en claims moeten worden beoordeeld.",browse:"Series bekijken",products:"Producten in deze serie",methods:"Teeltroutes",view:"Route bekijken",back:"Terug naar alle series",backMethods:"Terug naar teeltmethoden",empty:"Er zijn momenteel geen producten aan deze serie gekoppeld."},
  ro:{seriesTitle:"Serii de produse",seriesIntro:"Vezi grupurile actuale de produse KOMU și paginile legate de broșură.",seriesDetailIntro:"Această pagină grupează produsele existente. Faptele, specificațiile și afirmațiile urmează starea de verificare afișată pe fiecare pagină.",methodsTitle:"Metode de cultivare",methodsIntro:"Explorează rutele de cultivare disponibile pe site-ul de referință KOMU.",reviewNote:"Informațiile despre produse urmează linkul broșurii furnizate de proprietar. Deciziile agronomice finale și afirmațiile necesită verificare.",browse:"Vezi seriile",products:"Produsele acestei serii",methods:"Rute de cultivare",view:"Vezi ruta",back:"Înapoi la toate seriile",backMethods:"Înapoi la metode",empty:"Nu există produse asociate acestei serii."},
  el:{seriesTitle:"Σειρές προϊόντων",seriesIntro:"Περιηγηθείτε στις τρέχουσες ομάδες προϊόντων KOMU και στις σελίδες που συνδέονται με το φυλλάδιο.",seriesDetailIntro:"Η σελίδα ομαδοποιεί υπάρχοντα προϊόντα. Τα στοιχεία, οι προδιαγραφές και οι ισχυρισμοί ακολουθούν την κατάσταση ελέγχου κάθε σελίδας.",methodsTitle:"Μέθοδοι καλλιέργειας",methodsIntro:"Εξερευνήστε τις διαθέσιμες διαδρομές καλλιέργειας στον ιστότοπο αναφοράς KOMU.",reviewNote:"Οι πληροφορίες προϊόντων βασίζονται στον σύνδεσμο φυλλαδίου που παρείχε ο ιδιοκτήτης. Οι τελικές γεωπονικές αποφάσεις και οι ισχυρισμοί απαιτούν έλεγχο.",browse:"Περιήγηση σε σειρές",products:"Προϊόντα αυτής της σειράς",methods:"Διαδρομές καλλιέργειας",view:"Προβολή διαδρομής",back:"Επιστροφή σε όλες τις σειρές",backMethods:"Επιστροφή στις μεθόδους",empty:"Δεν υπάρχουν προϊόντα αντιστοιχισμένα σε αυτή τη σειρά."},
  he:{seriesTitle:"סדרות מוצרים",seriesIntro:"עיינו בקבוצות מוצרי KOMU הנוכחיות ובעמודים המקושרים לחוברת.",seriesDetailIntro:"עמוד זה מקבץ עמודי מוצרים קיימים. העובדות, המפרטים והטענות כפופים למצב הבדיקה המוצג בכל עמוד.",methodsTitle:"שיטות גידול",methodsIntro:"גלו את מסלולי הגידול הזמינים כעת באתר הייחוס של KOMU.",reviewNote:"פרטי המוצר מבוססים על קישור החוברת שסופק על ידי הבעלים. החלטות אגרונומיות סופיות וטענות דורשות בדיקה.",browse:"עיון בסדרות",products:"מוצרים בסדרה זו",methods:"מסלולי גידול",view:"למסלול",back:"חזרה לכל הסדרות",backMethods:"חזרה לשיטות הגידול",empty:"אין כרגע מוצרים המקושרים לסדרה זו."},
});

const baseRouteMessages = completeLocaleMap(source);

type RouteExtras = { home: string; breadcrumb: string; productCount: string; productsCount: string; details: string; backHome: string };
const routeExtras = completeLocaleMap<RouteExtras>({
  en: { home: "Home", breadcrumb: "Breadcrumb", productCount: "product", productsCount: "products", details: "View details", backHome: "Back to home" },
  zh: { home: "首页", breadcrumb: "面包屑导航", productCount: "个产品", productsCount: "个产品", details: "了解详情", backHome: "返回首页" },
  fr: { home: "Accueil", breadcrumb: "Fil d’Ariane", productCount: "produit", productsCount: "produits", details: "Voir les détails", backHome: "Retour à l’accueil" },
  es: { home: "Inicio", breadcrumb: "Ruta de navegación", productCount: "producto", productsCount: "productos", details: "Ver detalles", backHome: "Volver al inicio" },
  pt: { home: "Início", breadcrumb: "Rota de navegação", productCount: "produto", productsCount: "produtos", details: "Ver detalhes", backHome: "Voltar ao início" },
  ru: { home: "Главная", breadcrumb: "Навигация", productCount: "продукт", productsCount: "продуктов", details: "Подробнее", backHome: "На главную" },
  it: { home: "Home", breadcrumb: "Breadcrumb", productCount: "prodotto", productsCount: "prodotti", details: "Vedi dettagli", backHome: "Torna alla home" },
  tr: { home: "Ana sayfa", breadcrumb: "İçerik yolu", productCount: "ürün", productsCount: "ürün", details: "Ayrıntıları görüntüle", backHome: "Ana sayfaya dön" },
  th: { home: "หน้าหลัก", breadcrumb: "เส้นทางการนำทาง", productCount: "ผลิตภัณฑ์", productsCount: "ผลิตภัณฑ์", details: "ดูรายละเอียด", backHome: "กลับหน้าหลัก" },
  nl: { home: "Home", breadcrumb: "Kruimelpad", productCount: "product", productsCount: "producten", details: "Details bekijken", backHome: "Terug naar home" },
  ro: { home: "Acasă", breadcrumb: "Navigare", productCount: "produs", productsCount: "produse", details: "Vezi detalii", backHome: "Înapoi acasă" },
  el: { home: "Αρχική", breadcrumb: "Διαδρομή", productCount: "προϊόν", productsCount: "προϊόντα", details: "Προβολή λεπτομερειών", backHome: "Επιστροφή στην αρχική" },
  he: { home: "דף הבית", breadcrumb: "ניווט", productCount: "מוצר", productsCount: "מוצרים", details: "לפרטים", backHome: "חזרה לדף הבית" },
});

type BaseRouteMessages = (typeof baseRouteMessages)[keyof typeof baseRouteMessages];
export const referenceRouteMessages = Object.fromEntries(Object.keys(baseRouteMessages).map(code => [code, { ...baseRouteMessages[code as LocaleCode], ...routeExtras[code as LocaleCode] }])) as Record<LocaleCode, BaseRouteMessages & RouteExtras>;
