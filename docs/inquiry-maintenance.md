# 询盘维护（生产）

Payload 已配置 `inquiries` 集合，用于保存姓名、邮箱、国家、电话、角色、留言、语言、来源路径、同意状态、处理状态和业主备注。

治理参数和未决外部决策见 [询盘治理闸门](inquiry-governance-2026-11-10.md)。

生产已按业主授权设置 `INQUIRY_MODE=enabled`：公开 REST `POST /api/inquiries` 只允许创建记录，前台 Contact 表单可提交；读取、修改和删除需要管理员登录。邮件/SMTP 适配器尚未配置，因此成功提示只代表 Payload 已记录，不代表邮件已送达。

Contact 页面展示业主邮箱 `leon@kowloonglobaltrading.com` 与 WhatsApp `+852 9074 0009`，并说明站内询盘会记录给康姆团队处理。该记录链路不替代外部邮箱/WhatsApp，也不声称已完成通知送达。

生产验收已完成：

1. 正常提交一条带 `consent=true` 的记录；
2. 提交带隐藏 `website` 蜜罐值的请求，确认被拒绝；
3. 后台将状态从 `new` 改为 `in-progress`、`qualified` 或 `closed`；
4. 确认公开接口只允许创建，读取、修改和删除需要管理员登录；
5. 若要发送邮箱通知，再单独配置 SMTP/邮件适配器并增加送达回执验收。

新增集合后，旧的本地 SQLite 数据库需要重新推送 schema 或迁移；直接用旧数据库热更新时，`/api/inquiries` 可能因缺少表结构返回 500。正式 PostgreSQL 必须在迁移完成后再切换 `INQUIRY_MODE`。
