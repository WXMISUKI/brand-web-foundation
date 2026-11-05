import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = { title: "农业营养 | 原型预览", description: "农业营养网站原型，内容为示例。", robots: { index: false, follow: false } };
export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
