import type { CollectionConfig, Field, GlobalConfig } from "payload";

const collections: Record<string, [string, string]> = {
  users: ["Users", "管理员"], inquiries: ["Product inquiries", "产品询盘"], media: ["Media", "媒体素材"],
  categories: ["Categories", "产品分类"], products: ["Products", "产品"], news: ["News", "新闻"],
  insights: ["Knowledge articles", "知识文章"], cases: ["Growing stories", "种植案例"],
  "crop-guides": ["Crop guides", "作物指南"], "faq-groups": ["FAQ categories", "常见问题分类"], faqs: ["FAQs", "常见问题"],
};
const globals: Record<string, [string, string]> = { "company-profile": ["Company profile", "企业介绍"], homepage: ["Homepage slides", "首页内容"] };
const fieldLabels: Record<string, string> = {
  name: "名称", email: "邮箱", country: "国家或地区", phone: "电话", role: "身份或角色", message: "询盘内容", locale: "内容语言",
  sourcePath: "来源页面", consent: "隐私同意", status: "状态", ownerNote: "内部处理备注", website: "网站",
  alt: "图片替代文字", slug: "网址标识", category: "产品分类", intro: "产品简介", image: "图片", materials: "成分资料",
  packaging: "包装与规格", uses: "适用场景", instructions: "使用说明", sourceUrl: "来源网址", sourcePages: "画册页码",
  page: "页码", sourceRelatedPages: "关联来源页面", note: "备注", sourcePreviewPath: "画册预览路径", sourceDetailPreviewPath: "详情预览路径",
  sourceNote: "资料来源备注", reviewStatus: "资料审核状态", assetStatus: "素材状态", claimsVerified: "技术描述已核实", specifications: "技术参数",
  label: "参数名称", unit: "单位", typical: "典型值", minimum: "最小值", maximum: "最大值", kind: "内容类型", title: "标题",
  summary: "摘要", body: "旧版正文", richBody: "正文", publishedOn: "发布日期", topics: "主题", author: "作者",
  nav: "指南导航标题", overview: "概述", stages: "生长阶段标题", stagesText: "生长阶段说明", nutrition: "营养说明", products: "相关产品说明",
  browse: "浏览产品按钮文字", resources: "资源标题", resourcesText: "资源说明", sections: "指南章节", key: "章节标识", sortOrder: "排序",
  group: "问题分类", question: "问题", answer: "回答", description: "详细介绍", legalName: "公司法定名称", whatsapp: "WhatsApp", address: "地址",
  banner: "横幅图片", focusAreas: "业务方向", milestones: "发展历程", period: "时间", slides: "首页轮播", featured: "首页精选内容",
  eyebrow: "小标题", actionLabel: "按钮文字", actionPath: "按钮链接路径",
};
const optionLabels: Record<string, string> = {
  new: "新询盘", "in-progress": "处理中", qualified: "已确认", closed: "已关闭", spam: "垃圾信息",
  draft: "草稿", "owner-review": "待确认", approved: "已确认", rejected: "不采用", "asset-pending": "素材待补充",
  "generated-placeholder": "生成示意素材", "owner-supplied": "业主提供", "authorized-example": "授权示例", pending: "待补充",
  "excluded-candidate": "排除的候选页", "cross-page-context": "跨页上下文", news: "新闻", event: "活动",
  en: "英语", zh: "简体中文", he: "希伯来语", nl: "荷兰语", fr: "法语", it: "意大利语", es: "西班牙语", pt: "葡萄牙语",
  el: "希腊语", ro: "罗马尼亚语", ru: "俄语", th: "泰语", tr: "土耳其语",
};
export const adminLocaleLabel = (code: string, nativeLabel: string) => ({ en: nativeLabel, zh: optionLabels[code] ?? nativeLabel });
const descriptions: Record<string, [string, string]> = {
  sourceUrl: ["Authorised source URL for the draft content.", "内容资料的授权来源网址。"],
  sourcePages: ["Page numbers in the source brochure.", "资料对应的画册页码。"],
  sourceRelatedPages: ["Adjacent brochure candidates or context pages kept for provenance.", "用于内部追溯的相关画册页面。"],
  sourcePreviewPath: ["Page preview path captured from the owner-provided brochure.", "画册页面预览的站内路径。"],
  sourceDetailPreviewPath: ["Optional single-page crop used for product detail provenance preview.", "产品详情页使用的单页预览路径，可留空。"],
  sourceNote: ["Provenance note; keep until owner review is complete.", "内部资料来源备注，请保留以便追溯。"],
  actionPath: ["Site-relative path without language prefix, e.g. /products or /about", "填写不含语言前缀的站内路径，例如 /products 或 /about。"],
};

const humanize = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, value => value.toUpperCase());

export function localizeAdminFields(fields: Field[], scope: string): Field[] {
  return fields.map((field) => {
    let result = { ...field } as Field;
    if ("name" in result && typeof result.name === "string") {
      const name = result.name;
      const translated = scope === "inquiries" && name === "name" ? "姓名" : fieldLabels[name];
      if (translated && !("label" in result && result.label === false)) {
        const existing = "label" in result && typeof result.label === "string" ? result.label : humanize(name);
        result = { ...result, label: { en: existing, zh: translated } } as Field;
      }
      if ("admin" in result && result.admin && descriptions[name] && "description" in result.admin) {
        result = { ...result, admin: { ...result.admin, description: { en: descriptions[name][0], zh: descriptions[name][1] } } } as Field;
      }
      if ("options" in result && Array.isArray(result.options)) {
        const options = result.options.map(option => {
          const value = typeof option === "string" ? option : option.value;
          if (typeof value !== "string" || !optionLabels[value]) return option;
          const english = typeof option === "string" ? humanize(value.replaceAll("-", " ")) : option.label;
          return { value, label: { en: typeof english === "string" ? english : value, zh: optionLabels[value] } };
        });
        result = { ...result, options } as Field;
      }
      if (result.type === "array" && translated) {
        const english = humanize(name);
        result = { ...result, labels: { singular: { en: english, zh: translated }, plural: { en: english, zh: translated } } } as Field;
      }
    }
    if ("fields" in result && Array.isArray(result.fields)) result = { ...result, fields: localizeAdminFields(result.fields, scope) } as Field;
    return result;
  });
}

export function localizeAdminCollection(config: CollectionConfig): CollectionConfig {
  const names = collections[config.slug];
  const singular = typeof config.labels?.singular === "string" ? config.labels.singular : names?.[0];
  const plural = typeof config.labels?.plural === "string" ? config.labels.plural : names?.[0];
  return { ...config, ...(names ? { labels: { singular: { en: singular ?? names[0], zh: names[1] }, plural: { en: plural ?? names[0], zh: names[1] } } } : {}), fields: localizeAdminFields(config.fields, config.slug) };
}

export function localizeAdminGlobal(config: GlobalConfig): GlobalConfig {
  const names = globals[config.slug];
  return { ...config, ...(names ? { label: { en: names[0], zh: names[1] } } : {}), fields: localizeAdminFields(config.fields, config.slug) };
}
