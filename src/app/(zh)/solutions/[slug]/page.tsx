import { notFound } from "next/navigation";
import { Header, Footer } from "../../../../components/site";
import { SolutionContent } from "../../../../components/solution-content";
import { solutions } from "../../../../data/solutions";
export default async function Solution({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=solutions.find(solution=>solution.slug===slug);if(!item)notFound();return <><Header englishPath={`/en/solutions/${slug}`}/><SolutionContent item={item} locale="zh"/><Footer/></>}
