# P3 发布决策记录

日期：2026-11-09  
决策：**按业主授权发布；2026-11-09 生产部署与当前范围最终回读完成**

## 当前发布边界

- 生产公开语言：业主已明确批准 13 个配置语言公开，默认英语；缺少人工译文的 CMS 字段使用英语源回退，不显示“翻译未完成”占位词。
- 最终部署：共享 Payload 初始化 Promise 与英语源回退已发布；systemd 冷启动资源页/首页均为 `200`，`/api/ready` 数据库与媒体检查通过。
- 询盘：业主已明确批准启用；当前实现写入 Payload `inquiries`，Contact 保留邮箱 `leon@kowloonglobaltrading.com` 和 WhatsApp `+852 9074 0009`。当前没有 SMTP/邮件适配器，因此不能声称已发送邮件通知。
- SEO：业主已明确同意解除 noindex；robots 允许抓取，页面使用 `index, follow`，sitemap/13 语言 alternate 已生成。
- 产品：10 条 FLBOOK 产品已按业主授权回读为 `approved` / `claimsVerified=true`；复合肥料仍没有可靠定量表，不补写虚构数值。原官网候选审核包的 21 条新增记录保持 `official-candidate` / `owner-review` / `claimsVerified=false`。
- 最终回归：公网 smoke 23/23，SEO 合同 5/5，官方候选合同、内容校验、语言合同和部署文件检查通过；生产媒体审计 14 页面、21 唯一媒体、0 重复哈希、0 generated/prototype 引用。390px Hebrew RTL 首页根/body 无横向溢出、无已加载失败图片、浏览器 console 0 errors/warnings。
- 回滚资料：部署前 PostgreSQL dump 与媒体归档保存在服务器 `/home/ubuntu/backups/haifa-2026-11-09-p3/`；上一版 standalone 也已保留在同目录。

## 多角色理由

- **项目经理**：业主已经给出正式发布授权，阶段目标从保护态切换为执行部署和证据收口；仍不能把未回读的生产部署当作完成。
- **架构师**：产品、询盘和 SEO 仍按独立门禁验收，避免一次配置变更掩盖数据库、隐私或收录失败。
- **内容负责人**：FLBOOK 10 条按来源批准；新增官方候选保留审核状态，避免把来源目录候选误写成已验证技术资料。
- **安全/隐私负责人**：表单只存 Payload，蜜罐、同意勾选和状态流转已实现；邮件通知能力未配置，必须在报告中明确这一限制。
- **运维负责人**：部署前已完成 PostgreSQL 备份；standalone 静态资源复制和共享 Payload 初始化修复已加入部署路径。
- **SEO/增长负责人**：语言路由、canonical、alternate、robots 和 sitemap 同步放行，缺失译文以英语源回退而不是占位词。
- **QA/前端负责人**：HTTP smoke 23/23、SEO 5/5、媒体审计和真实移动询盘提交已有证据；最后还需用同一版本完成生产冷启动和 13 语言回读。

## 已完成放行条件

1. 已部署共享 Payload 客户端和英语源回退；冷启动资源页与首页均返回 `200`，readiness 的数据库/媒体检查通过。
2. 已回读公网 smoke、SEO、候选产品审核边界、媒体重复检查；390px Hebrew RTL 浏览器检查通过。
3. 已保留 PostgreSQL、媒体和上一版 standalone 备份。表单只写后台；SMTP/API 邮件通知未配置，不能声称邮件送达。

本次正式发布由业主前序消息明确授权。短暂重启窗口内公网曾返回 502，旧进程优雅退出超时后被 systemd 强制结束；新进程已成功启动，后续 readiness、smoke 23/23、SEO 5/5 均通过。下一次外部资料或运行时策略变更应重新通过对应阶段验收。
