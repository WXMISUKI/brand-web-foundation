import { completeLocaleMap } from "./locale-fallback.ts";
// French UI labels are a draft; carousel content is separately localized in the CMS.
const heroMessagesSource = {
 en:{topics:"Featured topics",carousel:"carousel",controls:"Carousel controls",pause:"Pause rotation",play:"Start rotation",previous:"Previous slide",next:"Next slide",sampleText:"KOMU plant nutrition",sampleImage:"KOMU plant nutrition",featuredNote:"Explore plant nutrition and growing applications"},
 zh:{topics:"首页主题轮播",carousel:"轮播",controls:"轮播控制",pause:"暂停轮播",play:"播放轮播",previous:"上一张",next:"下一张",sampleText:"康姆植物营养",sampleImage:"康姆植物营养",featuredNote:"探索植物营养与种植应用"},
 fr:{topics:"Sujets à la une",carousel:"carrousel",controls:"Commandes du carrousel",pause:"Mettre en pause",play:"Démarrer le défilement",previous:"Diapositive précédente",next:"Diapositive suivante",sampleText:"Texte et image d’exemple · non fournis par l’entreprise",sampleImage:"Image d’exemple · non fournie par l’entreprise",featuredNote:"Sujets et images d’exemple · contenu à confirmer"},
 es:{topics:"Temas destacados",carousel:"carrusel",controls:"Controles del carrusel",pause:"Pausar rotación",play:"Iniciar rotación",previous:"Diapositiva anterior",next:"Diapositiva siguiente",sampleText:"Texto e imagen de ejemplo · no facilitados por la empresa",sampleImage:"Imagen de ejemplo · no facilitada por la empresa",featuredNote:"Temas e imágenes de ejemplo · pendientes de confirmación"},
};

export const heroMessages = completeLocaleMap(heroMessagesSource);
