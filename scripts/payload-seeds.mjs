// Safe owner-review seeds for an empty Payload database. Replace these values
// through the admin after the owner supplies final brand copy and media.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homepageStaging = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-staging.json"), "utf8"));
const homepagePhase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-localizations-phase1.json"), "utf8"));
const homepagePhase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-localizations-phase2.json"), "utf8"));
const homepagePhase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-localizations-phase3.json"), "utf8"));
export const homepageSeedMedia = homepageStaging.media;
export const homepageSeeds = {
  en: { slides: homepageStaging.slides.en, featured: homepageStaging.featured.en },
  zh: { slides: homepageStaging.slides.zh, featured: homepageStaging.featured.zh },
  ...Object.fromEntries(homepagePhase1.locales.map(locale => [locale, { slides: homepagePhase1.slides[locale], featured: homepagePhase1.featured[locale] }])),
  ...Object.fromEntries(homepagePhase2.locales.map(locale => [locale, { slides: homepagePhase2.slides[locale], featured: homepagePhase2.featured[locale] }])),
  ...Object.fromEntries(homepagePhase3.locales.map(locale => [locale, { slides: homepagePhase3.slides[locale], featured: homepagePhase3.featured[locale] }])),
};

export const companySeeds = {
  en: {
    title: "About Anhui Kangmu International Fertilizer Co., Ltd.",
    summary: "Research, development, production and sales from Bengbu, Anhui",
    description: "The official company site describes Anhui Kangmu as a private technology enterprise integrating fertilizer research, development, production and sales, based in Bengbu's Huai Shang Industrial Park. The source page states the company was established in 2014; operational figures remain subject to review.",
    legalName: "Anhui Kangmu International Fertilizer Co., Ltd.", email: "leon@kowloonglobaltrading.com", whatsapp: "+852 9074 0009", address: "Huai Shang District, Bengbu, Anhui, China · Jinhuai Road east, Kaiyuan Avenue south",
    focusAreas: [
      { title: "Research and development", description: "The official company profile describes an integrated research, development, production and sales enterprise." },
      { title: "Product center", description: "The official product center lists KOMU fertilizer categories and individual product pages; model and packaging details remain under review." },
      { title: "Core technology", description: "The official site provides a separate core technology section; technical claims are kept behind the owner-review gate." },
    ],
  },
  zh: {
    title: "关于安徽康坶国际化肥股份有限公司",
    summary: "来自安徽蚌埠的科研、开发、生产与销售",
    description: "原官网将安徽康坶介绍为集肥料科研、开发、生产和销售于一体的民营科技企业，位于蚌埠市淮上工业园区。来源页面提到公司成立于 2014 年；员工、面积和服务时效等运营数字继续保留待核验状态。",
    legalName: "安徽康坶国际化肥股份有限公司", email: "leon@kowloonglobaltrading.com", whatsapp: "+852 9074 0009", address: "安徽省蚌埠市淮上区沫河口工业园区，金浍路东侧、开源大道南侧",
    focusAreas: [
      { title: "科研与开发", description: "原官网将公司描述为集科研、开发、生产和销售于一体的企业。" },
      { title: "产品中心", description: "原官网产品中心列出康姆肥料类别和单品页面；型号和包装详情继续保持待审核。" },
      { title: "核心技术", description: "原官网设有独立核心技术栏目；技术 claims 继续受 owner-review 门禁保护。" },
    ],
  },
};

export const faqSeeds = [
  {
    slug: "products",
    name: { en: "Product information", zh: "产品信息" },
    questions: [
      { slug: "specifications", question: { en: "Where can I find product specifications?", zh: "在哪里可以查看产品规格？" }, answer: { en: "Open a product page to read the brochure-linked description, package information and source page. Ask us for the latest technical sheet by email or WhatsApp.", zh: "打开产品详情可以查看画册关联说明、包装信息和来源页；如需最新技术资料，可通过邮箱或 WhatsApp 联系我们。" } },
      { slug: "documentation", question: { en: "How can I request product documentation?", zh: "如何获取产品资料？" }, answer: { en: "Send the product name and your market to leon@kowloonglobaltrading.com or WhatsApp +852 9074 0009.", zh: "请将产品名称和目标市场发送至 leon@kowloonglobaltrading.com，或通过 WhatsApp +852 9074 0009 联系。" } },
    ],
  },
  {
    slug: "applications",
    name: { en: "Growing applications", zh: "种植应用" },
    questions: [
      { slug: "choose-products", question: { en: "How do I choose products for a growing application?", zh: "如何为种植场景选择产品？" }, answer: { en: "Start with the crop and growing method, then compare the brochure-linked product descriptions and package formats.", zh: "可以先选择作物和种植方式，再对照画册关联的产品说明和包装规格。" } },
      { slug: "application-guidance", question: { en: "Where can I find application guidance?", zh: "在哪里可以查看应用指导？" }, answer: { en: "Open a crop guide from the Growing Practice menu, then use the product links and contact details to plan the next conversation.", zh: "从种植方案菜单打开作物指南，再结合产品链接和联系方式安排后续沟通。" } },
    ],
  },
  {
    slug: "orders",
    name: { en: "Purchasing and support", zh: "采购与服务" },
    questions: [
      { slug: "enquiry", question: { en: "How can I make a product enquiry?", zh: "如何咨询产品？" }, answer: { en: "Use the contact page or email leon@kowloonglobaltrading.com with the product and market you are interested in.", zh: "可以进入联系页面，或发送产品名称和目标市场至 leon@kowloonglobaltrading.com。" } },
      { slug: "distributor", question: { en: "How can I discuss distribution?", zh: "如何洽谈经销合作？" }, answer: { en: "Contact Anhui Kangmu International Fertilizer Co., Ltd. by email or WhatsApp and include your market and channel profile.", zh: "请通过邮箱或 WhatsApp 联系安徽康坶国际化肥股份有限公司，并说明所在市场和渠道情况。" } },
    ],
  },
];
