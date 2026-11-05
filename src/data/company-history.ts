// Replace only with milestones and media reviewed by the owner.
export type CompanyMilestone = {
  id: string;
  period: string;
  text: Partial<Record<"zh" | "en", { title: string; description: string }>>;
  image?: { src: string; alt: Partial<Record<"zh" | "en", string>> };
};
export const companyHistory: CompanyMilestone[] = [];
