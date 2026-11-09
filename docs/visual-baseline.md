# 复刻视觉基线

更新时间：2026-11-08

本记录用于把参考站与本地原型放在同一视口下对照。它是开发验收证据，不代表整站已经达到最终视觉通过。

## 1280 × 720 桌面首页

参考站 `https://www.haifa-group.com/` 的首屏观察：顶部导航约 68px；中央品牌卡片向下覆盖首屏；Hero 下缘的兴趣区从约 425px 开始；右侧固定联系、经销商和 Partner Zone 快捷入口；兴趣区首屏可看到多张作物卡片。

本地 `/en` 当前测量：

- viewport：1280 × 720，实际布局宽度 1264.8px（浏览器滚动条占用宽度）；
- header：top 0，height 68px；
- hero：top 68px，height 455px；
- interest：top 423px，使用负边距叠在 Hero 上；
- `document.documentElement.scrollWidth` 未超过 viewport，没有横向溢出；
- Hero CTA 在桌面基线中隐藏，以匹配参考站当前首屏没有按钮的状态；
- 作物入口已扩展为可滚动的示例作物列表，首屏可见多张卡片；素材仍是示例图。

## 公共导航状态

- 产品菜单打开后为两列面板，测量宽度 570px、高度约 222px；
- Crop Guide 打开后显示作物指南列表、Products 与 Contact 入口；
- Growing Practice 打开后显示 Fertigation、Greenhouse、Open field、Fruit trees；
- Smart Farming 打开后显示 Smart farming、Web tools、Mobile apps；
- Insights 打开后显示 Knowledge、Newsletter、Grower stories、FAQ、News and events；
- 面板内保留“Plant nutrition / Explore products”两级结构，链接在 hover/focus 时有下划线反馈；
- 菜单打开时页面没有横向溢出，点击其他 summary 可切换原生 `details` 状态；
- 桌面浏览器已逐项验证上述五个展开态，移动端另行验证 Menu 展开与 Escape 焦点返回。

## 390 × 844 移动首页

本地 `/en` 当前测量：

- header：60px；
- hero：top 60px，height 419.9px；
- interest：top 444.9px；
- 页面 scrollWidth 为 390px，没有横向溢出；
- MobileMenu 展开高度约 665px，仍无横向溢出；
- Escape 会关闭菜单并把焦点返回 Menu summary。

## 产品数据验证

- `/en/products`：10 条 sample product，全部来自 FLBOOK staging；
- `category=water-soluble`：当前 7 条示例产品；目录总数为 10 条 FLBOOK 产品草稿。
- 画册商品详情页能加载生成占位图，例如 `/en/products/medium-element-granular-draft` 使用 `/images/flbook-drafts/medium-element-granular-draft.svg`；对单页归属的 7 条产品，来源预览优先使用 `page-xx-product.jpg` 裁剪图，完整跨页仍保留在 staging 证据中；
- 画册数据仍保持 `owner-review`，没有写入正式 Payload 数据库。

## 补充视口矩阵

2026-11-08 通过本地浏览器补测：

| 视口 | Header | Hero | Interest 顶部 | 根横向溢出 | 备注 |
| --- | ---: | ---: | ---: | --- | --- |
| 1440 × 900 | 68px | top 68 / height 455px | 423px | 无 | 桌面导航完整显示 |
| 1060 × 720 | 68px | top 68 / height 455px | 423px | 无 | 产品菜单打开面板 570px，右边界未越界 |
| 1051 × 720 | 68px | top 68 / height 455px | 423px | 无 | 左右导航各约 422px，品牌卡片不与导航重叠 |
| 768 × 844 | 78px | top 78 / height 455px | 433px | 无 | 移动菜单入口出现 |
| 320 × 720 | 60px | top 60 / height 415.4px | 440.4px | 无 | 根布局 clientWidth 305px，滚动条占用宽度；横向产品/作物轨道保持内部滚动 |

320px 下的 `/en/products` 和 `/en/products/medium-element-granular-draft` 也已检查：目录卡片、详情主列和产品媒体均未造成根横向溢出。为隔离轨道内容与根页面，加入了 `html, body { overflow-x: clip }`，不会关闭轨道自身的横向滚动。

