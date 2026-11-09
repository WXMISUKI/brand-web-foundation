import { completeLocaleMap } from "./locale-fallback";

const source = {
  en: {
    seriesTitle: "Product series",
    seriesIntro: "Browse the current KOMU product groupings and their brochure-linked pages.",
    seriesDetailIntro: "This series view groups existing product pages. Product facts, specifications and claims remain subject to the review status shown on each page.",
    methodsTitle: "Growing methods",
    methodsIntro: "Explore the growing method routes currently available in the KOMU reference site.",
    reviewNote: "Product information follows the owner-provided brochure link. Final agronomic decisions and claims require review.",
    browse: "Browse series",
    products: "Products in this series",
    methods: "Growing method routes",
    view: "View route",
    back: "Back to all series",
    backMethods: "Back to growing methods",
    empty: "No products are currently mapped to this series.",
  },
  zh: {
    seriesTitle: "产品系列",
    seriesIntro: "浏览当前康姆产品分类及其关联的画册页面。",
    seriesDetailIntro: "本页面按现有产品分类整理产品页面。每个产品的事实、规格和宣称仍以页面审核状态为准。",
    methodsTitle: "种植方式",
    methodsIntro: "浏览当前康姆参考站提供的种植方式入口。",
    reviewNote: "产品资料来自业主提供的画册链接，具体农艺决策和宣称仍需审核。",
    browse: "浏览系列",
    products: "本系列产品",
    methods: "种植方式入口",
    view: "查看入口",
    back: "返回全部系列",
    backMethods: "返回种植方式",
    empty: "当前没有映射到该系列的产品。",
  },
};

export const referenceRouteMessages = completeLocaleMap(source);
