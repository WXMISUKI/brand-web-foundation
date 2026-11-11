# UI 视觉验收与修复记录（2026-11-10）

本次验收针对首页 Header、语言选择器、桌面快捷入口、首页作物素材，以及浅色背景上的文字可读性。目标是统一组件规格，修复滚动状态和对比度问题，避免通过页面级零散补丁重复解决同类问题。

## 发现与修复

| 编号 | 发现 | 修复规则 | 验收证据 |
| --- | --- | --- | --- |
| V-01 | 页面下滚后中央品牌卡仍占据 Header 空间，遮挡首屏内容 | `header--scrolled` 状态下统一设置 `opacity: 0`、`visibility: hidden`、`pointer-events: none`，回到顶部恢复显示 | `tests/header-scroll.spec.mjs`：3/3 通过 |
| V-02 | English 后的下拉符号使用文本字符，基线和其他下拉控件不一致 | 使用 12px SVG chevron，和语言文字通过 `inline-flex` 垂直居中；展开时旋转 180° | 本地桌面截图 `en-products-desktop-1280.png` |
| V-03 | 右侧四个快捷入口的图标、标题、辅助文字尺寸不一致；旧的 `span` 通用规则会放大 Contact | 所有入口统一使用 `desktop-quick-link`、`desktop-quick-link-icon`、`desktop-quick-link-label` 三层结构，并以更高优先级覆盖旧通用规则 | 本地桌面截图 `en-products-desktop-1280.png` |
| V-04 | 英文作物卡复用同一批素材，语义重复 | 增加 6 张英文示意图，并在 `section-media.ts` 按作物语义映射：玉米、小麦、温室蔬菜、草莓、甜菜、大蒜 | `tests/featured-media.test.mjs`：3/3 通过 |
| V-05 | 公司聚焦区域的图片层级高于遮罩，浅色包装图上使用白字导致对比度不足 | 图片降亮度并降低饱和度；统一增加深色渐变遮罩；内容层提升到 `z-index: 2`，文字增加轻微阴影 | 本地页面矩阵：24/24 通过；首页移动截图已复核 |

## 新增素材

以下素材为英文场景示意图，已转为 1200×900 WebP，并在 `docs/illustrative-generated-images-2026-11-10.md` 登记来源：

- `public/images/illustrative/corn-field-v2.webp`
- `public/images/illustrative/wheat-field-v2.webp`
- `public/images/illustrative/vegetable-greenhouse-v2.webp`
- `public/images/illustrative/strawberry-row-v2.webp`
- `public/images/illustrative/sugar-beet-field-v2.webp`
- `public/images/illustrative/garlic-field-v2.webp`

这些图片只替换英文作物场景，非英文官方来源映射保持不变。

## 验收范围

- `npm run typecheck`：通过。
- `tests/featured-media.test.mjs`：3/3 通过。
- `tests/header-scroll.spec.mjs`：3/3 通过。
- `tests/desktop-quick-links-layout.spec.mjs`：13 个语言 × 2 个桌面宽度通过，长语言标签未超出快捷入口卡片。
- 本地 `acceptance-production-browser.spec.mjs` 快速矩阵：24/24 通过。
- 首轮全量矩阵发现 6 条 nl/el/ru 桌面快捷入口溢出；补充共享换行规则后，第二轮全量矩阵 150/150 通过。状态码、语言方向、水平溢出、可见图片、占位文案、控制台错误和失败请求均通过。
- 本次未执行生产写入或部署；生产环境仍需单独的发布审批和发布后只读验收。

## 后续维护约束

1. 新增 Header 控件必须复用现有 flex 对齐和 SVG 图标规则，不再使用文本字符模拟图标。
2. 新增快捷入口必须复用三层结构和固定尺寸变量，禁止在单个入口上覆盖字号。
3. 图片型 Banner 必须先确认文字与最亮背景区域的对比度，再确定遮罩和文字颜色。
4. 英文示意素材与官方产品/包装素材分开登记；替换素材时同步更新媒体测试和登记文档。

## 生产发布记录（2026-11-11）

- 发布目标：腾讯云 `43.160.216.74`，`haifa-reference.service`，Next 16.4.5 / Payload 3.93.0 / Sharp 0.35.5。
- 发布包 SHA-256：`f06cafebfd0cfc1da1586e193c6297386129f628c9ce386b43014562dee4034d`。
- 发布前备份：服务器 `.local/backups/deployment-20261111-ui-polish/`，包含源码归档和上一版 standalone 归档；未修改数据库或媒体卷。
- 远端 `check:production-env`、生产构建、`prepare:standalone`、systemd 重启和本机 readiness 均通过。
- 公网 `audit:public-baseline`：`ok: true`；13 个语言首页、health/readiness、robots/sitemap、静态资源和匿名 API 边界通过。
- 公网浏览器快速矩阵：24/24 通过；生产关键交互与 Hebrew RTL 边界：1/1 通过。
- 已知非阻塞提示：两个历史媒体请求响应较慢，最终 HTTP 200；生产仍未配置 SMTP，Payload 日志中的邮件适配器 warning 属于既有运维边界。
- 回滚方式：保留服务器上一版 standalone 归档，停止当前服务后恢复该归档，再执行 readiness 和公网只读检查。

### 发布后热修复

首轮发布后的公网产品页截图发现 Payload 说明文案被错误放在 CSS Grid 的第三个子节点，导致产品分类卡整体下移。已将说明移入左侧介绍卡，重新构建并以发布包 `f19b5b3145ca53eaaf7141641ed107c841ffe3532d4c56b211f4326077c40cbc` 发布；热修复前版本已备份至服务器 `.local/backups/deployment-20261111-ui-polish-r2/`。热修复后的产品页分类卡回到首屏，公网基线 `ok: true`、浏览器快速矩阵 24/24、关键交互 1/1 通过。
