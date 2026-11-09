import { getPayload } from "payload";
import config from "../src/payload.config.ts";

if (process.env.PRODUCTION_OFFICIAL_COMPANY_CONFIRM !== "YES") {
  throw new Error("Set PRODUCTION_OFFICIAL_COMPANY_CONFIRM=YES for this targeted company profile repair.");
}

const payload = await getPayload({ config });
const data = {
  title: {
    en: "About Anhui Kangmu International Fertilizer Co., Ltd.",
    zh: "关于安徽康坶国际化肥股份有限公司",
  },
  summary: {
    en: "Research, development, production and sales from Bengbu, Anhui",
    zh: "来自安徽蚌埠的科研、开发、生产与销售",
  },
  description: {
    en: "The official company site describes Anhui Kangmu as a private technology enterprise integrating fertilizer research, development, production and sales, based in Bengbu's Huai Shang Industrial Park. The source page states the company was established in 2014; operational figures remain subject to review.",
    zh: "原官网将安徽康坶介绍为集肥料科研、开发、生产和销售于一体的民营科技企业，位于蚌埠市淮上工业园区。来源页面提到公司成立于 2014 年；员工、面积和服务时效等运营数字继续保留待核验状态。",
  },
  address: {
    en: "Huai Shang District, Bengbu, Anhui, China · Jinhuai Road east, Kaiyuan Avenue south",
    zh: "安徽省蚌埠市淮上区沫河口工业园区，金浍路东侧、开源大道南侧",
  },
  focusAreas: [
    {
      title: { en: "Research and development", zh: "科研与开发" },
      description: { en: "The official company profile describes an integrated research, development, production and sales enterprise.", zh: "原官网将公司描述为集科研、开发、生产和销售于一体的企业。" },
    },
    {
      title: { en: "Product center", zh: "产品中心" },
      description: { en: "The official product center lists KOMU fertilizer categories and individual product pages; model and packaging details remain under review.", zh: "原官网产品中心列出康姆肥料类别和单品页面；型号和包装详情继续保持待审核。" },
    },
    {
      title: { en: "Core technology", zh: "核心技术" },
      description: { en: "The official site provides a separate core technology section; technical claims are kept behind the owner-review gate.", zh: "原官网设有独立核心技术栏目；技术 claims 继续受 owner-review 门禁保护。" },
    },
  ],
};

await payload.updateGlobal({ slug: "company-profile", data, locale: "all", overrideAccess: true });
console.log(JSON.stringify({ ok: true, global: "company-profile", source: "http://m.zgkomu.cn/info/99186.html", preserved: ["legalName", "email", "whatsapp", "banner", "milestones"] }, null, 2));
process.exit(0);
