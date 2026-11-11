# PostgreSQL 备份与恢复运行手册

当前项目生产环境要求 `PAYLOAD_DATABASE=postgres`、`DATABASE_URL` 和持久化 `PAYLOAD_MEDIA_DIR`。仓库提供两个显式入口：

```bash
npm run backup:postgres -- .local/backups/payload-YYYYMMDD.dump
```

备份脚本调用 `pg_dump` 的 custom format，默认读取 `BACKUP_DIR`，也可以通过 `PG_DUMP_BIN` 指定二进制路径。命令输出只报告文件路径、格式和大小，不打印数据库连接串。

恢复会清理目标数据库中的现有对象，必须显式设置确认变量：

```bash
RESTORE_CONFIRM=YES npm run restore:postgres -- .local/backups/payload-YYYYMMDD.dump
```

Windows PowerShell 使用 `$env:RESTORE_CONFIRM="YES"`。恢复脚本支持 `PG_RESTORE_BIN`，并使用 `--clean --if-exists --no-owner --no-privileges`。2026-11-08 已在生产 P0 dump 基础上完成隔离 PostgreSQL 恢复演练：生产数据库未被重导，`media=23`、`products=10`、`news=3`、`insights=3`、`cases=3`、`crop_guides=3`、`faqs=6`、`inquiries=0` 与快照一致。

媒体卷使用独立的跨平台清单备份，清单记录每个文件的相对路径、字节数和 SHA-256：

```bash
PAYLOAD_MEDIA_DIR=/app/data/media npm run backup:media -- /backups/media-YYYYMMDD
RESTORE_MEDIA_CONFIRM=YES npm run restore:media -- /backups/media-YYYYMMDD /app/data/media-restored
```

备份目标默认必须为空；恢复目标非空时还需要显式设置 `RESTORE_MEDIA_OVERWRITE=YES`。恢复后脚本会重新计算清单并拒绝缺失、额外或哈希不一致的文件。2026-11-08 的隔离恢复同时校验了 69 个媒体文件、61290012 bytes 和 SHA-256 清单；PostgreSQL dump 与媒体清单使用同一备份编号，并完成 Payload 数据和媒体 URL 回读。

Payload schema 变更使用项目内迁移生成脚本：

```bash
PAYLOAD_DATABASE=postgres \\
DATABASE_URL=postgresql://user:password@host:5432/fertilizer \\
PAYLOAD_SECRET='至少 32 位随机密钥' \\
npm run migration:create -- add_descriptive_name
```

迁移生成器以 `src/migrations` 最新 snapshot 为基线，生成 TypeScript migration 和 JSON snapshot；提交前必须审阅 SQL，部署时由 PostgreSQL adapter 按顺序执行。当前已生成并接入 `20261108_005020_sync_current_schema`，覆盖询盘、作物指南、产品来源字段和相关关系表。

## 联合备份入口

仓库提供 `scripts/backup-bundle.mjs` 将 PostgreSQL custom dump 与媒体 manifest 绑定在同一备份目录。它会依次执行数据库和媒体备份，写入 `backup-status.json`；任一步失败都以非零退出，并对错误中的 `DATABASE_URL` 做脱敏。

```bash
DATABASE_URL=postgresql://user:password@host:5432/fertilizer \\
PAYLOAD_MEDIA_DIR=/var/lib/fertilizer/media \\
node scripts/backup-bundle.mjs /var/backups/haifa/bundle-YYYYMMDD
```

该入口只提供可供 cron/systemd timer/外部调度器调用的原子动作，不决定频率、保留、异地、加密或告警接收人。生产排程实施前仍需完成 `docs/ops-continuity-governance-2026-11-10.md` 的 O1 决策。
