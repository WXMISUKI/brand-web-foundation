# 真实浏览器交互验收记录

本记录把真实浏览器证据与现有 HTTP/静态合同分开。历史矩阵使用 Playwright CLI，当前补充使用 Codex in-app browser 的真实生产页面；移动视口约 390px，桌面矩阵仍以 1280×720 记录为准。

## PASS-BROWSER-SCOPED

- 首页桌面：Hero 下一张/上一张、开始/暂停轮播，Crops / Growing methods / Products 三个兴趣标签和案例轮播按钮均能改变状态。
- Header：Crop Guide、Products、Growing Practice、Smart Farming、Corporate、Insights 菜单均能展开；Products 面板的 FAQ、产品目录等链接能完成路由跳转；Corporate 的 About us 和 Smart Farming 的 Web tools 锚点已验证。
- 语言：英文页面语言菜单已展示 13 个生产语言链接；生产 `/en`、`/he`、`/nl`、`/fr`、`/it`、`/es`、`/pt`、`/el`、`/zh`、`/ro`、`/ru`、`/th`、`/tr` 均 HTTP 200，`lang` 和 `index, follow` 回读正确。缺少人工译文的页面仍需英语源回退版本部署复验。
- 产品：目录分类 Water-soluble、产品搜索、产品卡片到详情页、详情页回到目录的关键路径已验证；详情页保留买家可理解的画册页码和来源预览，不显示内部 `excluded-candidate` 候选页。
- FAQ：分类按钮切换、问题展开/收起、搜索并保留 `q` 查询参数已验证。
- News：All/News/Events 筛选、搜索并保留 `type` 与 `q`、新闻详情跳转已验证。
- Insights：topic 筛选、文章与作者搜索、文章详情跳转已验证。
- Site search：Header 搜索输入后跳转 `/en/search?q=...`。
- Solutions：作物指南章节链接能更新 `#crop-stages` 等锚点。
- Resources：SDS 页面字段、上传按钮和提交按钮保持 disabled；Contact 询盘表单按业主授权启用。
- 联系方式：Contact 页展示业主提供的公司名、地址、邮箱和 WhatsApp；邮箱为 `mailto:` 链接，WhatsApp 为 `https://wa.me/85290740009`。
- 移动端：390×844 下 Menu 展开、Products 跳转、语言菜单和搜索入口可用；截图确认菜单和底部快捷栏没有互相遮盖。
- 参数表回归：生产英文产品详情在 390px Chromium 视口下完整渲染新增规格；`.table-scroll` 保持横向滚动提示和独立可聚焦区域，页面根横向裁切规则仍生效，未出现新增字段导致的遮挡或根横向溢出。
- 2026-11-09 P3-B 复验：生产 390×844 产品详情页通过真实 Playwright 回读，根/ body 横向溢出均为 `0`，规格表 `scrollWidth=540`、可视宽度 `351` 且 `overflow-x:auto`；移动菜单 Escape 关闭并回焦点到 Menu，Tab 移出菜单自动关闭。
- 2026-11-09 P3-B 复验：生产 1280×720 Header 的 Products 菜单可通过 Enter 打开、Escape 关闭并回焦点到 Products；展开面板约 `570×222.5px`，未超出视口。
- 2026-11-09 共享菜单改动后，使用正确的 `PREVIEW_EVAL_URL=http://localhost:3123` / 生产 `PREVIEW_URL=https://www.kowloonglobaltrading.com` 边界重跑 About、Products、Information、Editorial、Solutions、Home、Resources 七个 CMS_EVAL 切片，全部通过；`check:locale` 与 RTL CSS 合同通过。
- 2026-11-09 P3-B 方案 A 复验：生产 `/en/products/series`、`/en/products/series/water-soluble`、`/en/solutions` 在 390×844 与 1280×720 真实 Playwright 回读中根横向溢出均为 `0`；系列页 3 个分类卡、系列详情 7 个产品卡、种植方式页 3 个方法卡均可渲染，canonical/alternate 正确，console 0 errors。
- 2026-11-09 真实引擎补验：WebKit iPhone 13（390×664）产品详情根/body 溢出均为 `0`，规格表 `540/351` 横滚正常，快捷栏 `604–664px`，Escape 菜单回焦点，console 0 errors；Chrome Pixel 7（412×839）系列详情根/body 溢出均为 `0`、7 个产品卡、canonical 正确、console 0 errors。
- 2026-11-09 P3 路由矩阵补验：生产 Chromium 对 `/en/products/series`、系列详情、`/en/solutions`、方案详情、`/en/contact`、`/en/faq`、`/en/search?q=nutrition` 逐页执行 390×844 与 1280×720 回读；全部根/body 溢出 0、图片 broken 0，当前会话 Console 0 errors / 0 warnings。
- 2026-11-09 中文公开边界补验：生产 Chromium 对 `/zh`、中文系列/方案、Contact、FAQ、Search 逐页执行 390×844 与 1280×720 回读；全部 `lang=zh-CN`、根/body 溢出 0、图片 broken 0，Console 0 errors / 0 warnings。
- RTL：`/he` 首页真实截图已验证；Products 下拉面板已改为右侧锚定，不再溢出视口；长 Hero 文案已限制宽度并避开右侧快捷栏。
- 2026-11-09 生产移动复验：`/en` 菜单展开后显示完整 Products/FAQ/Contact 路由，Escape 关闭并回焦点到 Menu；`/en/contact` 询盘卡片在移动视口内无水平溢出，字段、同意勾选和按钮可见。
- 2026-11-09 生产询盘回归：使用非敏感验收样例提交后按钮经历 `Sending…`，随后显示 “Your enquiry was recorded. The KOMU team can review it in the admin panel.”；这证明记录链路，不证明邮件送达。
- 2026-11-09 生产 Hebrew 复验：`/he` `dir=rtl`、导航、兴趣切换、产品卡和底部快捷栏均可见，截图未见遮挡或根横向溢出；页面仍含部分待翻译文案，不能把视觉通过当作完整译文通过。
- Console：补充 favicon 后，当前浏览器会话 `console error` 返回 0 errors / 0 warnings；`/favicon.svg` HTTP 200。
- P2 公网回归：首页、新闻、知识、案例图片 `alt` 不再输出 JSON 对象；About 缺失里程碑和 Contact 缺失地址不再显示 `Information unavailable`。
- 2026-11-10 本地 CMS_EVAL 浏览器补验：`http://localhost:3123` 在 Chromium 390px 视口逐一访问 13 个 locale，均返回 `200`，`lang`/`dir` 正确，`scrollWidth=375 <= viewport 390`；浏览器 console error 为 0。English 1280×720 首页、Hebrew 390×844 首页和 Hebrew 移动菜单展开截图已保存到 `output/playwright/home-en-1280.png`、`output/playwright/home-he-390.png`、`output/playwright/home-he-390-menu-open.png`。
- 本地实例使用 `.env` 的 sample 数据源，故该轮只证明公开路由、RTL/响应式布局、菜单交互和资源加载；Hebrew 首页仍可观察到 `译文暂未提供`、`Information unavailable` 及部分英文资源入口。这证明本地 CMS 多语言草稿尚未接入该 sample 运行时，不能扩大为 13 语言业务内容通过。
- 2026-11-10 组件内联文案补验：补齐 `SustainabilityContent`、`HomeCompanyFocus` 的 13 locale authored map 后，在本地 Hebrew 390px 访问 `/he`、`/he/sustainability`、`/he/sds-request` 均为 200、`lang=he`、`dir=rtl`、`scrollWidth=390`、console error 0；页面不再出现 `Information unavailable`，资源页出现 Hebrew 文案。页脚仍有少量硬编码英文入口，继续保持 `PARTIAL`。
- 2026-11-10 隔离 Payload 浏览器补验：使用现有 `prepare:flbook`/`import:flbook` 链路建立临时 SQLite + media 预览库，`CATALOG_SOURCE=payload` 下 Hebrew `/he`、`/he/about`、`/he/products` 和 Portuguese `/pt`、`/pt/products` 均返回 200；390px 下根宽度为 390，未出现待翻译占位或英文资源标签，console error 0。截图保存在 `output/playwright/home-he-payload-390.png`、`output/playwright/products-pt-payload-390.png`。预览库及媒体已在验收后删除，未写生产。
- 2026-11-10 UI inline map 批次 C 本地浏览器补验：开发实例 `CMS_EVAL=1 CATALOG_SOURCE=sample :3123` 的 Hebrew 首页在 390×844 下 `lang=he`、`dir=rtl`、`scrollWidth=390`，截图保存为 `output/playwright/home-he-inline-maps-390.png`；页面仍显示 sample 内容，且开发 HMR WebSocket 产生连接错误，因此本条仅记为 `PARTIAL`，不扩大为 console-clean 或业务内容 PASS。
- 2026-11-10 依赖升级后生产浏览器补验：公网 Hebrew 首页 390×844 的 `lang=he`、`dir=rtl`、`scrollWidth=390`、console 0；英文产品系列与方案索引在 390px 下 `scrollWidth=390`，系列入口 3 个、方案入口可见。懒加载图片未全部进入视口，不能据此记完整图片矩阵 PASS；直接媒体 HTTP 回读均为 200，整体视觉证据保持 `PARTIAL`。
- 2026-11-10 本地阶段 2 Header 验收：英文 1280×720、英文 390×844、Hebrew RTL 390×844 均验证 Header 初始 expanded、滚动 120px 后 collapsed、回顶恢复 expanded；品牌标签尺寸按状态变化，根/body 宽度未溢出，console 0。对应回归测试为 `tests/header-scroll.spec.mjs`；当前仅记本地 `PASS-SCOPED`，生产状态待后续授权发布后回读。

