# P2 参考链接与资料边界复验

日期：2026-11-09

> 范围说明：本文是 P2 资料边界历史复验；其中“询盘关闭/noindex 保护态”属于当时快照，已被后续 `docs/p3-release-decision-2026-11-09.md` 取代。当前状态以 `HANDOFF.md` 和当前阶段闸门为准。

状态：**PASS-SCOPED**。

## 来源口径

- 产品资料只以业主提供的 FLBOOK 浏览链接 `https://flbook.com.cn/c/LTc82gQQM3` 及浏览器可见的页级内容为来源。
- 页面结构、导航和交互只以已记录的 Haifa 公开网页为参考，不把参考站的品牌、配方、施用量、认证或案例事实复制为 KOMU 事实。
- PDF 文件不作为本轮提取、导入或发布来源；后台仍保留来源 URL、页码、预览图和审核状态供维护人员回读。

## 已修复

- 修正十条 staging 产品描述中的 viewer 页码与 `sourcePages` 不一致问题，并修复一处“产品产品”笔误。
- 将十条 staging 产品统一为 `owner-review` / `claimsVerified=false`，避免未来空库导入重新把未逐条核验的 claims 标成已批准。
- dry-run 校验改为分离公开回读与管理员回读：公开回读验证安全字段，管理员回读验证 `sourceUrl`、`sourceRelatedPages`、审核状态和素材状态；`npm run dry-run:flbook` 全量通过。
- 产品详情仍显示必要的画册页码和来源预览，但不再向买家显示 `excluded-candidate` 等内部候选页审计信息。
- 参考路由表补充产品系列、产品类型列表、种植方式、新闻与联系入口，并明确本地尚未形成独立系列页或种植方式索引页的差距。
- 生产 PostgreSQL 先生成 `.local/backups/payload-2026-11-08T17-12-50-931Z.dump`，再按 slug、locale 和旧简介精确匹配修正 20 条英中简介；3 条已被 P2 人工补充过审核后缀的简介用局部页码替换，未覆盖其余文字。

## 验收证据

- `npm run validate:flbook`：10 条产品，状态 `owner-review`。
- 校验器新增“简介必须引用首个来源页”和“`owner-review` 不得 claimsVerified=true”门禁，避免页码与审核状态再次漂移。
- `npm run dry-run:flbook`：10 产品、23 媒体、3 分类、3 作物指南、3 新闻、3 知识、3 案例、首页/企业 global、3 FAQ 组/6 FAQ 全部通过；临时 SQLite 和工作目录已清理。
- `npm run typecheck`、`git diff --check`：通过。
- 生产部署后 `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke`：23/23；`npm run test:seo`：4/4。
- 生产本机 `/api/ready`：数据库和媒体检查通过；standalone `server.js`、`.next/static`、`public`、favicon 均已准备并回读。
- 生产产品详情回读已确认 120-60-400+TE 显示 `Brochure page 14`，相关产品卡片页码也已同步；未再出现旧的 viewer 页码。
- 可读来源页的 76 条规格行已追加到 9 个产品，参数证据与未完成项见 `docs/p2-parameter-evidence-2026-11-09.md`。

## 仍未通过的外部门禁

- 正式技术参数、型号、单位、停产状态、claims 和最终译文仍需逐条业主确认。
- 参考站的独立产品系列页、完整种植方式索引和完整 13 语言正式内容尚未形成生产发布范围。
- 询盘收件、隐私告知、反垃圾和邮件/工单通知尚未确认，继续保持询盘关闭。
