import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = { title: "Plant Nutrition | Prototype", description: "Plant nutrition website prototype with sample content.", robots: { index: false, follow: false } };
export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
