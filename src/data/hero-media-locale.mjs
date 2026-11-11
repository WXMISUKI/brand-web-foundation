export function heroMediaForLocale(locale, image) {
  if (locale !== "en") return image;
  return image === "/images/official-site/technology.jpg"
    ? "/images/third-party/commons-wheat-texas.webp"
    : image;
}
