import Link from "next/link";
import { productCategories, products } from "../data/products";
import { englishCategories } from "../data/english-samples";

export function CatalogOverview({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  return <section className="catalog-overview" aria-labelledby="catalog-title">
    <div className="catalog-intro"><span className="eyebrow">PRODUCT CATALOG · {en ? "SAMPLE" : "示例"}</span><h1 id="catalog-title">{en ? "Product catalog" : "产品中心"}</h1><p>{en ? "Explore sample plant nutrition categories and products. Names, specifications and translations await owner review." : "从产品类别出发，探索适合不同种植需求的植物营养方案。产品名称、规格与资料均为示例，等待业主审核。"}</p><div className="catalog-intro-note"><strong>{en ? "About this preview" : "关于此原型"}</strong><p>{en ? "Choose a category to see its sample products. Final categories and product information will be confirmed with the owner." : "选择一个类别，查看对应示例产品。正式分类及产品资料将根据业主提供的内容确认。"}</p></div></div>
    <div className="catalog-category-grid">{productCategories.map((category,index)=>{
      const count = products.filter(product=>product.categoryId===category.id).length;
      return <Link className={`catalog-category catalog-category-${index+1}`} key={category.id} href={`${en?"/en":""}/products?category=${category.id}#catalog-results`}><span className="catalog-symbol" aria-hidden="true">{["✳","◌","✧"][index]}</span><span className="catalog-category-label"><span><strong>{en?englishCategories[category.id]:category.name}</strong><small>{en?`${count} sample ${count === 1 ? "product" : "products"}`:`${count} 条示例产品`}</small></span><span className="catalog-arrow" aria-hidden="true">↗</span></span></Link>;
    })}</div>
  </section>;
}