## PASS-HTTP / PASS-STATIC（不能替代上面的点击证据）

- `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke`：23/23（P1 重启后回归）。
- `npm run typecheck`：通过。
- `npm run test:rtl-css`：通过。
- `npm run check:locale`：通过，13 个 configured locales 均为 public、`noindex=false`、`inquiryEnabled=true`。
- `git diff --check`：通过。

## CONDITIONAL / NOT RUN

- 13 语言逐页人工翻译、邮件/询盘实际送达仍未证明；询盘已证明 Payload 记录成功，未配置 SMTP。SEO canonical/alternate、robots、sitemap、index/follow 已完成 HTTP 合同验收。
- 键盘/焦点的共享导航关键状态已补做生产验收；真实 iOS Safari、Android Chrome 和完整长译文仍未覆盖。
- 新闻和产品当前样例数据没有形成足够多页，因此浏览器侧没有观察到“下一页”按钮；分页参数由 HTTP 合同测试覆盖。
- Hebrew 及部分其他语言当前仍有待翻译占位文案；共享 Payload 版本和英语源回退部署完成后必须重新回读，不能把现有占位词当作最终正式文案。

## 2026-11-10 正式 G3–G6 回归

- 真实浏览器矩阵最终 150/150：覆盖 390×844、768×844、1280×720、1440×900；13 locale 首页、en/zh/he 关键页面和其他语言代表页面均通过 console、可见图片、lang/dir、根/body 宽度检查。
- 组件几何：长语言 Header、Hebrew RTL 文档宽度和移动 Header Logo 层叠问题已修复；最新代表截图与 bounding-box 结果未发现异常越界或遮挡。
- 当前生产关键交互测试通过：移动菜单打开/Escape 关闭、13 locale 语言菜单、FAQ 展开、产品入口、Hebrew RTL；`test:smoke` 23/23、`test:seo` 5/5、route contract 3/3。
- 技术交互验收为 `PASS-SCOPED`；专业翻译和全部真实设备/人工长译文审校继续保持 `PARTIAL`。

