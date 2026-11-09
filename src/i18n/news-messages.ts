import { completeLocaleMap } from "./locale-fallback.ts";

// French UI text is a draft; published content remains separately localized.
const newsMessagesSource = {
 en:{short:"News",title:"News and events",intro:"Updates on plant nutrition, product applications and grower resources.",search:"Search news",submit:"Search",note:"Search uses the current language; keywords are not translated.",empty:"No news is available on this page.",all:"View all news",newsTab:"News",eventsTab:"Events",allTab:"All",pages:"News pages",previous:"Previous",next:"Next",page:"Page",of:"of",date:"Published",summary:"Read the full update.",body:"Read the full update from the KOMU team."},
 zh:{short:"新闻",title:"新闻与活动",intro:"了解植物营养、产品应用和种植资料的最新内容。",search:"搜索新闻",submit:"搜索",note:"按当前语言搜索，切换语言时关键词不会自动翻译。",empty:"此页暂无新闻内容。",all:"查看全部新闻",newsTab:"新闻",eventsTab:"活动",allTab:"全部",pages:"新闻分页",previous:"上一页",next:"下一页",page:"第",of:"页 / 共",date:"发布日期",summary:"阅读完整内容。",body:"阅读康姆团队发布的完整内容。"},
 fr:{short:"Actualités",title:"Actualités et événements",intro:"Contenu à confirmer.",search:"Rechercher des actualités",submit:"Rechercher",note:"La recherche utilise la langue courante ; les mots-clés ne sont pas traduits.",empty:"Aucune actualité disponible sur cette page.",all:"Voir toutes les actualités",newsTab:"Actualités",eventsTab:"Événements",allTab:"Tout",pages:"Pages d’actualités",previous:"Précédent",next:"Suivant",page:"Page",of:"sur",date:"Date à confirmer",summary:"Résumé à compléter",body:"Contenu ou traduction à compléter."},
 es:{short:"Noticias",title:"Noticias y eventos",intro:"Contenido pendiente de confirmación.",search:"Buscar noticias",submit:"Buscar",note:"La búsqueda usa el idioma actual; las palabras clave no se traducen.",empty:"No hay noticias disponibles en esta página.",all:"Ver todas las noticias",newsTab:"Noticias",eventsTab:"Eventos",allTab:"Todo",pages:"Páginas de noticias",previous:"Anterior",next:"Siguiente",page:"Página",of:"de",date:"Fecha pendiente",summary:"Resumen pendiente",body:"Contenido o traducción pendiente."},
};

export const newsMessages = completeLocaleMap(newsMessagesSource);
