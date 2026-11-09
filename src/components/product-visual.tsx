"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductLocale, ProductMedia } from "../data/products";
import { aboutMessages } from "../i18n/about-messages";

export function ProductVisual({ number, media, locale, productName }: { number: string; media?: ProductMedia; locale: ProductLocale; productName: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    if (media?.src && image?.complete && image.naturalWidth === 0) setFailedSrc(media.src);
  }, [media?.src]);
  const showImage = Boolean(media?.src && media.src !== failedSrc);
  return <div className="product-visual"><span className="product-number">{number}</span>{showImage && media ? <img ref={imageRef} className="product-image" src={media.src} alt={media.alt[locale] || productName} loading="lazy" onError={() => setFailedSrc(media.src)} /> : <div className="pack"><span>KOMU</span><b>PLANT<br />NUTRITION</b><small>{locale === "en" ? "Product image" : locale === "zh" ? "产品图片" : aboutMessages[locale].sample}</small></div>}</div>;
}