## 2026-11-10 Hero 热修复生产补验

- 依赖升级后首次生产截图暴露 Hero 背景图内嵌中文横幅；该问题已由提交 `8e141d2` 修复并部署，build ID 为 `kQvA_SEwMLo_zDx9zdImU`。
- `output/playwright/production-en-390-hero-hotfix.png`：390px 生产首页 Hero 使用干净研究室素材，英文文案正常叠加；没有再出现中文横幅覆盖英文文案的情况。

## 2026-11-10 翻译回填后生产浏览器复验

- `ACCEPTANCE_SCOPE=fast` 生产浏览器矩阵覆盖 3 个代表 locale、4 个关键路由和 2 个视口，共 24/24 通过；等待窗口提高到 10 秒后，News 页面慢加载的 `hero-01.jpg` 不再被误判为 broken image。
- 生产关键交互测试 1/1 通过：移动菜单 Escape、语言菜单 13 locale、FAQ 展开、产品入口和 Hebrew RTL 边界均通过。
- 生产 `/api/media/file/hero-01.jpg` 返回 HTTP 200；此前失败是慢响应窗口问题，不是媒体文件不存在。
- 公网 `/zh` SSR 回读：`lang=zh-CN`、`dir=ltr`，Hero 背景为 `/images/official-site/company-research.jpg`；`hero-01.jpg` 仅在作物兴趣卡片中出现。
- 生产 health/readiness、13 locale 公网基线和匿名产品 API 403 均已复核；Hero 清理为 `PASS-SCOPED`。
- 仍保持 `PARTIAL`：全站全部图片逐张视觉检查、懒加载图片完整浏览器矩阵、专业母语翻译和长文案遮挡审校尚未完成。
