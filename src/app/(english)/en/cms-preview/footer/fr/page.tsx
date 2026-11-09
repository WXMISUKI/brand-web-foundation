import { notFound } from "next/navigation";
import { SiteFooter } from "../../../../../../components/site-footer";
import { MobileQuickLinks } from "../../../../../../components/mobile-quick-links";
export const dynamic = "force-dynamic";
export default async function FrenchFooterPreview() {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  return <><aside className="locale-preview-notice"><strong>Local-only French footer preview · translations require review</strong><p>Links point to public pages that are not yet available in French.</p></aside><div lang="fr" dir="ltr"><main className="inner"><h1>Pied de page · aperçu</h1></main><SiteFooter locale="fr"/><MobileQuickLinks locale="fr" preview/></div></>;
}
