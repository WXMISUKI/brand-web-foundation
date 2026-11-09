# Systemd standalone 静态资源准备设计

## 意图

当前生产站使用 Next.js standalone 产物并由 systemd 启动。重新构建后，`.next/standalone` 不会自动包含 `.next/static` 与 `public`，会导致 SSR 仍返回 200，但 CSS、JavaScript 和 favicon 失败。目标是在不触碰数据库、媒体目录、Nginx 或 systemd unit 的前提下，把构建后的资源复制和完整性检查固化为可重复步骤。

## 目标与边界

- 目标：构建后安全地复制 `.next/static` 和 `public` 到 `.next/standalone`，并验证 `server.js`、静态目录和 favicon 存在。
- 目标：部署门禁能够检查脚本与文档仍然包含该步骤。
- 边界：不执行生产数据库导入，不删除或覆盖生产媒体，不改变现有发布目录和服务配置。
- 非目标：本轮不迁移 Docker、不设计 release 软链接回滚、不在 SSH 不可用时修改服务器。

## 备选方案

1. **构建后准备脚本（采用）**：新增 `prepare:standalone`，使用 Node `fs.cp` 非破坏性复制并校验结果。优点是改动小、可在 systemd 和 Docker 外部共用；代价是发布者必须在构建后调用一次。
2. **systemd release 包装脚本**：在服务器端按版本目录构建、复制、健康检查后切换软链接。回滚更完整，但需要改变当前服务器目录和 unit，必须等 SSH 恢复后单独验收。
3. **迁移 Docker Compose**：由 Dockerfile 负责复制和卷挂载。会改变当前 systemd 运维边界，本轮不采用。

## 实现约定

- 脚本默认工作区为仓库根目录，也支持传入构建目录参数以便部署脚本调用。
- 只允许源目录存在时复制；缺失源目录、`server.js` 或目标静态目录时失败。
- 复制完成后输出 JSON 摘要，不打印环境变量、数据库连接串或凭据。
- `check:deployment:files` 检查脚本、package script 与运行手册中的调用契约。
- 验证使用临时目录和现有静态资源检查；不运行生产导入或覆盖任何外部数据。
