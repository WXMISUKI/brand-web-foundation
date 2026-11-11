# 媒体权利与来源清单（2026-11-10）

状态：`PASS-SCOPED / PARTIAL`。

本清单区分“来源可追溯”“当前使用边界”和“商业授权已确认”。HTTP 200、来源页面可访问或业主允许公开展示，都不自动等于长期商业版权确认。

## 当前媒体类别

| 类别 | 当前用途 | 来源/权利证据 | 当前结论 |
| --- | --- | --- | --- |
| FLBOOK 画册裁剪图 | 10 条产品主图、产品详情来源预览 | 业主提供 FLBOOK 链接，来源页码和裁剪文件已记录 | `PASS-SCOPED`；产品事实仍以画册，未新增 claims |
| 原官网官方图 | 企业、技术、7 条 FLBOOK 对应产品图及候选产品图 | 原官网 HTTP 页面、图片 URL、部分 SHA-256 字节级对照；业主已确认官方来源图片可作为长期商业资产 | `PASS-SCOPED`；产品规格/claims 仍按审核状态隔离 |
| Codex 生成图 | 仅英文方案/兴趣区通用场景 | 本项目生成记录，无文字、无品牌、无包装；不描述真实企业或产品效果 | `PASS-SCOPED`；只作示意，不能替代产品或企业证明 |
| Wikimedia Commons 图 | 英文玉米、小麦、草莓场景 | Commons 页面和原始发布页记录为 Public domain / PD-USDA / PD-self，来源记录保留 | `PASS-SCOPED`；继续保留来源和许可记录 |
| 历史 generated/prototype 图 | 未作为公网正式媒体 | 仅磁盘遗留或开发素材 | `PASS-SCOPED`；公网媒体审计未发现引用 |

## 当前引用与校验

- `englishSolutionImages` 只在英文展示层使用生成图或 Commons 图；中文及其他语言继续使用来源映射。
- 真实产品包装和产品主图没有用生成图替代；图片中的中文包装文字按原始产品材料保留，并用英文说明补充语境。
- 2026-11-10 公网媒体审计（120 秒超时）：14 个英中页面、22–23 个媒体 URL 可读、0 个 HTTP 错误、0 个生成/原型公网引用、0 个序列化 alt、0 个非预期媒体重复；个别媒体 body 读取存在瞬时超时，脚本现已记录为 warning 而不是中止审计。同一 `company-products.jpg` 的 API/静态路径重复属于路径复用。
- 本地关键文件已做 SHA-256 记录；生成图和 Commons 图的当前哈希如下：

| 文件 | SHA-256 |
| --- | --- |
| `public/images/illustrative/greenhouse-scene-v1.webp` | `bd6223106765789507ac612abb4cb79dbd640b7f0c88192ec637fe8ec586f98b` |
| `public/images/illustrative/orchard-scene-v1.webp` | `140cfed9e347439bed612e753399bdd8252851c6889f177f88b5ba8825c16432` |
| `public/images/illustrative/field-crops-scene-v1.webp` | `65655a4a0c0bb403e804076b9bab5524cec3a631ca01aae37319b3a476ecc67d` |
| `public/images/illustrative/fertigation-scene-v1.webp` | `284707978946a13ce805d43ce922ad7236773fd6a8af1d36374c1e6c7e198f09` |
| `public/images/illustrative/turf-scene-v1.webp` | `af6e4c6fab4f8301d89a9b1e8a60932b38f8abedc8e534f8392fb7fa88dbcfa4` |
| `public/images/third-party/commons-corn-liechtenstein.webp` | `4d6fc273cba06d9aa2a6158a740cecdbb3657176c9a7bb566311407a6a1034cd` |
| `public/images/third-party/commons-wheat-texas.webp` | `47a3d0a3d4ea3b8e8f40136a34fce10a4f50cfe9d776c142914321db268ab2e7` |
| `public/images/third-party/commons-strawberry-usda.webp` | `14caeca62f651080671c2e188a023c2ba9e2b6a23c47976d03afd2b9fd7f0f57` |

## 阶段 5 未完成项

1. 对官方候选的型号、包装、定量规格、claims 和销售状态继续保持 `owner-review / claimsVerified=false`。
2. 复合肥缺少可靠定量来源，继续不显示推断数值。

因此图片权利范围可以记为 `PASS-SCOPED`；阶段 5 整体仍为 `PASS-SCOPED / PARTIAL`，因为产品资料和 claims 尚未逐条签核。
