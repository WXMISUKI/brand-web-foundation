# 当前部署目标记录

状态：主域名已切换到新站，HTTPS 证书、443 入站规则、新内容回读和管理员初始化均已完成；当前以 `HANDOFF.md` 与上线验收矩阵为准。

## 目标

- 当前服务器：`43.160.216.74`
- SSH 用户：`ubuntu`
- SSH 端口：默认 `22`
- 本机密钥：`C:\Users\dddsg\.ssh\kowloon_web_sg_01.pem`
- 本机 SSH 配置中的 `103.118.42.167` 和 `43.161.225.174` 均不是截图中的当前实例，暂视为旧/其他服务器记录
- 项目目录：`/home/ubuntu/haifa-reference-rebuild`
- 应用服务：`haifa-reference.service`
- 应用端口：`127.0.0.1:3118`
- 数据库：PostgreSQL `haifa_reference`，角色 `haifa_app`
- 公网入口：Nginx `kowloonglobaltrading.com` / `www.kowloonglobaltrading.com` → `127.0.0.1:3118`
- HTTPS：Let’s Encrypt 证书已部署，证书文件由 Certbot 管理；80 端口跳转 HTTPS
- 旧服务：`brand-web.service`、`brand-cms.service` 已停止并禁用；旧 Nginx 配置保存在 `/etc/nginx/backup/kowloonglobaltrading.com.before-haifa`

## 当前连接结论

- 密钥文件存在，OpenSSH 能读取并识别为 RSA 2048 私钥。
- 针对旧配置目标的连接 TCP 可以建立，但在 SSH key exchange 之前出现 `kex_exchange_identification: Connection closed by remote host`。
- 这不是用户名、密码或密钥拒绝；它发生在认证前。
- 本机 Clash Verge 正在运行；既有运维记录说明其 TUN/auto-route 会接管并丢弃出站 22。需要临时关闭 TUN，或给目标 IP 配置 DIRECT 规则后重试。
- 关闭 TUN 后使用上述密钥连接当前服务器成功；服务器主机名为 `VM-0-12-ubuntu`，用户为 `ubuntu`。

## 历史连接故障背景

以下内容记录 2026-11-09 代理 TUN 导致的 SSH 连接故障及排查方法；当前 SSH 已恢复，不是未完成部署任务。

## 历史排查命令

1. 临时验证：Clash Verge → 设置 → 系统设置 → 关闭「Tun 模式」，不需要开启 IPv6；然后重新执行 SSH 检查。
2. 推荐长期配置：在 Clash 当前配置的 `rules:` 中、`MATCH` 规则之前加入：

   ```yaml
   - IP-CIDR,43.160.216.74/32,DIRECT,no-resolve
   ```

   保存并重载配置后，保持其他代理规则不变。
3. SSH 验证命令：

   ```powershell
   ssh -i C:\Users\dddsg\.ssh\kowloon_web_sg_01.pem -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new ubuntu@43.160.216.74
   ```

4. 新站已部署并接管主域名；公网 HTTP/HTTPS、英文/中文首页、产品详情、后台维护和 `/api/ready` 均已回读通过。TCP `80`/`443` 已在腾讯云防火墙放行，无需开启 IPv6。
5. 旧 `brand-web-foundation` 服务已停止并禁用，旧项目目录仅作为回滚备份保留，未删除数据库或文件。

私钥不进入仓库、不复制到服务器、不写入文档内容；文档只记录本机路径和目标元数据。
