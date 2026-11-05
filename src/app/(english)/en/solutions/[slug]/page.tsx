import { notFound } from "next/navigation";
import { EnglishHeader, EnglishFooter } from "../../../../../components/english-site";
import { SolutionContent } from "../../../../../components/solution-content";
import { solutions } from "../../../../../data/solutions";
export default async function EnglishSolution({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=solutions.find(solution=>solution.slug===slug);if(!item)notFound();return <><EnglishHeader chinesePath={`/solutions/${slug}`}/><SolutionContent item={item} locale="en"/><EnglishFooter/></>}
