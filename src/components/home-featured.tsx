import Link from "next/link";

export function HomeFeatured({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const cards = en ? [
    { title: "About the company", description: "Company profile and capabilities await owner confirmation.", action: "About the company", href: `${prefix}/about` },
    { title: "Explore product categories", description: "Browse sample plant nutrition products and categories.", action: "View products", href: `${prefix}/products` },
    { title: "Explore growing applications", description: "View an example growing scenario awaiting technical review.", action: "View sample guide", href: `${prefix}/solutions/greenhouse` },
  ] : [
    { title: "了解企业", description: "企业介绍和业务能力等待业主确认。", action: "查看企业介绍", href: "/about" },
    { title: "探索产品系列", description: "浏览植物营养产品和分类示例。", action: "查看产品", href: "/products" },
    { title: "了解种植应用", description: "查看等待技术审核的种植场景示例。", action: "查看示例方案", href: "/solutions/greenhouse" },
  ];
  return <section className="home-featured" aria-label={en ? "Featured topics" : "精选内容"}><p className="home-featured-note">{en ? "Sample topics and images · content awaiting owner review" : "示例主题与图片 · 内容待业主确认"}</p><div className="home-featured-grid">{cards.map((card) => <article className="home-feature-card" key={card.href}><div className="home-feature-copy"><h2>{card.title}</h2><p>{card.description}</p><Link className="home-feature-link" href={card.href}>{card.action} <span aria-hidden="true">↗</span></Link></div><div className="home-feature-image" aria-hidden="true" /></article>)}</div></section>;
}
