import Link from "next/link";

export function AboutContent({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  const cards = en ? ["Products & nutrition", "Research & quality", "Grower services"] : ["产品与营养", "研发与品质", "种植服务"];
  return <main>
    <div className="about-banner-wrap"><div className="about-banner"><span>{en ? "GROWING TOGETHER · SAMPLE" : "携手生长 · 原型示例"}</span><p>{en ? "Growing together with growers" : "与种植者一起，面向更好的生长"}</p><small>{en ? "Sample image · not owner material" : "示例图片 · 非业主素材"}</small></div></div>
    <div className="inner about-page"><nav className="crumb" aria-label={en ? "Breadcrumb" : "面包屑导航"}><Link href={en ? "/en" : "/"}>{en ? "Home" : "首页"}</Link> / {en ? "About" : "关于我们"}</nav>
      <section className="about-introduction"><span className="eyebrow">ABOUT US · {en ? "SAMPLE" : "示例"}</span><h1>{en ? "About the company" : "关于我们"}</h1><p className="about-lead">{en ? "A place for the owner’s reviewed company introduction." : "这里将展示经业主审核的企业介绍。"}</p><p>{en ? "The company profile, capabilities, location and imagery are awaiting owner confirmation. The text and images shown here are placeholders for the prototype." : "企业简介、业务能力、所在地及相关图片均待业主确认。当前文字和图片仅用于原型展示。"}</p></section>
      <section className="about-themes" aria-labelledby="themes-title"><h2 id="themes-title">{en ? "Our focus" : "我们的关注方向"}</h2><div className="about-theme-grid">{cards.map((card,index)=><article key={card}><span className="about-theme-number">0{index+1}</span><h3>{card}</h3><p>{en ? "Information and supporting materials await confirmation." : "相关介绍与证明资料待业主确认。"}</p></article>)}</div></section>
      <section className="about-history" aria-labelledby="history-title"><div><span className="eyebrow">OUR JOURNEY</span><h2 id="history-title">{en ? "Our journey" : "发展历程"}</h2><p>{en ? "Company milestones will be added after the owner confirms the dates and descriptions." : "企业重要节点将在业主确认时间与内容后补充。"}</p></div><div className="history-placeholder"><span aria-hidden="true">●</span><div><strong>{en ? "Milestones pending" : "发展节点待确认"}</strong><p>{en ? "No dates or achievements have been supplied yet." : "目前尚未提供经确认的年份和事件。"}</p></div></div></section>
      <div className="about-contact-link"><Link className="button green" href={en ? "/en/contact" : "/contact"}>{en ? "Contact us" : "联系我们"} <span aria-hidden="true">↗</span></Link></div>
    </div>
  </main>;
}
