# P2 正式内容审核包

日期：2026-11-09  
来源：[业主提供的 FLBOOK 画册](https://flbook.com.cn/c/LTc82gQQM3)  
当前状态：**WAITING-EXTERNAL**

本清单用于逐条确认正式发布资料。当前所有产品继续保持 `owner-review`、`claimsVerified=false`；勾选审核项不会自动写入生产数据库，需要在 Payload 后台逐条回读后再执行受控更新。

2026-11-09 已修复生产历史导入遗漏的审核/来源元数据：管理员视图下 10 条产品现在均有 `owner-review`、`claimsVerified=false`、素材状态、来源页和双语 counterpart；修复前备份为 `payload-2026-11-08T20-20-27-070Z.dump`。这次修复没有覆盖名称、简介、规格或后台人工字段。

2026-11-09 官方来源补充：7 条与原官网产品卡视觉一致的图片已写入 Payload 媒体；对应原官网详情页已追加到产品 `sourceNote`，文字和规格仍以 FLBOOK 页码为主。此次更新前备份为 `payload-2026-11-08T23-51-33-342Z.dump`，更新后仍保持 10 条 `owner-review`、0 条 `claimsVerified=true`。

## 逐产品清单

| # | 产品 slug | 中文名称 | English name | 来源页 | 规格行数 | 当前状态 | 必须审核 |
| ---: | --- | --- | --- | ---: | ---: | --- | --- |
| 1 | `medium-element-granular-draft` | 非水溶中量元素肥料 · 钙镁硅锌型 | Non-water-soluble secondary nutrient fertilizer · Ca-Mg-Si-Zn | 6–7 | 12 | owner-review | 名称、型号、包装、规格、claims、英中译文 |
| 2 | `organic-water-soluble-growth-draft` | 有机水溶肥料 · 促长靓叶生根 | Organic water-soluble fertilizer · Growth, leaf quality and rooting | 8 | 7 | owner-review | 名称、包装、规格、claims、英中译文 |
| 3 | `organic-water-soluble-quality-draft` | 有机水溶肥料 · 促长促叶生根 | Organic water-soluble fertilizer · Growth, foliage and rooting | 9 | 7 | owner-review | 名称、包装、规格、claims、英中译文 |
| 4 | `organic-water-soluble-absorption-draft` | 有机水溶肥料 · 抗逆促恢复 | Organic water-soluble fertilizer · Recovery and resilience | 10 | 7 | owner-review | 名称、包装、规格、claims、英中译文 |
| 5 | `organic-water-soluble-root-draft` | 有机水溶肥料 · 根系生长与保水 | Organic water-soluble fertilizer · Root growth and water retention | 12 | 7 | owner-review | 名称、包装、规格、claims、英中译文 |
| 6 | `suspended-fertilizer-120-60-400-draft` | 康姆®悬浮型 120-60-400+TE | Kangmu suspended water-soluble fertilizer · 120-60-400+TE | 14–15 | 12 | owner-review | 型号、包装、规格、claims、英中译文 |
| 7 | `suspended-fertilizer-200-150-200-draft` | 康姆®悬浮型 200-150-200+TE | Kangmu suspended water-soluble fertilizer · 200-150-200+TE | 16–17 | 12 | owner-review | 型号、包装、规格、claims、英中译文 |
| 8 | `massive-element-liquid-quality-draft` | 黄金屋®大量元素水溶肥料 · 提升产量品质液体型 | Huangjinwu liquid massive-element water-soluble fertilizer · Yield and quality | 18 | 6 | owner-review | 名称、包装、规格、claims、英中译文 |
| 9 | `medium-element-liquid-draft` | 黄金屋®中量元素水溶肥料 · 补充钙镁硅液体型 | Huangjinwu liquid secondary-element water-soluble fertilizer · Calcium, magnesium and silicon | 20 | 6 | owner-review | 名称、包装、规格、claims、英中译文 |
| 10 | `organic-inorganic-compound-draft` | 康姆®有机无机复混肥料 · 养分均衡改土型 | Kangmu organic-inorganic compound fertilizer · Balanced nutrition and soil structure | 22 | 0 | owner-review | 可靠定量表、型号、包装、claims、英中译文 |

## 统一审核项目

对每条产品完成以下项目后，才能考虑将 P2 正式内容门禁从 `WAITING-EXTERNAL` 推进：

- [ ] 中文名称与英文名称符合标签/包装最终版本。
- [ ] 型号、规格、包装重量/容量与当前销售资料一致。
- [ ] 规格表的单位、最小值、最大值、典型值逐项确认；没有可靠来源的字段保持空或明确待确认。
- [ ] 产品用途、材料和说明不包含未经批准的剂量、作物适用性、认证或效果承诺。
- [ ] `claimsVerified` 只有在逐条确认后才允许改为 `true`；未确认继续为 `false`。
- [ ] 英文、中文和后台富文本最终译文完成，且不存在 `await review`、重复标题或旧页码。
- [ ] 主图、包装、多图和场景图分别标记为业主素材、画册裁剪、授权示例或待补素材。
- [ ] 前台英文/中文页面、来源页码、规格表和后台记录逐条回读。

## 已知特殊项

- 第 22 页有机无机复混肥料没有可靠定量表，不能用第 23 页候选产品或 Haifa 参考站数值替代。
- 第 8、9 页两个有机水溶肥料英文标题已修正为不同名称，避免目录混淆。
- 第 10 页英文简介和第 6–7 页中文简介的生产漂移已修复；复合肥料仍保留更谨慎的“配方与宣称按需提供”文案。

## 发布门禁关系

`npm run check:p2-release` 当前应返回 `ready:false`，直到正式审核完成。即使该检查通过，仍需完成 P3 询盘收件、隐私、反垃圾、正式语言和 noindex 决策；它不会自动启用询盘或解除 noindex。
