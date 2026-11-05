import { HomeFeatured } from "../../components/home-featured";
import { HomeProducts } from "../../components/home-products";
import Link from "next/link";
import { Header, Footer } from "../../components/site";
import { Interest } from "../../components/interest";
import { Hero } from "../../components/hero";
import { HomeStories } from "../../components/home-stories";
export default function Home(){return <><Header/><main><Hero/><Interest/><HomeFeatured locale="zh" /><HomeProducts locale="zh" /><section className="story"><div className="story-art"><span>ROOTED IN<br/>BETTER GROWTH</span></div><div className="story-copy"><span className="eyebrow">ABOUT US</span><h2>理解土地，<br/>也理解种植者。</h2><p>从产品研发到应用服务，企业介绍和真实能力将在业主资料确认后更新。</p><Link className="button green" href="/about">了解我们 <span>↗</span></Link></div></section><HomeStories locale="zh" /></main><Footer/></>}
