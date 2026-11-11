import { completeLocaleMap } from "./locale-fallback.ts";

export const sharedUiMessages = completeLocaleMap({
  en: { skip: "Skip to main content", productImage: "Product image" },
  zh: { skip: "跳至主要内容", productImage: "产品图片" },
  fr: { skip: "Aller au contenu principal", productImage: "Image du produit" },
  es: { skip: "Ir al contenido principal", productImage: "Imagen del producto" },
  pt: { skip: "Ir para o conteúdo principal", productImage: "Imagem do produto" },
  ru: { skip: "Перейти к основному содержимому", productImage: "Изображение продукта" },
  it: { skip: "Vai al contenuto principale", productImage: "Immagine del prodotto" },
  tr: { skip: "Ana içeriğe geç", productImage: "Ürün görseli" },
  th: { skip: "ข้ามไปยังเนื้อหาหลัก", productImage: "รูปผลิตภัณฑ์" },
  nl: { skip: "Ga naar hoofdinhoud", productImage: "Productafbeelding" },
  ro: { skip: "Sari la conținutul principal", productImage: "Imaginea produsului" },
  el: { skip: "Μετάβαση στο κύριο περιεχόμενο", productImage: "Εικόνα προϊόντος" },
  he: { skip: "דילוג לתוכן הראשי", productImage: "תמונת מוצר" },
});
