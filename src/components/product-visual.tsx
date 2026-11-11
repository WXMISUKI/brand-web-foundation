"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductLocale, ProductMedia } from "../data/products";
import { sharedUiMessages } from "../i18n/shared-ui-messages";

export function ProductVisual({ number, media, locale, productName }: { number: string; media?: ProductMedia; locale: ProductLocale; productName: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    if (media?.src && image?.complete && image.naturalWidth === 0) setFailedSrc(media.src);
  }, [media?.src]);
  const showImage = Boolean(media?.src && media.src !== failedSrc);
  const mediaAlt = media?.alt[locale] || productName;
  const alt = /图片来自官方产品页，文字来源于业主提供的 FLBOOK 第|official product image; text sourced from owner-provided FLBOOK pages/i.test(mediaAlt) ? productName : mediaAlt;
  return <div className="product-visual"><span className="product-number">{number}</span>{showImage && media ? <img ref={imageRef} className="product-image" src={media.src} alt={alt} loading="lazy" onError={() => setFailedSrc(media.src)} /> : <div className="pack"><span>KOMU</span><b>PLANT<br />NUTRITION</b><small>{sharedUiMessages[locale].productImage}</small></div>}</div>;
}
