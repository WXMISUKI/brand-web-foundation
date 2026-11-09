# 参考页面与本地实现映射

更新：2026-11-06。此表用于逐页对照，不代表视觉或功能已验收；参考地址仅用于研究，业主素材与信息仍待提供。`{locale}` 中英文可访问，法语仅隔离开发预览，其余语言尚未开放。

| 参考页面 | 本地页面 | 主要实现文件 | 当前边界 |
| --- | --- | --- | --- |
| [首页](https://www.haifa-group.com/) | `/{locale}` | `src/app/(localized)/[locale]/page.tsx`、`src/components/hero.tsx`、`interest-section.tsx`、`home-products.tsx` | 图片与文字多为示例；参考视频、完整交互与视觉对照未完成。 |
| [产品目录](https://www.haifa-group.com/products-catalog) | `/{locale}/products` | `src/components/catalog-page.tsx`、`catalog-overview.tsx`、`catalog-controls.tsx` | 分类、产品可由后台读取；分类图及说明仍有占位，悬停与手机已有有限验证。 |
| [产品系列示例](https://www.haifa-group.com/multi-k-potassium-nitrate-fertilizers-formula) | `/{locale}/products/series/{slug}` | `src/components/product-series-page.tsx`、`src/app/(localized)/[locale]/products/series/` | 已补齐轻量系列索引/详情结构，复用现有分类和产品数据；系列级长文案、型号列和下载仍未接入。 |
| [产品类型列表](https://www.haifa-group.com/products-type/plant-nutrition) | `/{locale}/products` | `src/components/catalog-page.tsx`、`catalog-controls.tsx` | 本地用分类和关键词筛选承接；参考站的产品类型层级和分页状态仍需逐项对照。 |
| [单品详情示例](https://www.haifa-group.com/multi-k-gg) | `/{locale}/products/{slug}` | `src/components/catalog-product-detail.tsx`、`product-information.tsx` | 有产品参数和图片接口；真实型号对照、材料及询盘待确认。 |
| [作物指南示例](https://www.haifa-group.com/crop-guide/vegetables/tomato) | `/{locale}/solutions/{slug}` | `src/components/solution-content.tsx`、`crop-guide-sections.tsx` | 使用少量示例场景；未接入真实作物生长阶段或产品关联。 |
| [种植方式入口](https://www.haifa-group.com/nurseries) | `/{locale}/solutions` + `/{locale}/solutions/{slug}` | `src/components/solutions-index-page.tsx`、`src/components/solution-content.tsx` | 已补齐轻量索引并复用现有方法数据；完整筛选、作物关系和农艺推荐仍未接入。 |
| [智慧农业](https://www.haifa-group.com/articles/online-expert) | `/{locale}/smart-farming` | `src/components/smart-farming-content.tsx` | 展示分类结构；无真实工具、应用下载或推荐服务。 |
| [企业介绍](https://www.haifa-group.com/about-us-0) | `/{locale}/about` | `src/components/about-content.tsx`、`src/content/company-profile.ts` | 企业简介、重点及历程可读取后台；真实资料和完整视觉待核对。 |
| [常见问题](https://www.haifa-group.com/faq) | `/{locale}/faq` | `src/components/faq-content.tsx`、`src/content/faq.ts` | 分类及内容可读取后台；业务问答和完整对照待完成。 |
| [新闻与活动](https://www.haifa-group.com/news-events) | `/{locale}/news` | `src/components/news-content.tsx`、`src/content/news.ts` | News/Events 筛选与双语详情已接入；正式新闻资料和完整分页仍需内容审核。 |
| [联系](https://www.haifa-group.com/contact-us-1) | `/{locale}/contact` | `src/components/contact-content.tsx`、`src/content/company-profile.ts` | 邮箱和 WhatsApp 直达已接入；站内询盘保持关闭，收件与隐私链路未启用。 |
| [安全数据表申请](https://www.haifa-group.com/products/sds-request) | `/{locale}/sds-request` | `src/components/product-resources.tsx` | 表单及上传禁用，无申请接收服务。 |
| [质量保证](https://www.haifa-group.com/quality-assurance) | `/{locale}/quality-assurance` | `src/components/product-resources.tsx` | 质量流程和证书均为待确认占位，无证书下载。 |
| [可持续发展战略示例](https://www.haifa-group.com/precision-impact/strategy) | `/{locale}/sustainability` | `src/components/sustainability-content.tsx` | 中英文专题预览，法语仅隔离开发；有桌面直达入口，内容、图片及参考站多级专题菜单待完善。 |

文章、案例、新闻、联系和搜索已有对应本地页面；参考页面及交互仍需逐项补充对照，不能因路由存在而视为完成。共享导航、页脚分别由 `src/components/site-header.tsx`、`navigation-menu.tsx`、`mobile-menu.tsx` 和 `site-footer.tsx` 管理。

每次复刻按相同桌面／手机视口记录页面顺序、关键尺寸、默认及交互状态；识别素材来源和授权状态；在本地验证同一交互及数据来源。具体已观察结果与未完成项见 [页面对照](page-comparison.md)，资料与技术方案见 [项目规格](spec.md)。
