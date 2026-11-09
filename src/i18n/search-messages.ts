import { completeLocaleMap } from "./locale-fallback.ts";
// French labels are draft interface text, not reviewed product translations.
const searchMessagesSource = {
 en:{title:"Search",label:"Search products, articles and FAQs",button:"Search",note:"Search uses the current language. Keywords are not translated when switching languages.",prompt:"Enter a keyword to search products, knowledge, stories, news and FAQs.",empty:"No matching content found.",all:"View all results",faqAll:"View all FAQ results"},
 zh:{title:"搜索",label:"搜索产品、文章和常见问题",button:"搜索",note:"按当前语言搜索；切换语言时关键词不会自动翻译。",prompt:"请输入关键词，搜索产品、知识、案例、新闻和常见问题。",empty:"没有找到匹配的内容。",all:"查看全部结果",faqAll:"查看全部常见问题结果"},
 fr:{title:"Rechercher",label:"Rechercher des produits, articles et questions fréquentes",button:"Rechercher",note:"La recherche utilise la langue courante. Les mots-clés ne sont pas traduits lors du changement de langue.",prompt:"Saisissez un mot-clé pour rechercher des produits, articles, témoignages, actualités et questions fréquentes.",empty:"Aucun contenu correspondant.",all:"Voir tous les résultats",faqAll:"Voir toutes les questions correspondantes"},
 es:{title:"Buscar",label:"Buscar productos, artículos y preguntas frecuentes",button:"Buscar",note:"La búsqueda usa el idioma actual. Las palabras clave no se traducen al cambiar de idioma.",prompt:"Introduce una palabra clave para buscar productos, artículos, historias, noticias y preguntas frecuentes.",empty:"No se encontró contenido coincidente.",all:"Ver todos los resultados",faqAll:"Ver todas las preguntas coincidentes"},
};

export const searchMessages = completeLocaleMap(searchMessagesSource);