## 产品目录与详情对照

参考站产品目录在导航下直接进入面包屑和“左侧介绍/新品卡 + 右侧分类卡矩阵”的首屏结构；本地 `/en/products` 已移除此前误加的独立目录大横幅，采用同样的两区布局，左侧 featured product、右侧三类产品卡和右侧快捷入口均能在 1280px 首屏出现。参考站的分类图片和产品包装是正式素材，本地仍使用生成占位图和示例文案。

参考站产品详情使用“完整田野/产品横幅 + 面包屑 + 左侧产品正文 + 右侧经销商/询盘卡”的结构；本地 `/en/products/medium-element-granular-draft` 已按实时参考页调整为约 280px 的完整占位横幅，面包屑与长标题间距收紧，右侧询盘卡在标题下沿附近对齐，桌面不再显示额外固定底部询盘条，移动端仍保留联系入口。画册页码、来源预览图和审核状态保留在 staging 数据中。

中文对应页、产品筛选/分页和语言切换已有路由契约；后续仍需在真实内容、正式媒体和多语言开放前做同视口最终复核。

## 新闻内容页补测

2026-11-08 对照参考站 `news-events` 后，新闻列表和详情已复用知识/案例页的顶部农田横幅（`insight-banner`），并接入 `type=news|event` 切换，保持面包屑、搜索、媒体列表和详情正文的垂直节奏；`tests/prototype-smoke.test.mjs` 增加了横幅与活动筛选回归检查。当前活动记录仍是示例资料。

## FAQ 与知识中心补测

2026-11-08 对照参考站 FAQ 和 Haifa Blog：FAQ 首屏的农田横幅、面包屑、搜索、左侧分类栏和右侧折叠问题结构已在本地复用，当前问题与答案仍为 `owner-review` 示例；知识中心已具备顶部横幅、主题标签、关键词/作者筛选、文章卡片、详情和分页，标签数据仍是示例内容。

## 2026-11-08 高保真补齐

### 作物指南结构纠偏

实时查看参考站 `/crop-guide/vegetables/tomato` 后确认：作物页使用约 225px 的场景横幅，随后是面包屑和五个视觉章节入口，再进入正文、产品阶段表和咨询区域；首页式兴趣切换不属于作物详情首屏。本地方案页已移除详情中的 `InterestSection`，横幅收紧到同类高度，章节入口改为五张带图标占位的卡片并提升到正文标题之前。真实生长阶段、施肥表和产品关联仍保持待审核占位。

### 企业页首屏校准

实时查看参考站 `/about-us-0` 后，将企业页横幅左右边距收紧到约 16px，保留约 220px 横幅高度；面包屑、约 28px 的企业标题和绿色摘要对齐到参考站首屏节奏，并移除额外的 `About · Sample` 眉标题。企业主题卡、历程和占位说明继续由 Payload/sample 数据源驱动。

### FAQ 首屏校准

实时查看参考站 `/faq` 后确认其首屏顺序是横幅、面包屑、标题/简介、左侧 FAQ 分类和右侧折叠问题；本地搜索仍可用，但已移到问答布局之后，避免把分类与问题整体推离参考站首屏。问题答案和分类继续由 Payload/sample 数据源驱动。

### 新闻列表首屏校准

实时查看参考站 `/news-events` 后确认首屏顺序是横幅、面包屑、标题和 News/Events 筛选卡；本地隐藏了会占用首屏高度的示例简介，保留本地扩展的 All、News、Events 三种 URL 筛选，并将新闻搜索移到列表之后。新闻卡、分页和双语数据契约保持不变。

### 知识中心首屏复查

实时查看参考站 `/haifa-blog` 后，确认本地知识中心的横幅、面包屑、标题/绿色简介、主题筛选、关键词/作者筛选和文章卡顺序已经满足当前结构基线。本轮不移动知识中心控件，继续保留示例主题、作者和文章数据的后台替换边界。

### 案例列表首屏校准

实时查看参考站 `/success-stories` 后确认标题下直接进入双列成功故事卡片；本地隐藏示例简介、将搜索移到案例列表之后，并补齐标题到卡片约 88px 的留白。案例正文、图片和分页仍保持示例/后台替换边界。

