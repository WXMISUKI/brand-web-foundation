# 语言菜单与公开文案生产发布（2026-11-11）

- 发布目标：`https://www.kowloonglobaltrading.com`，腾讯云 systemd `haifa-reference.service`。
- 发布包 SHA-256：`3396fc7136ce92a915099c9b7f7ce4c6419215efc24428d3da4eba7dd32f2e79`。
- 发布内容：RTL 语言菜单定位、只展示已接入 Contact 入口、公司与产品历史文案的精确旧值展示转换、隐藏公开页面内部审核流程说明。
- CMS 数据未由本次发布改写；已知历史文案在展示层精确匹配并转换，后台后来编辑过的不同文案原样显示。
- 发布前备份：服务器 `/home/ubuntu/haifa-reference-rebuild/.local/backups/language-copy-20261111T002616Z/`，包括 PostgreSQL custom dump、媒体清单及副本、源码和上一版 standalone。`pg_restore --list` 和媒体清单校验通过。
- 本地及远端生产构建、生产环境检查、standalone 静态资源复制、systemd 重启、health/readiness 通过。
- 公网浏览器：语言往返、快捷入口、公司及产品公开文案、关键交互共 10/10 通过；13 语言移动/桌面可返回英语。
- 公网只读基线首次并发检查时 `/it` 超时；单独回读 200，重跑基线 `ok: true`，13 语言、静态资源及媒体检查无 warning/error。
- 后台登录入口 `https://www.kowloonglobaltrading.com/admin/login`：200，登录表单可见；未执行登录或修改后台数据。
- 生产依赖审计输出 7 low、6 moderate；SMTP 未配置，邮件适配器 warning 仍属于既有运维范围。

回滚时应使用上述备份中的上一版 standalone 和源码；数据库及媒体仅在确有数据问题时按恢复手册处理，避免覆盖上线后新产生的询盘。
