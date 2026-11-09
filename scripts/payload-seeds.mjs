// Safe owner-review seeds for an empty Payload database. Replace these values
// through the admin after the owner supplies final brand copy and media.
export const homepageSeedMedia = [
  { key: "hero-field", path: "public/images/official-site/hero-01.jpg", alt: { en: "Official KOMU crop nutrition banner", zh: "康姆官方作物营养横幅" } },
  { key: "hero-greenhouse", path: "public/images/official-site/hero-02.jpg", alt: { en: "Official KOMU crop quality banner", zh: "康姆官方作物品质横幅" } },
  { key: "hero-orchard", path: "public/images/official-site/hero-03.jpg", alt: { en: "Official KOMU plant nutrition banner", zh: "康姆官方植物营养横幅" } },
  { key: "company-banner", path: "public/images/official-site/company-products.jpg", alt: { en: "Official KOMU product display", zh: "康姆官方产品展示" } },
];

export const homepageSeeds = {
  en: {
    slides: [
      { eyebrow: "NURTURE EVERY POSSIBILITY", title: "Nutrition for every stage of growth.", description: "Explore KOMU plant nutrition products and crop application routes.", actionLabel: "Explore products", actionPath: "/products", imageKey: "hero-field" },
      { eyebrow: "GROW WITH CARE", title: "Understand crops, plan nutrition.", description: "Compare product categories and growing environments in one guide.", actionLabel: "Explore solutions", actionPath: "/solutions/greenhouse", imageKey: "hero-greenhouse" },
      { eyebrow: "ROOTED IN GROWTH", title: "Growing with practical care.", description: "Meet Anhui Kangmu International Fertilizer Co., Ltd. and its product collection.", actionLabel: "About us", actionPath: "/about", imageKey: "hero-orchard" },
    ],
    featured: [
      { title: "Product catalogue", description: "Browse ten products transcribed from the owner-provided brochure.", actionLabel: "Explore products", actionPath: "/products", imageKey: "hero-field" },
      { title: "Growing applications", description: "Explore crop and growing practice routes for product discovery.", actionLabel: "Explore solutions", actionPath: "/solutions/greenhouse", imageKey: "hero-greenhouse" },
      { title: "Company profile", description: "Learn about Anhui Kangmu International Fertilizer Co., Ltd. and KOMU plant nutrition.", actionLabel: "About us", actionPath: "/about", imageKey: "hero-orchard" },
    ],
  },
  zh: {
    slides: [
      { eyebrow: "NURTURE EVERY POSSIBILITY", title: "用专业营养，陪伴每一次生长。", description: "探索康姆植物营养产品与作物应用路径。", actionLabel: "探索产品", actionPath: "/products", imageKey: "hero-field" },
      { eyebrow: "GROW WITH CARE", title: "关注作物需求，规划营养方案。", description: "从作物与种植方式出发，了解产品分类。", actionLabel: "查看方案", actionPath: "/solutions/greenhouse", imageKey: "hero-greenhouse" },
      { eyebrow: "ROOTED IN GROWTH", title: "理解土地，也理解种植者。", description: "了解安徽康母国际化肥股份有限公司与康姆产品系列。", actionLabel: "了解我们", actionPath: "/about", imageKey: "hero-orchard" },
    ],
    featured: [
      { title: "产品目录", description: "浏览根据业主画册整理的十条产品资料。", actionLabel: "探索产品", actionPath: "/products", imageKey: "hero-field" },
      { title: "种植应用", description: "按作物与种植方式进入营养应用指南。", actionLabel: "查看方案", actionPath: "/solutions/greenhouse", imageKey: "hero-greenhouse" },
      { title: "关于我们", description: "了解安徽康母国际化肥股份有限公司与康姆产品系列。", actionLabel: "了解我们", actionPath: "/about", imageKey: "hero-orchard" },
    ],
  },
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
      { slug: "distributor", question: { en: "How can I discuss distribution?", zh: "如何洽谈经销合作？" }, answer: { en: "Contact Anhui Kangmu International Fertilizer Co., Ltd. by email or WhatsApp and include your market and channel profile.", zh: "请通过邮箱或 WhatsApp 联系安徽康母国际化肥股份有限公司，并说明所在市场和渠道情况。" } },
    ],
  },
];