### 联系页复查

本地联系页的桌面布局继续保持参考观察中的横幅、面包屑、左侧联系信息和右侧悬浮禁用表单；本轮参考站联系地址受到 Cloudflare 访问限制，未据此扩大视觉验收范围。正式收件渠道、隐私文案和询盘启用仍由 Payload/询盘开关控制。

### 共享首屏公共层二次校准

在同一运行中的本地预览端口 `3118` 与参考站 1280px 桌面首屏再次对照后，补齐了几项不依赖业主资料的公共层差异：

- 1201–1450px 桌面保留胶囊式站内搜索，收紧右侧导航间距，避免居中品牌占位卡遮挡 `COMPASSion`；
- 左侧一级导航默认使用品牌绿，展开时保留绿色下划线和箭头旋转状态；
- 右侧快捷入口改为约 17vh 起始位置，增加明确标注为待接入的无障碍占位，使联系、经销商和合作伙伴三项与参考站垂直节奏一致；
- 兴趣区桌面轨道限制为约六张卡的首屏宽度，保留内部横向滚动和两侧控制，避免一次展示过多卡片；
- 产品菜单通过可访问的 `details` 按钮打开后保持两列分组，截图与 AX 状态均确认面板展开、链接可见且未造成根横向溢出。

这次校准只调整公共布局、间距和占位交互，不复制参考站品牌标识或未经授权的图片；Hero、产品名和示例图仍保持 `owner-review` / `generated-placeholder` 状态。

- 共享桌面导航右侧已对齐参考站的 `COMPASSion`、`Precision IMPACT`、`Corporate`、`Insights` 顺序；保留搜索和语言入口，联系入口继续由右侧快捷区承载。品牌图形仍是明确标记的占位标识。
- 产品目录新增来源占位标记、面包屑和目录主体之间的垂直节奏；经实时参考页复查后移除独立大横幅，目录卡和筛选仍读取同一目录数据。
- 产品详情新增底部固定位置的预览询盘栏，链接到禁用的联系预览；不会发送数据。产品来源页、占位状态和右侧询盘预览仍保留。
- 产品详情横幅改为参考站的完整田野/产品视觉占位、白色边框和营养元素圆形装饰，产品标题继续位于横幅后的面包屑与正文区域；桌面右侧询盘卡和移动联系入口保持数据接入前的禁用预览。
- 通过 Edge 桌面浏览器复查 `/en`、`/en/products` 和 `/en/products/medium-element-granular-draft`，确认导航、目录横幅、详情横幅和询盘栏可见；`npm run typecheck` 与 21 项冒烟测试通过。
- 通过 Edge 桌面浏览器补查 `/zh/products` 和 `/zh/products/medium-element-granular-draft`，确认中文导航、目录分类、FLBOOK 卖点、来源页码、占位素材、中文详情字段和询盘预览均保持同一布局。
- 新闻页筛选已改为参考站风格的居中图标卡片，并为共用横幅加入叶片装饰；`All` 作为本地扩展筛选保留，News/Events 仍使用同一 URL 参数契约。
- 移动端共享头部补充语言和搜索入口，底部快捷栏改为 Contact、Distributor、Partner Zone 三列，并将后两项明确标为待接入；桌面快捷区继续保持三项竖向布局。
- 方案页横幅与产品详情横幅已隔离：方案页继续使用场景图、方案标题和兴趣叠层，产品页才使用橙色营养元素装饰；Edge 复查 `/en/solutions/greenhouse` 与参考站 `/nurseries` 首屏结构一致。
- 首页阶段 2 已完成三视口逐区复核：`1280×720`、`1440×900` 和 `390×844` 均通过 Microsoft Edge Playwright 截图确认。桌面端保留双侧导航、居中品牌卡片、Hero、兴趣选择、作物轨道和右侧快捷入口；移动端保留菜单/语言/搜索、Hero CTA、兴趣横滑、作物卡片轨道和三列底部快捷栏。截图保存在 `.local/viewport-audit/home-1280.png`、`.local/viewport-audit/home-1440.png`、`.local/viewport-audit/home-390.png`，三种视口均未出现根横向溢出。
