# UI 自动化验收方案（2026-11-11）

## 本地一键运行

首次准备（项目要求的 Node 版本见 `.nvmrc`）：

```sh
npm ci
npx playwright install chromium
```

之后运行：

```sh
npm run test:ui
```

需要更广范围的页面矩阵时，可执行 `npx playwright test --config=playwright.deep.config.mjs`。它使用同样的隔离服务，当前按配置选择 150 个语言、页面和视口组合，运行时间较长；不是 13 种语言与所有页面和设备的全组合。

该命令先检查公开文案、后台编辑保护及迁移快照，再启动 `localhost:3125` 的隔离示例站执行 Chromium 浏览器验收。随后单独启动隔离询盘测试并发送无效测试请求。无需先手动启动网站；3125 已被占用时会停止并报告，不复用未知服务。测试使用独立 SQLite 和示例目录，不连接生产数据库，不向生产提交表单。

## 当前自动覆盖

- 企业名称：对代码和种子文案检查已确认的误写，隔离示例站抽查中文首页、企业、联系及 FAQ；精确历史值转换另有单元测试。后台人员新编辑的内容需另行检查，不能由静态源代码测试覆盖。
- 未接入入口：13 种语言、手机和桌面检查订阅和移动应用等入口未出现在导航中。
- 视觉回归：中文页头的 Windows 桌面与手机基准图；当前不是全页面视觉验收，也不代表 Linux/macOS 已有基准。需要先人工确认差异，再在固定环境中运行 `npx playwright test --config=playwright.ui.config.mjs tests/content-acceptance.spec.mjs --update-snapshots` 更新；不要无条件接受基准变化。
- 无障碍：axe-core 在中文首页、企业介绍和联系页的 390px 与 1280px 执行 WCAG 2 A/AA 和 2.1 A/AA 自动规则。仅代表这些页面和状态，不能代替人工或完整无障碍审计。
- 扩展无障碍：13 种语言首页与联系页，390px 和 1280px 共 52 种组合；仅覆盖测试时状态。
- 页头几何：13 种语言、1024/1100/1280/1440/1910px 检查可见导航项不与品牌标志重叠。
- 询盘：使用启用询盘的隔离服务检查空值、数组、字符串、数字、空对象与无效 JSON 均返回 400，不创建询盘。
- 精确数据修复：使用本地 PGlite 临时表验证 22 个预期字段、干跑、重复执行及编辑冲突保护；本地 PostgreSQL 16 也做过对应事务测试。这个测试不会连接或更新生产数据库。

- 语言切换：意大利语→希伯来语→英语在 320、390、768、1280、1910px 的往返；12 个非英语语言在 390、1910px 返回英语；检查菜单和链接横向边界。
- Header：滚动隐藏与回到顶部恢复；桌面快捷入口长文案边界。
- 快捷入口：13 个语言的手机与桌面仅展示可用 Contact，不展示未接入入口。
- 页面矩阵：英文、中文、希伯来语的首页、产品、联系、新闻在手机和桌面共 24 项；检查状态码、语言方向、根横向溢出、可见图片、占位文案、浏览器控制台和失败请求。
- 关键交互：手机导航、Escape、语言菜单、FAQ 展开、产品详情入口和希伯来语 RTL 边界。
- 文案保护：13 种语言的已知历史公司文案、已知候选产品旧模板，以及后台自定义文案不被覆盖。
- 页面文案：英文和中文的产品、系列及种植方案页面不展示内部审核流程提示。

失败时 Playwright 在 `test-results/` 保存截图、错误上下文与 `trace.zip`；可用 `npx playwright show-trace <trace.zip>` 查看操作步骤、DOM 和网络。矩阵明细与部分截图保存在 `output/acceptance/`。

## 后台公开内容只读检查

先启动需要检查的隔离网站，再设置 `PUBLIC_BASE_URL` 指向该网站，运行 `npm run audit:cms-copy`。`AUDIT_LOCALES=zh,en` 可限定语言；默认检查 13 种语言的公开企业介绍、首页、FAQ、分类、新闻、知识文章、案例和作物指南的选定文本字段，以及文章富文本中标准文字节点。该命令只读取公开接口，不读取询盘或用户数据，输出字段路径和规则，不输出正文。产品接口需要登录而不在本扫描范围；图片中文字、富文本的非标准节点也未覆盖。它检查的是 **CMS 原始内容**，即使前台对历史旧值有展示转换，旧值仍会被报告；报告需要通过后台修正后才能消除。任何列表超过 100 条会报错而不是假装全部检查完成。不要把本命令视为完整词法、事实或语言质量审核。

## 调研与建议

1. **Playwright**：现有项目已采用并固定版本，支持真实浏览器操作、断言、录制、不同浏览器/屏幕尺寸和失败轨迹。当前推荐继续使用，避免重复建设。[操作录制](https://playwright.dev/docs/codegen)、[Trace Viewer](https://playwright.dev/docs/trace-viewer)、[多浏览器项目](https://playwright.dev/docs/test-projects)。
2. **截图对比**：Playwright 内置基线截图对比；Chromatic、Applitools 等可与现有 Playwright 流程结合，提供视觉差异管理。基线需要在稳定环境建立，并审核有意的设计变化；当前一键流程只保存截图，尚未配置自动基线比对。[Playwright 视觉对比](https://playwright.dev/docs/test-snapshots)、[Chromatic Playwright 集成](https://www.chromatic.com/docs/playwright/)、[Applitools Playwright](https://applitools.com/docs/eyes/playwright)。
3. **无障碍检查**：`@axe-core/playwright` 已接入上述六个页面/视口组合，可检查自动识别的对比度和标签等问题；未覆盖的语言、页面、交互状态和人工无障碍检查仍需另行验收。[Playwright 无障碍测试](https://playwright.dev/docs/accessibility-testing)。
4. **持续集成**：可将相同的 `npm run test:ui` 接入 GitHub Actions，在提交或合并请求时自动运行并保存失败证据。当前尚未配置自动触发。[GitHub Actions Node.js 测试](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)。

## 范围限制

自动化只验证脚本走到的页面、状态、断点和断言，不能证明所有业务、真实 CMS 数据、每种设备或视觉语义都正确。截图收集不是截图比对；自动无障碍扫描也不能替代人工判断。生产发布后仍需对真实 Payload 内容和线上只读关键路径做定向回读。
