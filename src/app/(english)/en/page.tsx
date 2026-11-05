import { HomeFeatured } from "../../../components/home-featured";
import { HomeProducts } from "../../../components/home-products";
import Link from "next/link";
import { HomeStories } from "../../../components/home-stories";
import { Hero } from "../../../components/hero";
import { Interest } from "../../../components/interest";
import { EnglishHeader, EnglishFooter } from "../../../components/english-site";

export default function EnglishHome() {
  return <div lang="en"><EnglishHeader chinesePath="/" /><main><Hero locale="en" /><Interest locale="en" /><HomeFeatured locale="en" /><HomeProducts locale="en" /><section className="story"><div className="story-art"><span>ROOTED IN<br />BETTER GROWTH</span></div><div className="story-copy"><span className="eyebrow">ABOUT US</span><h2>Growing together<br />with growers.</h2><p>Company information and capabilities await owner confirmation.</p><Link className="button green" href="/en/about">About us ↗</Link></div></section><HomeStories locale="en" /></main><EnglishFooter /></div>;
}
